# TaskFlow - Test Checklist

## ✅ Authentication

### Register
- [ ] Register with valid data → Success, redirect to dashboard
- [ ] Register with empty name → Error message
- [ ] Register with empty email → Error message
- [ ] Register with empty password → Error message
- [ ] Register with short password (< 6 chars) → Error message
- [ ] Register with invalid email format → Error message
- [ ] Register with already used email → "User already exists"
- [ ] Register with very long name (100+ chars) → Should handle gracefully
- [ ] Register with special characters in name → Should work

### Login
- [ ] Login with valid credentials → Success, redirect to dashboard
- [ ] Login with empty email → Error message
- [ ] Login with empty password → Error message
- [ ] Login with wrong email → "Invalid email or password"
- [ ] Login with wrong password → "Invalid email or password"

### Logout
- [ ] Click logout → Redirect to login page
- [ ] After logout, cannot access dashboard

---

## ✅ Task Management

### Create Task
- [ ] Create task with title only → Success
- [ ] Create task with all fields → Success
- [ ] Create task with empty title → Error message
- [ ] Create task with very long title (200+ chars) → Should handle
- [ ] Create task with special characters (emoji, symbols) → Should work
- [ ] Create task without token → 401 Unauthorized

### View Tasks
- [ ] Dashboard loads tasks on page load
- [ ] Only YOUR tasks appear (not other users')
- [ ] Empty state shows when no tasks
- [ ] Stats cards update correctly
- [ ] Chart shows correct data

### Update Task (Status)
- [ ] Change status from Todo → In Progress → Completed
- [ ] Status updates immediately in UI
- [ ] Stats update after status change
- [ ] Chart updates after status change

### Delete Task
- [ ] Delete task → Confirmation popup
- [ ] Confirm delete → Task removed
- [ ] Cancel delete → Task stays
- [ ] Stats update after delete
- [ ] Chart update after delete

---

## ✅ Filters & Search

### Status Filter
- [ ] Filter by Todo → Only todo tasks
- [ ] Filter by In Progress → Only in-progress tasks
- [ ] Filter by Completed → Only completed tasks
- [ ] Filter by All Status → All tasks

### Category Filter
- [ ] Filter by Personal → Only personal tasks
- [ ] Filter by Work → Only work tasks
- [ ] Filter by Study → Only study tasks
- [ ] Filter by All Categories → All tasks

### Search
- [ ] Search by keyword → Only matching tasks
- [ ] Search with no results → Empty state
- [ ] Search with special characters → Should work
- [ ] Search case sensitivity → Should be case-insensitive
- [ ] Debounce works (doesn't search on every keystroke)

### Combined Filters
- [ ] Status + Category → Both filters apply
- [ ] Status + Search → Both filters apply
- [ ] Category + Search → Both filters apply
- [ ] All three filters → All apply

---

## ✅ UI/UX

- [ ] Dark mode toggle works
- [ ] Dark mode preference saved
- [ ] Toast notifications appear
- [ ] Toast notifications disappear
- [ ] Loading spinner shows
- [ ] Hover effects work on buttons
- [ ] Responsive on mobile
- [ ] Responsive on tablet

---

## ✅ Edge Cases

- [ ] Very long task titles (200+ chars)
- [ ] Very long descriptions (500+ chars)
- [ ] Special characters in titles: !@#$%^&*()
- [ ] Emojis in titles: 😊🎉👍
- [ ] SQL injection attempts: `' OR '1'='1`
- [ ] Script injection attempts: `<script>alert('xss')</script>`
- [ ] Two browser tabs at once
- [ ] Multiple users at same time

---

## ✅ Security

- [ ] Cannot access dashboard without token
- [ ] Cannot view other users' tasks
- [ ] Cannot update other users' tasks
- [ ] Cannot delete other users' tasks
- [ ] Token stored in localStorage
- [ ] Token sent with every API request