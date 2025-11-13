# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: November 13, 2025  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Items (Priority: P1)

A user opens their todo list and immediately sees which tasks are overdue through visual indicators (such as color coding, icons, or styling changes). This allows them to quickly identify which tasks need immediate attention without manually comparing dates.

**Why this priority**: This is the core value proposition of the feature - enabling users to quickly spot overdue items at a glance, which directly addresses the main user need and provides immediate actionable value.

**Independent Test**: Can be fully tested by creating todos with past due dates, opening the todo list, and verifying that overdue items are visually distinct from current or future items. Delivers immediate value by making overdue status obvious without any user interaction.

**Acceptance Scenarios**:

1. **Given** a todo with a due date in the past and incomplete status, **When** the user views the todo list, **Then** the todo displays with visual indicators showing it is overdue (e.g., red text, warning icon, or highlighted background)
2. **Given** multiple todos with mixed due dates (past, today, future), **When** the user views the todo list, **Then** only the todos with past due dates show overdue visual indicators
3. **Given** a todo with a due date of today, **When** the user views the todo list, **Then** the todo does NOT display overdue indicators (today's items are not considered overdue)
4. **Given** a todo that is overdue and marked as completed, **When** the user views the todo list, **Then** the overdue visual indicators are NOT displayed (completed items are not overdue)

---

### User Story 2 - Automatic Overdue Status Updates (Priority: P2)

As time passes and the current date changes, todos automatically transition to overdue status without requiring user action. A todo that was due yesterday becomes overdue when the user opens the app today, and a todo due today will become overdue tomorrow.

**Why this priority**: This ensures the overdue feature remains accurate over time without manual intervention, providing consistent value. While important, it's secondary to the basic visual identification (P1) since users primarily need to see what's currently overdue.

**Independent Test**: Can be tested by creating a todo with a specific due date, simulating date changes (or waiting for actual date changes), and verifying the overdue status updates automatically. Delivers value by ensuring accuracy without user effort.

**Acceptance Scenarios**:

1. **Given** a todo with a due date of yesterday, **When** the user opens the app today, **Then** the todo automatically displays as overdue
2. **Given** a todo with a due date of tomorrow, **When** the user views it today, **Then** the todo does NOT display as overdue
3. **Given** the system date changes from one day to the next, **When** the user refreshes or reopens the todo list, **Then** the overdue status of all todos is recalculated based on the current date

---

### User Story 3 - Clear Distinction Between Overdue and Non-Overdue (Priority: P2)

Users can easily distinguish between overdue todos, current todos (due today), and future todos through consistent visual patterns. The visual hierarchy helps users understand urgency at a glance.

**Why this priority**: This enhances the user experience by providing clear visual hierarchy and reducing cognitive load. It builds on P1 by adding context, but isn't strictly necessary for the basic "identify overdue" functionality.

**Independent Test**: Can be tested by creating a set of todos spanning past, present, and future dates, and verifying that each category has distinct and appropriate visual treatment. Delivers value by making the list easier to scan and prioritize.

**Acceptance Scenarios**:

1. **Given** todos with various due dates (past, today, future, no date), **When** the user views the list, **Then** each category has visually distinct styling that communicates urgency
2. **Given** a user scanning the todo list quickly, **When** looking for overdue items, **Then** the visual indicators are sufficiently distinct to identify overdue items within 2 seconds
3. **Given** todos without due dates, **When** the user views the list, **Then** these items do NOT display any date-related visual indicators

---

### Edge Cases

- What happens when a todo has no due date? (Should display normally without overdue indicators)
- How does the system handle todos with due dates far in the past (e.g., months or years overdue)? (Should display same overdue indicators regardless of how overdue)
- What happens when a user changes a todo's due date from past to future? (Overdue indicators should immediately disappear)
- How does the system handle the transition at midnight when today's todos become overdue? (Should update on next view/refresh)
- What happens when a user marks an overdue todo as complete? (Overdue indicators should immediately disappear)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display visual indicators (such as color, icons, or styling) for todos that are incomplete and have a due date before the current date
- **FR-002**: System MUST NOT display overdue indicators for todos that have been marked as completed, regardless of their due date
- **FR-003**: System MUST calculate overdue status based on comparing the todo's due date with the current date (server time or client time based on system architecture)
- **FR-004**: System MUST consider a todo overdue only if its due date is strictly before the current date (today's date means not overdue)
- **FR-005**: System MUST NOT display overdue indicators for todos that do not have a due date assigned
- **FR-006**: System MUST recalculate and update overdue status whenever the todo list is viewed or refreshed
- **FR-007**: System MUST immediately remove overdue indicators when a user marks an overdue todo as complete
- **FR-008**: System MUST immediately remove overdue indicators when a user changes a todo's due date from past to present or future
- **FR-009**: System MUST immediately display overdue indicators when a user changes a todo's due date from future or present to past (and the todo is incomplete)
- **FR-010**: Visual indicators for overdue items MUST be clearly distinguishable from normal todo styling and accessible to users with color vision deficiencies

### Key Entities

- **Todo Item**: Existing entity with attributes including title, due date (optional), completion status; overdue is a calculated property based on due date vs. current date, not stored

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue todos within 2 seconds of viewing the todo list without reading due dates
- **SC-002**: 100% of incomplete todos with past due dates display overdue visual indicators
- **SC-003**: 0% of completed todos display overdue indicators, regardless of due date
- **SC-004**: Overdue status updates reflect the current date within 1 second of viewing the todo list
- **SC-005**: Users can distinguish between overdue, current, and future todos through visual indicators without relying solely on color

## Assumptions *(mandatory)*

1. **Current Date Source**: The system uses the client's current date/time for overdue calculations (reasonable default for single-user app; alternatively could use server time for consistency)
2. **Time Zone**: Overdue calculations use the user's local time zone (date comparison is date-only, not time-specific)
3. **Visual Design**: Overdue indicators follow the established Halloween theme UI guidelines (orange/purple color palette) while ensuring sufficient contrast and accessibility
4. **Persistence**: No changes to data model required - overdue is a calculated/derived property, not a stored field
5. **Performance**: Overdue calculation is performed client-side on render for immediate responsiveness
6. **Existing UI Framework**: Overdue styling integrates with the existing TodoCard component structure

## Dependencies *(include if applicable)*

- Existing todo list display functionality
- Existing todo data model with due date field
- Current date/time access from the client environment
- Existing TodoCard component (needs modification to support overdue styling)

## Out of Scope *(include if applicable)*

- Notification or reminder features for overdue todos
- Filtering or sorting todos by overdue status
- Automatic archiving or deletion of overdue todos
- Overdue statistics or reports
- Configurable overdue thresholds (e.g., "show as overdue 1 day before due date")
- Email or push notifications about overdue items
- Bulk actions on overdue todos (e.g., "mark all overdue as complete")
- Snooze or postpone functionality for overdue items
