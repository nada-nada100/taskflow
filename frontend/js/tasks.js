import { apiRequest, getToken } from './api.js';
import { showToast } from './toast.js';

if (!getToken()) window.location.href = 'login.html';

const taskForm = document.getElementById('taskForm');
const taskContainer = document.getElementById('taskContainer');
const statusFilter = document.getElementById('statusFilter');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');

let taskChart = null;
let isLoading = false;

function debounce(fn, delay = 300) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

document.addEventListener('DOMContentLoaded', loadTasks);

statusFilter?.addEventListener('change', loadTasks);
categoryFilter?.addEventListener('change', loadTasks);
searchInput?.addEventListener('input', debounce(loadTasks, 300));

taskForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const category = document.getElementById('taskCategory').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    
    if (!title) {
        showToast('Please enter a task title', 'warning');
        return;
    }
    
    try {
        const result = await apiRequest('/tasks', 'POST', {
            title: title,
            description: description || '',
            category: category || '',
            dueDate: dueDate || '',
            status: 'pending'
        });
        
        if (result.ok) {
            taskForm.reset();
            showToast('Task created successfully!', 'success');
            await loadTasks();
        } else {
            showToast(result.data.message || 'Failed to create task', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
});

async function loadTasks() {
    if (isLoading) return;
    isLoading = true;
    showLoading(true);
    
    try {
        const params = new URLSearchParams();
        if (statusFilter?.value) params.append('status', statusFilter.value);
        if (categoryFilter?.value) params.append('category', categoryFilter.value);
        if (searchInput?.value.trim()) params.append('search', searchInput.value.trim());
        
        const query = params.toString();
        const result = await apiRequest(query ? `/tasks?${query}` : '/tasks', 'GET');
        
        if (result.ok) {
            renderTasks(result.data.tasks);
            updateStats(result.data.tasks);
            await loadChartStats();
        } else if (result.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        showToast('Error loading tasks', 'error');
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

function renderTasks(tasks) {
    if (!tasks?.length) {
        taskContainer.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>${searchInput?.value ? 'Try adjusting your search' : 'Add your first task above!'}</p>
            </div>
        `;
        return;
    }
    
    taskContainer.innerHTML = tasks.map(task => `
        <div class="task-item ${task.status === 'completed' ? 'completed' : ''}">
            <div class="task-info">
                <h4>${escapeHtml(task.title)}</h4>
                ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ''}
                <div class="task-meta">
                    ${task.category ? `<span>Category: ${escapeHtml(task.category)}</span>` : ''}
                    ${task.due_date ? `<span>Due: ${formatDate(task.due_date)}</span>` : ''}
                    <span class="status-badge ${task.status || 'pending'}">${task.status || 'pending'}</span>
                </div>
            </div>
            <div class="task-actions">
                <select class="status-select" data-id="${task.id}">
                    ${['pending', 'in-progress', 'completed'].map(s => 
                        `<option value="${s}" ${task.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
                    ).join('')}
                </select>
                <button class="btn-delete" data-id="${task.id}">Delete</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.status-select').forEach(el => el.addEventListener('change', handleStatusChange));
    document.querySelectorAll('.btn-delete').forEach(el => el.addEventListener('click', handleDelete));
}

async function handleStatusChange(e) {
    const select = e.target;
    const result = await apiRequest(`/tasks/${select.dataset.id}`, 'PUT', { status: select.value });
    if (result.ok) {
        showToast('Status updated!', 'success');
        await loadTasks();
    } else {
        showToast(result.data.message || 'Failed to update', 'error');
    }
}

async function handleDelete(e) {
    if (!confirm('Delete this task?')) return;
    const result = await apiRequest(`/tasks/${e.target.dataset.id}`, 'DELETE');
    if (result.ok) {
        showToast('Task deleted', 'info');
        await loadTasks();
    } else {
        showToast(result.data.message || 'Failed to delete', 'error');
    }
}

function updateStats(tasks) {
    document.getElementById('totalTasks').textContent = tasks?.length || 0;
    document.getElementById('todoTasks').textContent = tasks?.filter(t => t.status === 'pending' || t.status === 'todo').length || 0;
    document.getElementById('inProgressTasks').textContent = tasks?.filter(t => t.status === 'in-progress').length || 0;
    document.getElementById('completedTasks').textContent = tasks?.filter(t => t.status === 'completed').length || 0;
}

function showLoading(show) {
    const container = document.getElementById('taskContainer');
    if (show) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading tasks...</p>
            </div>
        `;
    }
}

async function loadChartStats() {
    const result = await apiRequest('/stats/summary', 'GET');
    if (result.ok) updateChart(result.data.stats);
}

function updateChart(stats) {
    const ctx = document.getElementById('taskChart');
    if (!ctx) return;
    
    const data = [stats.todo || 0, stats.inProgress || 0, stats.completed || 0];
    
    if (taskChart) {
        taskChart.data.datasets[0].data = data;
        taskChart.update();
    } else {
        taskChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Todo', 'In Progress', 'Completed'],
                datasets: [{
                    data: data,
                    backgroundColor: ['#ffd43b', '#74c0fc', '#69db7c'],
                    borderColor: ['#fcc419', '#4dabf7', '#40c057'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom', labels: { padding: 20, font: { size: 14 } } } }
            }
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}