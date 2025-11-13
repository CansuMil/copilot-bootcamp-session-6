# API Contracts

**Feature**: 001-overdue-todos  
**Date**: 2025-11-13

---

## Summary

**No API contract changes required** for the overdue todo items feature.

---

## Rationale

The overdue and due-today states are **client-side calculated properties** based on comparing the existing `dueDate` field with the current browser date. No new backend endpoints, request/response modifications, or data fields are needed.

---

## Existing API (Unchanged)

The feature uses the existing Todo API without modifications:

### GET /api/todos

**Response**: Array of todo objects

```json
[
  {
    "id": "uuid",
    "title": "string",
    "dueDate": "YYYY-MM-DD" | null,
    "completed": boolean,
    "createdAt": "ISO timestamp"
  }
]
```

**No changes**: Frontend calculates `isOverdue` and `isDueToday` from this data.

### POST /api/todos

**Request**:
```json
{
  "title": "string",
  "dueDate": "YYYY-MM-DD" | null
}
```

**Response**: Created todo object

**No changes**: Same fields as before.

### PUT /api/todos/:id

**Request**:
```json
{
  "title": "string",
  "dueDate": "YYYY-MM-DD" | null,
  "completed": boolean
}
```

**Response**: Updated todo object

**No changes**: Same fields as before.

### DELETE /api/todos/:id

**Response**: 204 No Content or success message

**No changes**: Same behavior as before.

---

## Future Considerations

If future requirements need server-side overdue filtering or sorting, potential API additions might include:

- Query parameter: `GET /api/todos?filter=overdue`
- Response metadata: `{ todos: [...], meta: { overdueCount: 5 } }`

**Not in scope for current feature**: These would be separate enhancement requests.

---

**Status**: ✅ No contract changes. Feature is API-neutral.
