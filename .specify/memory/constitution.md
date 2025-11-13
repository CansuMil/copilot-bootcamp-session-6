<!--
Sync Impact Report - Version 1.0.0 (Initial Constitution)
=========================================================
Version Change: none → 1.0.0 (Initial ratification)

Modified Principles:
- All principles newly defined based on project documentation

Added Sections:
- I. Code Quality & Maintainability (DRY, KISS, SOLID)
- II. Test-Driven Development (80%+ coverage requirement)
- III. Single Responsibility & Modularity
- IV. Consistent Style & Formatting
- V. Immediate Persistence & Simplicity
- VI. Material Design & Accessibility
- VII. Monorepo Structure

Templates Status:
✅ plan-template.md - Constitution Check section aligns with all principles
✅ spec-template.md - Requirements section supports functional simplicity principle
✅ tasks-template.md - Test-first approach enforced in Phase 3+ user story tasks

Follow-up TODOs:
- None: All placeholders resolved

Updated: 2025-11-13
-->

# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Code Quality & Maintainability

**DRY (Don't Repeat Yourself)**: Extract common code into shared functions and utilities. Build reusable components that can be used across the application. When the same code appears in multiple places, it MUST be refactored into a shared utility or component.

**KISS (Keep It Simple)**: Prefer simple, straightforward implementations over complex ones. Code MUST be easy to understand at first glance. Avoid premature optimization—write clear code first, optimize only when necessary based on measured performance issues.

**SOLID Principles**: 
- Single Responsibility: Each module/component MUST have one reason to change
- Open/Closed: Use props and composition to extend behavior without modification
- Liskov Substitution: Follow React component contracts consistently
- Interface Segregation: Pass only necessary props to components
- Dependency Inversion: Depend on abstractions, inject dependencies rather than hardcoding

**Rationale**: Maintainable code reduces technical debt, accelerates feature development, and minimizes bugs. Simple, well-structured code is easier to test, debug, and extend.

### II. Test-Driven Development (NON-NEGOTIABLE)

**80%+ Coverage Required**: All packages MUST maintain at least 80% code coverage across unit and integration tests. Critical user workflows MUST achieve 100% coverage.

**Test-First Approach**: Write tests as part of the development process. Tests MUST describe expected behavior before or alongside implementation. Follow the Red-Green-Refactor cycle strictly for new features.

**Test Quality Over Quantity**: Focus on testing behavior, not implementation details. Write clear, descriptive test names. Tests MUST be independent, isolated, and maintainable. Mock external dependencies (API calls, timers, etc.).

**Test Organization**: Tests MUST be colocated with source files in `__tests__/` directories. Test files MUST be named `{filename}.test.js`. Follow Arrange-Act-Assert pattern consistently.

**Rationale**: TDD ensures code correctness, documents expected behavior, enables confident refactoring, and prevents regression bugs. High coverage provides confidence in system reliability.

### III. Single Responsibility & Modularity

**Component Responsibility**: Each React component MUST handle a single, well-defined responsibility. A `TodoCard` component displays a todo; it does NOT fetch or delete todos.

**Function Responsibility**: Each function MUST do one thing well. Complex logic MUST be broken into smaller, understandable functions.

**Module Organization**: Follow logical grouping with clear separation of concerns:
- Components in `components/` (UI rendering only)
- Services in `services/` (API communication and business logic)
- Utilities in `utils/` (pure functions for common operations)

**Rationale**: Single responsibility makes code easier to test, understand, maintain, and reuse. Clear module boundaries prevent tight coupling and enable independent evolution.

### IV. Consistent Style & Formatting

**Indentation**: Use 2 spaces for all indentation (JavaScript, JSON, CSS, Markdown). NO tabs.

**Naming Conventions**:
- `camelCase` for variables and functions
- `PascalCase` for React components and classes
- `UPPER_SNAKE_CASE` for constants
- Descriptive names that clearly indicate purpose (no single letters except loops)

**Import Organization**: 
1. External libraries (React, npm packages)
2. Internal modules (services, components, utils)
3. Styles (CSS imports)
4. Separate groups with blank lines

**Line Length**: Keep lines under 100 characters for readability.

**Linting**: All code MUST pass ESLint checks before commit. Address all errors and warnings. No console statements in production code.

**Rationale**: Consistent formatting improves readability, reduces cognitive load, and prevents style-related merge conflicts. Clear naming reduces need for comments.

### V. Immediate Persistence & Simplicity

**Immediate Persistence**: All todo changes (create, update, delete, status toggle) MUST be persisted to the backend immediately. No client-side caching or delayed sync.

**Simplicity First**: Build minimal, focused features. NO advanced features unless explicitly required:
- NO filtering by status or priority
- NO search functionality
- NO undo/redo
- NO bulk operations
- NO categories or tags

**YAGNI (You Aren't Gonna Need It)**: Do not implement features speculatively. Build only what is specified in requirements.

**Rationale**: Immediate persistence ensures data durability and prevents data loss. Simplicity reduces complexity, development time, and maintenance burden while maintaining focus on core user value.

### VI. Material Design & Accessibility

**Material Design Principles**: Follow Material Design elevation (cards with subtle shadows), strategic color use, clear typography hierarchy, 4-8px border radius for modern feel.

**8px Grid System**: All spacing MUST follow the 8px grid:
- xs: 8px, sm: 16px, md: 24px, lg: 32px, xl: 48px

**Theme Support**: Support both light and dark modes with proper color palettes. Persist user preference in localStorage.

**Accessibility Requirements**:
- All interactive elements MUST be keyboard accessible
- Color contrast MUST meet WCAG AA standards
- Form labels MUST be properly associated with inputs
- Icon buttons MUST have descriptive titles/aria-labels
- Focus indicators MUST be visible and distinct

**Rationale**: Material Design provides proven, tested UI patterns. Accessibility ensures the application is usable by everyone, including users with disabilities. Consistent spacing creates visual harmony.

### VII. Monorepo Structure & Workspaces

**Monorepo Organization**: Use npm workspaces to manage frontend and backend packages. All shared dependencies are hoisted to the root.

**Package Structure**:
- `packages/frontend/`: React application (UI, components, services)
- `packages/backend/`: Express.js API server (routes, controllers, services)

**Independent but Coordinated**: Each package MUST be independently runnable for development but work together as a cohesive system. Tests MUST be runnable per package or for the entire monorepo.

**Colocated Tests**: Tests MUST live alongside source code in `__tests__/` directories within each package.

**Rationale**: Monorepo structure enables code sharing, consistent tooling, atomic commits across frontend and backend, and simplified dependency management while maintaining clear boundaries.

## Code Organization Standards

### File Structure Requirements

**Frontend Structure** (`packages/frontend/src/`):
- `components/`: Reusable UI components with colocated tests
- `services/`: API communication layer
- `styles/`: Global styles and theme definitions
- `__tests__/`: Integration tests and test setup

**Backend Structure** (`packages/backend/src/`):
- `services/`: Data access and business logic
- `routes/`: Express route handlers (when added)
- `middleware/`: Express middleware (when added)
- `__tests__/`: API and service tests

**Declaration Order**: Within each file:
1. Imports (organized by category)
2. Constants
3. Utility functions
4. Main component/class/function
5. Helper functions (if any)
6. Exports

### Error Handling

**Graceful Error Handling**: All operations that can fail MUST include try-catch blocks. Provide clear, actionable error messages. Inform users when operations fail.

**User Feedback**: Display user-friendly error messages (not raw error objects or stack traces).

**Error Logging**: Log errors to console with context for debugging (development only).

### Documentation Standards

**Meaningful Comments**: Only comment "why", not "what". Avoid obvious comments. Keep comments updated with code changes.

**JSDoc Required**: Use JSDoc for all public functions and components with clear parameter and return type descriptions.

**Git Practices**:
- Atomic commits (one logical change per commit)
- Clear commit messages explaining "why"
- Feature branches for new work
- Pull requests for code review before merging

## Development Workflow

### Pre-Commit Requirements

Before committing, developers MUST ensure:
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint` if configured)
- [ ] Code follows naming conventions
- [ ] Imports are organized correctly
- [ ] No console.log statements in production code
- [ ] Comments are clear and helpful
- [ ] Tests written for new functionality

### Code Review Checklist

All pull requests MUST verify:
- [ ] Constitution compliance (all principles followed)
- [ ] Test coverage meets 80%+ threshold
- [ ] Tests are passing
- [ ] Code is DRY and avoids repetition
- [ ] Functions/components have single responsibility
- [ ] Error handling is implemented
- [ ] No commented-out code
- [ ] Git commits are atomic and well-described

### Quality Gates

**Blocking Issues** (MUST fix before merge):
- Failing tests
- Coverage below 80%
- Linting errors
- Constitution violations without justification

**Non-Blocking** (address in follow-up):
- Minor style inconsistencies
- Documentation improvements
- Performance optimizations (unless critical)

## Governance

### Amendment Process

This Constitution supersedes all other practices. Amendments require:
1. Documentation of the proposed change with rationale
2. Review and approval from team leads
3. Migration plan for affected code (if applicable)
4. Version bump following semantic versioning

### Version Semantics

- **MAJOR**: Backward incompatible governance/principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review

All PRs/reviews MUST verify compliance with this Constitution. Complexity that violates principles MUST be justified in the plan.md complexity tracking section.

### Runtime Guidance

For detailed runtime development guidance, refer to:
- `docs/coding-guidelines.md` - Complete coding standards and examples
- `docs/testing-guidelines.md` - Comprehensive testing practices
- `docs/functional-requirements.md` - Feature requirements and scope
- `docs/ui-guidelines.md` - Design system and UI specifications
- `docs/project-overview.md` - Architecture and technology stack

**Version**: 1.0.0 | **Ratified**: 2025-11-13 | **Last Amended**: 2025-11-13
