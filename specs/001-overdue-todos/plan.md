# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2025-11-13 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

## Summary

Add visual indicators (clock/hourglass and calendar icons) to identify overdue and due-today todo items. The feature calculates overdue status client-side by comparing todo due dates with the current browser date, displaying icons positioned left of the title in TodoCard components. No data model changes required—overdue is a calculated property.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js 16+  
**Primary Dependencies**: React 18, Express.js, Jest  
**Storage**: Backend in-memory storage (existing todoService)  
**Testing**: Jest with @testing-library/react for frontend, Jest for backend  
**Target Platform**: Web browser (desktop-focused), Node.js server  
**Project Type**: Monorepo (web application with frontend + backend)  
**Performance Goals**: Overdue calculation <50ms, icon render within 1 second of list view  
**Constraints**: Client-side calculation for responsiveness, icon-only indicators (no color), 80%+ test coverage  
**Scale/Scope**: Single-user app, ~100 todos expected, minimal state complexity

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Code Quality & Maintainability
✅ **DRY**: Overdue calculation logic will be extracted to a utility function (`isOverdue`, `isDueToday`) reused across components  
✅ **KISS**: Simple date comparison logic, no complex state management or caching  
✅ **SOLID**: TodoCard maintains single responsibility (display), calculation logic separated into utils  

### Test-Driven Development
✅ **80%+ Coverage**: Will write unit tests for date utilities, TodoCard rendering, and integration tests for full flow  
✅ **Test-First**: Tests written for utility functions and component behavior before implementation  

### Single Responsibility & Modularity
✅ **Component Responsibility**: TodoCard displays todos with icons; date utils handle calculations  
✅ **Module Organization**: Utils in `utils/`, component logic in `components/`  

### Consistent Style & Formatting
✅ **Naming**: `isOverdue`, `isDueToday` (camelCase), icon components if needed (PascalCase)  
✅ **Import Organization**: External (React) → Internal (utils, services) → Styles  

### Immediate Persistence & Simplicity
✅ **No Persistence Needed**: Overdue is calculated on-the-fly, not stored  
✅ **Simplicity**: No filtering, sorting, or bulk operations added  

### Material Design & Accessibility
✅ **Icon-Only Indicators**: Clock/hourglass for overdue, calendar for due today (no color dependency)  
✅ **8px Grid**: Icon sizing and spacing follows existing grid (20px icons with sm padding)  
✅ **Accessibility**: Icons have aria-labels for screen readers  

### Monorepo Structure
✅ **No Backend Changes**: Only frontend modifications to TodoCard and utils  
✅ **Colocated Tests**: Tests in `__tests__/` alongside source  

**Gate Result**: ✅ PASS - No constitution violations. Feature aligns with all principles.

## Project Structure

### Documentation (this feature)

```
specs/001-overdue-todos/
├── spec.md              # Feature specification with clarifications
├── plan.md              # This file
├── research.md          # Phase 0 output: date comparison best practices
├── data-model.md        # Phase 1 output: no changes (calculated property only)
├── quickstart.md        # Phase 1 output: developer setup guide
├── contracts/           # Phase 1 output: no API changes needed
└── tasks.md             # Phase 2 output: NOT created by /speckit.plan
```

### Source Code (repository root)

```
packages/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TodoCard.js              # MODIFY: add icon rendering
│       │   └── __tests__/
│       │       └── TodoCard.test.js      # MODIFY: add overdue/due-today tests
│       ├── utils/
│       │   ├── dateUtils.js             # CREATE: isOverdue, isDueToday functions
│       │   └── __tests__/
│       │       └── dateUtils.test.js     # CREATE: date calculation tests
│       └── styles/
│           └── theme.css                 # REVIEW: ensure icon sizing consistent
└── backend/
    └── src/
        └── services/
            └── todoService.js            # NO CHANGES: existing storage unchanged
```

**Structure Decision**: Monorepo web application structure (Option 2 from template). Frontend-only changes to add client-side date comparison logic and icon rendering to existing TodoCard component.

## Complexity Tracking

> **No violations to justify—all Constitution checks passed.**

---

## Phase 0: Outline & Research

### Research Questions

1. **Date Comparison Best Practices**: What's the most reliable way to compare dates in JavaScript for "overdue" calculation (considering time zones, DST)?
2. **Icon Integration**: Best approach for adding icons to React components (inline SVG, icon library, or custom components)?
3. **Accessibility for Icons**: ARIA attributes and semantic HTML patterns for icon indicators without text

### Research Tasks

- Research JavaScript date comparison approaches (Date objects vs timestamps vs date-only comparison)
- Identify best practices for handling "due today" vs "overdue" edge cases (midnight transitions)
- Evaluate icon implementation options (React Icons library vs custom SVG vs emoji)
- Research ARIA patterns for decorative vs semantic icons in todo lists

**Output**: `research.md` with decisions, rationale, and alternatives considered

---

## Phase 1: Design & Contracts

### Data Model

**Output**: `data-model.md`

**No Schema Changes Required**: The Todo entity already has:
- `id`: string
- `title`: string
- `dueDate`: ISO date string (optional)
- `completed`: boolean
- `createdAt`: ISO timestamp

**Calculated Properties** (client-side only, not stored):
- `isOverdue`: boolean - calculated as `dueDate < currentDate && !completed`
- `isDueToday`: boolean - calculated as `dueDate === currentDate && !completed`

### API Contracts

**No API Changes Required**: Existing endpoints remain unchanged:
- `GET /api/todos` - returns all todos with existing fields
- `POST /api/todos` - creates todo (no new fields)
- `PUT /api/todos/:id` - updates todo (no new fields)
- `DELETE /api/todos/:id` - deletes todo

**Rationale**: Overdue status is purely a client-side presentation concern based on current date comparison.

### Utility Functions

**New Module**: `packages/frontend/src/utils/dateUtils.js`

```javascript
/**
 * Checks if a todo item is overdue
 * @param {string} dueDate - ISO date string (YYYY-MM-DD)
 * @param {boolean} completed - whether the todo is completed
 * @returns {boolean} - true if overdue, false otherwise
 */
export function isOverdue(dueDate, completed) {
  // Implementation in Phase 2
}

/**
 * Checks if a todo item is due today
 * @param {string} dueDate - ISO date string (YYYY-MM-DD)
 * @param {boolean} completed - whether the todo is completed
 * @returns {boolean} - true if due today, false otherwise
 */
export function isDueToday(dueDate, completed) {
  // Implementation in Phase 2
}
```

### Component Changes

**Modified Component**: `packages/frontend/src/components/TodoCard.js`

**Current Structure** (assumed):
```jsx
<div className="todo-card">
  <input type="checkbox" checked={completed} onChange={onToggle} />
  <div className="todo-content">
    <div className="todo-title">{title}</div>
    {dueDate && <div className="todo-due-date">{dueDate}</div>}
  </div>
  <button onClick={onEdit}>Edit</button>
  <button onClick={onDelete}>Delete</button>
</div>
```

**New Structure**:
```jsx
<div className="todo-card">
  <input type="checkbox" checked={completed} onChange={onToggle} />
  {renderDateIcon()} {/* NEW: clock/calendar icon based on status */}
  <div className="todo-content">
    <div className="todo-title">{title}</div>
    {dueDate && <div className="todo-due-date">{dueDate}</div>}
  </div>
  <button onClick={onEdit}>Edit</button>
  <button onClick={onDelete}>Delete</button>
</div>
```

### Quickstart Guide

**Output**: `quickstart.md` with:
- How to test overdue functionality locally
- How to create test todos with past/present/future dates
- How to verify icon rendering and accessibility
- How to run date utility tests

---

## Phase 2: Task Breakdown

**IMPORTANT**: Phase 2 (task breakdown) is handled by the `/speckit.tasks` command and is NOT included in `/speckit.plan` output.

The implementation tasks will be generated in `tasks.md` when you run `/speckit.tasks` after completing this plan.

---

## Next Steps

1. ✅ Complete Phase 0: Review `research.md` for date comparison and icon implementation decisions
2. ✅ Complete Phase 1: Review `data-model.md`, `quickstart.md`, and `contracts/` (empty as no API changes)
3. ⏭️ Run `/speckit.tasks` to generate Phase 2 task breakdown in `tasks.md`
4. ⏭️ Begin implementation following TDD approach from `tasks.md`
