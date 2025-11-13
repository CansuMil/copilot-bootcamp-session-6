# GitHub Copilot Instructions

> **Note**: This file is located at `.github/copilot-instructions.md` and is used by GitHub Copilot to understand project context.

This file contains high-level instructions for GitHub Copilot to follow when generating code for this project. For detailed guidance, refer to the documentation files in the `docs/` directory.

## Documentation Overview

The project documentation will be built during the bootcamp sessions.

- [Project Overview](../docs/project-overview.md) - Overview of the project
- [Coding Guidelines](../docs/coding-guidelines.md) - Coding style, quality principles, and best practices
- [Functional Requirements](../docs/functional-requirements.md) - Core functional requirements for the todo app
- [UI Guidelines](../docs/ui-guidelines.md) - Design system and UI guidelines for the todo app
- [Testing Guidelines](../docs/testing-guidelines.md) - Testing strategy and best practices

## Active Feature: Overdue Todo Items

**Branch**: `001-overdue-todos`  
**Spec**: [specs/001-overdue-todos/spec.md](../specs/001-overdue-todos/spec.md)  
**Plan**: [specs/001-overdue-todos/plan.md](../specs/001-overdue-todos/plan.md)

### Technology Stack (from plan.md)

- **Language**: JavaScript (ES6+), Node.js 16+
- **Frontend**: React 18, Jest with @testing-library/react
- **Backend**: Express.js, Jest
- **Storage**: Backend in-memory storage (existing todoService)
- **Platform**: Web browser (desktop-focused), Node.js server
- **Project Type**: Monorepo with npm workspaces

### Feature Summary

Add visual indicators (clock/hourglass and calendar icons) to identify overdue and due-today todo items using client-side date comparison. Icons positioned left of title in TodoCard components. No data model changes—overdue is a calculated property.

### Key Implementation Details

- Date comparison using native JavaScript: `new Date().toLocaleDateString('en-CA')` for YYYY-MM-DD format
- Icon-only indicators (no color changes) for accessibility
- Inline SVG React components for icons (no external libraries)
- Date utilities in `packages/frontend/src/utils/dateUtils.js`
- Modified component: `packages/frontend/src/components/TodoCard.js`

**Last Updated**: 2025-11-13
