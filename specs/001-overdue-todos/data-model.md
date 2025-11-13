# Data Model: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Date**: 2025-11-13  
**Status**: No schema changes required

---

## Overview

The overdue todo feature does NOT require any changes to the existing data model. Overdue and due-today states are **calculated properties** derived from comparing the `dueDate` field with the current client date at render time.

---

## Existing Entity: Todo

**Storage Location**: Backend in-memory array (via `packages/backend/src/services/todoService.js`)

### Schema (Unchanged)

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | Unique identifier (UUID) | Auto-generated |
| `title` | string | Yes | Todo item title | Max 255 characters |
| `dueDate` | string (ISO date) | No | Due date in YYYY-MM-DD format | Valid date or null |
| `completed` | boolean | Yes | Completion status | true or false |
| `createdAt` | string (ISO timestamp) | Yes | Creation timestamp | Auto-generated |

### Example

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Finish the copilot bootcamp",
  "dueDate": "2025-11-15",
  "completed": false,
  "createdAt": "2025-11-13T10:30:00.000Z"
}
```

---

## Calculated Properties (Client-Side Only)

These properties are **not stored** in the database or backend. They are computed on-the-fly in the frontend during rendering.

### `isOverdue`

**Type**: `boolean`  
**Calculation**: `dueDate < currentDate && completed === false`  
**Purpose**: Determines if overdue icon (clock/hourglass) should be displayed

**Logic**:
```javascript
function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  return dueDate < today;
}
```

**Examples**:
- `dueDate = "2025-11-12"`, `completed = false`, `currentDate = 2025-11-13` → `true` (overdue)
- `dueDate = "2025-11-13"`, `completed = false`, `currentDate = 2025-11-13` → `false` (due today, not overdue)
- `dueDate = "2025-11-14"`, `completed = false`, `currentDate = 2025-11-13` → `false` (future)
- `dueDate = "2025-11-12"`, `completed = true`, `currentDate = 2025-11-13` → `false` (completed)
- `dueDate = null`, `completed = false`, `currentDate = 2025-11-13` → `false` (no due date)

### `isDueToday`

**Type**: `boolean`  
**Calculation**: `dueDate === currentDate && completed === false`  
**Purpose**: Determines if due-today icon (calendar) should be displayed

**Logic**:
```javascript
function isDueToday(dueDate, completed) {
  if (!dueDate || completed) return false;
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  return dueDate === today;
}
```

**Examples**:
- `dueDate = "2025-11-13"`, `completed = false`, `currentDate = 2025-11-13` → `true` (due today)
- `dueDate = "2025-11-12"`, `completed = false`, `currentDate = 2025-11-13` → `false` (overdue, not due today)
- `dueDate = "2025-11-14"`, `completed = false`, `currentDate = 2025-11-13` → `false` (future)
- `dueDate = "2025-11-13"`, `completed = true`, `currentDate = 2025-11-13` → `false` (completed)

---

## State Transitions

The Todo entity has the following state transitions (unchanged by this feature):

```
[Created] → incomplete, no icons (if no due date or future date)
    ↓
[Due Date Arrives] → displays "due today" calendar icon (if incomplete)
    ↓
[Next Day] → displays "overdue" clock icon (if still incomplete)
    ↓
[Marked Complete] → icons disappear, strikethrough applied
```

**No backend state changes**: The `completed` boolean is the only stored state. Overdue/due-today are purely visual presentation states calculated client-side.

---

## Data Flow

### Read Flow (GET /api/todos)

```
Backend (todoService)
    ↓
Returns array of Todo objects with { id, title, dueDate, completed, createdAt }
    ↓
Frontend (TodoCard component)
    ↓
For each todo:
  - Calculate isOverdue(dueDate, completed)
  - Calculate isDueToday(dueDate, completed)
  - Render appropriate icon (or none)
    ↓
Display in UI
```

### Update Flow (PUT /api/todos/:id or toggle completion)

```
User marks todo complete
    ↓
Frontend sends { completed: true } to backend
    ↓
Backend updates todo.completed
    ↓
Frontend re-renders TodoCard
    ↓
isOverdue() and isDueToday() now return false (due to completed === true)
    ↓
Icons disappear
```

**No special handling needed**: Existing update logic automatically triggers re-render, which recalculates overdue/due-today status.

---

## Validation Rules (Unchanged)

Existing validation for `dueDate` field:
- Must be valid ISO date string (YYYY-MM-DD format) or null
- Future dates allowed (no restriction)
- Past dates allowed (no restriction)

**No new validation needed**: Overdue feature does not restrict what dates users can set.

---

## Performance Considerations

### Calculation Cost

- **isOverdue()**: O(1) - simple string comparison and boolean check
- **isDueToday()**: O(1) - simple string equality and boolean check
- **Per-render cost**: Negligible (<1ms per todo item)

### Scaling

For 100 todos (expected max):
- Total calculation time: ~100ms worst case (1ms × 100)
- Well within performance goal of <1 second for icon rendering

**No optimization needed**: Date comparison is fast enough for single-user app scale.

---

## Migration Plan

**No migration required**: 
- No database schema changes
- No data transformation needed
- No backend service updates
- Existing todos immediately work with overdue feature (backward compatible)

---

## Testing Data

### Test Fixtures

Create test todos with various due dates for manual and automated testing:

```javascript
// packages/frontend/src/__tests__/fixtures/todoFixtures.js

export const testTodos = {
  overdueTodo: {
    id: '1',
    title: 'Overdue task',
    dueDate: '2025-11-12', // yesterday
    completed: false,
    createdAt: '2025-11-01T00:00:00Z'
  },
  dueTodayTodo: {
    id: '2',
    title: 'Due today task',
    dueDate: '2025-11-13', // today
    completed: false,
    createdAt: '2025-11-01T00:00:00Z'
  },
  futureTodo: {
    id: '3',
    title: 'Future task',
    dueDate: '2025-11-15', // future
    completed: false,
    createdAt: '2025-11-01T00:00:00Z'
  },
  completedOverdueTodo: {
    id: '4',
    title: 'Completed overdue task',
    dueDate: '2025-11-10', // past
    completed: true,
    createdAt: '2025-11-01T00:00:00Z'
  },
  noDueDateTodo: {
    id: '5',
    title: 'No due date task',
    dueDate: null,
    completed: false,
    createdAt: '2025-11-01T00:00:00Z'
  }
};
```

---

## Summary

| Aspect | Impact |
|--------|--------|
| **Backend Changes** | None - no schema or API modifications |
| **Frontend Storage** | None - calculated on-the-fly, not persisted |
| **Migration** | None - backward compatible with existing data |
| **Performance** | Negligible - O(1) calculations per todo |
| **Testing** | Standard unit tests with mocked current date |

**Status**: ✅ Data model analysis complete. No changes required.
