# Tasks: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Input**: Design documents from `/specs/001-overdue-todos/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included per TDD approach and 80%+ coverage requirement from plan.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo web application:
- Frontend: `packages/frontend/src/`
- Backend: `packages/backend/src/` (no changes for this feature)
- Tests: Colocated in `__tests__/` directories alongside source

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create foundational utilities and test infrastructure for date calculations

### Test Infrastructure

- [ ] T001 [P] Create date utility module in packages/frontend/src/utils/dateUtils.js with JSDoc function stubs for isOverdue and isDueToday

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core date calculation utilities that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Date Utility Tests (Write First - TDD)

- [ ] T002 [P] Write test for isOverdue with past date and incomplete status in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T003 [P] Write test for isOverdue with today's date (should return false) in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T004 [P] Write test for isOverdue with future date in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T005 [P] Write test for isOverdue with completed status (should return false) in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T006 [P] Write test for isOverdue with null/undefined dueDate in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T007 [P] Write test for isDueToday with today's date and incomplete status in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T008 [P] Write test for isDueToday with past date (should return false) in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T009 [P] Write test for isDueToday with future date (should return false) in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T010 [P] Write test for isDueToday with completed status (should return false) in packages/frontend/src/utils/__tests__/dateUtils.test.js

### Date Utility Implementation

- [ ] T011 Implement isOverdue function in packages/frontend/src/utils/dateUtils.js using new Date().toLocaleDateString('en-CA') for date comparison
- [ ] T012 Implement isDueToday function in packages/frontend/src/utils/dateUtils.js using new Date().toLocaleDateString('en-CA') for date comparison
- [ ] T013 Run date utility tests to verify all tests pass with npm test -- dateUtils.test.js

**Checkpoint**: Foundation ready - all date utilities working and tested. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Visual Identification of Overdue Items (Priority: P1) 🎯 MVP

**Goal**: Users can immediately see which todos are overdue through clock/hourglass icon indicators positioned left of the title

**Independent Test**: Create todos with past due dates, open the todo list, and verify that overdue items display clock/hourglass icons on the left side before the title

### Tests for User Story 1 (Write First - TDD)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US1] Write test for TodoCard rendering clock icon when todo is overdue in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T015 [P] [US1] Write test for TodoCard NOT rendering clock icon when todo is completed (even if overdue) in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T016 [P] [US1] Write test for TodoCard NOT rendering clock icon when todo has no due date in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T017 [P] [US1] Write test for TodoCard NOT rendering clock icon when due date is today or future in packages/frontend/src/components/__tests__/TodoCard.test.js

### Implementation for User Story 1

- [ ] T018 [US1] Import isOverdue and isDueToday from dateUtils into packages/frontend/src/components/TodoCard.js
- [ ] T019 [US1] Create renderDateIcon helper function in TodoCard.js that returns clock SVG icon when isOverdue returns true
- [ ] T020 [US1] Add inline SVG clock/hourglass icon component in TodoCard.js with 20px size and aria-label "Overdue"
- [ ] T021 [US1] Insert renderDateIcon() call in TodoCard JSX between checkbox and todo-content div in packages/frontend/src/components/TodoCard.js
- [ ] T022 [US1] Run TodoCard tests to verify overdue icon rendering with npm test -- TodoCard.test.js
- [ ] T023 [US1] Manual test: Create todo with past due date via UI and verify clock icon appears

**Checkpoint**: At this point, User Story 1 should be fully functional - overdue items display with clock icon indicators

---

## Phase 4: User Story 2 - Automatic Overdue Status Updates (Priority: P2)

**Goal**: Overdue status automatically recalculates based on current date whenever the todo list is viewed or refreshed

**Independent Test**: Create a todo with a specific due date, verify overdue calculation updates automatically on list view/refresh without user action

### Tests for User Story 2

- [ ] T024 [P] [US2] Write test verifying overdue status recalculates on component render in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T025 [P] [US2] Write test that mocks current date and verifies correct overdue calculation in packages/frontend/src/utils/__tests__/dateUtils.test.js

### Implementation for User Story 2

- [ ] T026 [US2] Verify dateUtils.js uses current date on each call (no caching) for real-time calculation in packages/frontend/src/utils/dateUtils.js
- [ ] T027 [US2] Run integration test: Change system date (or mock) and verify overdue status updates on next render
- [ ] T028 [US2] Manual test: Create todo due "today", wait until tomorrow (or mock date), verify it shows as overdue

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - overdue status is accurate and updates automatically

---

## Phase 5: User Story 3 - Clear Distinction Between Overdue and Non-Overdue (Priority: P2)

**Goal**: Users can easily distinguish between overdue todos (clock icon), current todos due today (calendar icon), and future/no-date todos (no icon)

**Independent Test**: Create a set of todos spanning past, present, and future dates, and verify each category has distinct and appropriate visual treatment

### Tests for User Story 3

- [ ] T029 [P] [US3] Write test for TodoCard rendering calendar icon when todo is due today in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T030 [P] [US3] Write test for TodoCard NOT rendering any icon when due date is in future in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T031 [P] [US3] Write test for TodoCard NOT rendering any icon when there is no due date in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T032 [P] [US3] Write test verifying distinct icons for overdue vs due-today vs future in packages/frontend/src/components/__tests__/TodoCard.test.js

### Implementation for User Story 3

- [ ] T033 [US3] Add inline SVG calendar icon component in TodoCard.js with 20px size and aria-label "Due today"
- [ ] T034 [US3] Update renderDateIcon helper in TodoCard.js to return calendar icon when isDueToday returns true
- [ ] T035 [US3] Update renderDateIcon helper in TodoCard.js to return null when todo has future date or no date
- [ ] T036 [US3] Add CSS styling for icon spacing in packages/frontend/src/App.css or theme.css using 8px grid (sm padding)
- [ ] T037 [US3] Run TodoCard tests to verify all three icon states (overdue, due today, none) with npm test -- TodoCard.test.js
- [ ] T038 [US3] Manual test: Create todos with past, today, future, and null due dates; verify correct icons appear

**Checkpoint**: All user stories should now be independently functional - complete visual distinction between all date states

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, accessibility, and final validation

- [ ] T039 [P] Verify icon accessibility: Ensure aria-labels are present and descriptive in packages/frontend/src/components/TodoCard.js
- [ ] T040 [P] Verify keyboard navigation works with icons present in packages/frontend/src/components/TodoCard.js
- [ ] T041 [P] Review icon sizing consistency with 8px grid system in packages/frontend/src/styles/theme.css
- [ ] T042 Test edge case: Very old overdue dates (months/years past) render correctly
- [ ] T043 Test edge case: Due date changes from past to future remove overdue icon immediately
- [ ] T044 Test edge case: Due date changes from future to past add overdue icon immediately
- [ ] T045 Test edge case: Marking overdue todo as complete removes icon immediately
- [ ] T046 Run full test suite with coverage report and verify 80%+ coverage with npm test -- --coverage
- [ ] T047 Follow quickstart.md validation steps to verify feature works end-to-end
- [ ] T048 [P] Update comments and JSDoc in dateUtils.js for clarity
- [ ] T049 Code review: Verify DRY, KISS, and SOLID principles are followed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3, 4, 5)**: All depend on Foundational phase completion
  - User Story 1 (P1) can start after Foundational
  - User Story 2 (P2) can start after Foundational (but naturally builds on US1)
  - User Story 3 (P2) can start after Foundational (but naturally builds on US1)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Validates/enhances US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Extends US1 icons but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Date utility functions (Foundational) before component modifications
- Component changes before integration testing
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T001 can run standalone
- **Phase 2 Tests**: T002-T010 can all run in parallel (different test cases, same file)
- **Phase 2 Implementation**: T011 and T012 are sequential (same file), but both can follow tests together
- **User Story 1 Tests**: T014-T017 can all run in parallel (different test cases)
- **User Story 1 Implementation**: T018-T021 are mostly sequential (same file modifications)
- **User Story 2 Tests**: T024-T025 can run in parallel (different files)
- **User Story 3 Tests**: T029-T032 can run in parallel (different test cases)
- **User Story 3 Implementation**: T033-T035 are sequential (same file), T036 can be parallel
- **Polish Phase**: T039-T041, T048-T049 can run in parallel (different concerns/files)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task T014: "Write test for TodoCard rendering clock icon when todo is overdue"
Task T015: "Write test for TodoCard NOT rendering clock icon when completed"
Task T016: "Write test for TodoCard NOT rendering clock icon when no due date"
Task T017: "Write test for TodoCard NOT rendering clock icon when due date is today/future"

# Then implement sequentially (same file):
Task T018: "Import isOverdue and isDueToday from dateUtils"
Task T019: "Create renderDateIcon helper function"
Task T020: "Add inline SVG clock icon component"
Task T021: "Insert renderDateIcon() call in JSX"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T013) - CRITICAL
3. Complete Phase 3: User Story 1 (T014-T023)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo overdue icon feature

### Incremental Delivery

1. Complete Setup + Foundational (T001-T013) → Foundation ready
2. Add User Story 1 (T014-T023) → Test independently → Deploy/Demo (MVP! - Overdue icons working)
3. Add User Story 2 (T024-T028) → Test independently → Deploy/Demo (Auto-updates working)
4. Add User Story 3 (T029-T038) → Test independently → Deploy/Demo (All date states distinguished)
5. Polish (T039-T049) → Final validation and deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T013)
2. Once Foundational is done:
   - Developer A: User Story 1 (T014-T023)
   - Developer B: Can start User Story 2 tests (T024-T025) in parallel, then wait for US1 component structure
   - Developer C: Can start User Story 3 tests (T029-T032) in parallel, then wait for US1 component structure
3. Stories integrate naturally since they all enhance the same TodoCard component

**Recommendation**: Given that all stories modify the same TodoCard.js file, sequential implementation (P1 → P2 → P2) is more practical than parallel to avoid merge conflicts.

---

## Notes

- [P] tasks = different files or independent test cases, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each logical group of tasks
- Stop at any checkpoint to validate story independently
- All tasks follow file paths from plan.md project structure
- Date utilities use native JavaScript - no external libraries needed
- Icons are inline SVG components - no icon library dependency
- 80%+ test coverage target per plan.md constitution check
