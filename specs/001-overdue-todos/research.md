# Research: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Date**: 2025-11-13  
**Purpose**: Resolve technical unknowns and establish best practices for date comparison and icon implementation

---

## 1. Date Comparison Best Practices in JavaScript

### Decision

Use **date-only string comparison** after normalizing both dates to YYYY-MM-DD format using the client's local timezone.

### Implementation Approach

```javascript
// Get today's date in YYYY-MM-DD format (local timezone)
const today = new Date().toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD

// Compare with todo's dueDate (already in YYYY-MM-DD format from backend)
const isOverdue = dueDate < today && !completed;
const isDueToday = dueDate === today && !completed;
```

### Rationale

1. **Simplicity**: String comparison of YYYY-MM-DD dates is straightforward and lexicographically correct
2. **Timezone Consistency**: Using `toLocaleDateString('en-CA')` ensures client-side date matches user's local calendar date
3. **No Time Component**: Comparing only dates (not times) aligns with requirement that "due today" means the entire day, not specific hours
4. **No Library Needed**: Native JavaScript Date API is sufficient; avoids adding dependencies like moment.js or date-fns
5. **Performance**: String comparison is fast (O(1) for practical date strings)

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| **Date.parse() + timestamp comparison** | Includes time component (hours/minutes), creates midnight boundary issues |
| **date-fns library** | Adds 13KB+ dependency for simple date comparison |
| **moment.js** | Large bundle size (67KB), deprecated in favor of modern alternatives |
| **Manual date parsing (split on '-')** | More code, error-prone, no advantage over string comparison |
| **Server-side calculation** | Adds API complexity, latency, and violates Constitution's client-side simplicity principle |

### Edge Cases Handled

- **Midnight transitions**: Using calendar date (not timestamp) means 11:59 PM and 12:01 AM on same day are both "today"
- **Timezones**: Client's local date used consistently (as per spec clarification)
- **Missing due dates**: `null` or `undefined` dueDate returns `false` for both `isOverdue` and `isDueToday`
- **Completed items**: Explicit `!completed` check ensures completed items never show as overdue

---

## 2. Icon Integration in React

### Decision

Use **inline SVG icons** defined as React components, avoiding external icon libraries.

### Implementation Approach

Create icon components in `packages/frontend/src/components/`:

```jsx
// OverdueIcon.js
export function OverdueIcon({ className, ariaLabel }) {
  return (
    <svg 
      className={className}
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none"
      role="img"
      aria-label={ariaLabel || "Overdue"}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// DueTodayIcon.js
export function DueTodayIcon({ className, ariaLabel }) {
  return (
    <svg 
      className={className}
      width="20" 
      height="20" 
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label={ariaLabel || "Due today"}
    >
      <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
```

### Rationale

1. **No Dependencies**: Avoids adding react-icons (~500KB) or other icon libraries to bundle
2. **Full Control**: Can customize size, color, and styling precisely to match Halloween theme
3. **Accessibility Built-In**: SVG `role="img"` and `aria-label` provide screen reader support
4. **Performance**: Inline SVGs render faster than icon fonts or external resources
5. **Constitution Compliance**: Keeps bundle simple and minimal (KISS principle)

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| **react-icons library** | Adds 500KB+ to bundle for just 2 icons; violates simplicity principle |
| **Font Awesome / Material Icons** | Requires additional stylesheet; icon fonts have accessibility limitations |
| **Emoji (🕒 ⏰ 📅)** | Not consistent across platforms/browsers; harder to style and size |
| **Image files (PNG/SVG)** | Requires separate HTTP requests; harder to recolor with CSS |

### Icon Styling

Icons will inherit text color using `currentColor` in SVG stroke, allowing CSS control:

```css
.todo-card .date-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px; /* sm spacing from 8px grid */
  flex-shrink: 0;
  color: inherit; /* inherits from parent, matches text color */
}
```

---

## 3. Accessibility for Icon Indicators

### Decision

Use **semantic SVG with aria-label** for screen reader support, plus visual icon placement that follows reading order.

### Implementation Approach

```jsx
function TodoCard({ todo }) {
  const overdue = isOverdue(todo.dueDate, todo.completed);
  const dueToday = isDueToday(todo.dueDate, todo.completed);

  const renderDateIcon = () => {
    if (overdue) {
      return <OverdueIcon className="date-icon" ariaLabel="Overdue task" />;
    }
    if (dueToday) {
      return <DueTodayIcon className="date-icon" ariaLabel="Due today" />;
    }
    return null;
  };

  return (
    <div className="todo-card">
      <input 
        type="checkbox" 
        checked={todo.completed} 
        onChange={onToggle}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      {renderDateIcon()}
      <div className="todo-content">
        <div className="todo-title">{todo.title}</div>
        {todo.dueDate && <div className="todo-due-date">{formatDate(todo.dueDate)}</div>}
      </div>
      {/* ... edit/delete buttons ... */}
    </div>
  );
}
```

### Rationale

1. **WCAG 2.1 AA Compliance**: 
   - SVG `role="img"` + `aria-label` announces icon meaning to screen readers
   - Icon is additional indicator; due date text is still visible for redundancy
   - No color-only information (icon shape distinguishes overdue vs. due today)

2. **Reading Order**: Icon positioned left of title follows natural left-to-right reading flow

3. **Keyboard Navigation**: Icons are non-interactive (informational only), so no tab stop needed

4. **Contrast**: Icons use `currentColor`, inheriting text color with sufficient contrast against background

### Accessibility Testing Checklist

- [ ] Screen reader announces "Overdue task" or "Due today" when focusing todo
- [ ] High contrast mode shows icon outlines clearly
- [ ] Keyboard-only navigation doesn't require interacting with icons
- [ ] Icon meaning is clear without relying on color (shape differs: clock vs. calendar)

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| **Aria-hidden icons with text** | Adds redundant text; icons already have semantic meaning |
| **Color-only indicators** | Violates WCAG AA (fails for colorblind users); spec explicitly chose icon-only |
| **Title attribute only** | Not announced by screen readers consistently; aria-label is standard |
| **Role="presentation"** | Would hide icon from assistive tech entirely; we want it announced |

---

## 4. Testing Strategy for Date Logic

### Unit Tests for `dateUtils.js`

```javascript
describe('isOverdue', () => {
  beforeEach(() => {
    // Mock current date to 2025-11-13 for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-11-13'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns true for past due date and incomplete status', () => {
    expect(isOverdue('2025-11-12', false)).toBe(true);
  });

  test('returns false for today due date', () => {
    expect(isOverdue('2025-11-13', false)).toBe(false);
  });

  test('returns false for future due date', () => {
    expect(isOverdue('2025-11-14', false)).toBe(false);
  });

  test('returns false for completed task regardless of date', () => {
    expect(isOverdue('2025-11-12', true)).toBe(false);
  });

  test('returns false for null due date', () => {
    expect(isOverdue(null, false)).toBe(false);
  });
});

describe('isDueToday', () => {
  // Similar test structure...
});
```

### Integration Tests for TodoCard

```javascript
describe('TodoCard overdue indicators', () => {
  test('displays overdue icon for past due date', () => {
    const todo = { id: '1', title: 'Test', dueDate: '2025-11-12', completed: false };
    render(<TodoCard todo={todo} />);
    expect(screen.getByLabelText('Overdue task')).toBeInTheDocument();
  });

  test('displays due today icon for current date', () => {
    const todo = { id: '1', title: 'Test', dueDate: '2025-11-13', completed: false };
    render(<TodoCard todo={todo} />);
    expect(screen.getByLabelText('Due today')).toBeInTheDocument();
  });

  test('displays no icon for future due date', () => {
    const todo = { id: '1', title: 'Test', dueDate: '2025-11-14', completed: false };
    render(<TodoCard todo={todo} />);
    expect(screen.queryByLabelText(/overdue|due today/i)).not.toBeInTheDocument();
  });

  test('displays no icon when task is completed', () => {
    const todo = { id: '1', title: 'Test', dueDate: '2025-11-12', completed: true };
    render(<TodoCard todo={todo} />);
    expect(screen.queryByLabelText('Overdue task')).not.toBeInTheDocument();
  });
});
```

---

## Summary of Decisions

| Question | Decision | Key Rationale |
|----------|----------|---------------|
| **Date Comparison** | String comparison of YYYY-MM-DD dates | Simple, performant, no library needed |
| **Icon Implementation** | Inline SVG React components | No dependencies, full control, accessible |
| **Accessibility** | SVG role="img" with aria-label | WCAG AA compliant, screen reader friendly |
| **Testing** | Jest with fake timers for date mocking | Deterministic tests independent of system date |

All decisions align with Constitution principles: KISS (simple date logic), no unnecessary dependencies, accessibility-first, testable design.

**Status**: ✅ All research questions resolved. Ready for Phase 1 (Design & Contracts).
