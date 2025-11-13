# Quickstart: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Branch**: `001-overdue-todos`  
**Date**: 2025-11-13

This guide helps developers set up, test, and verify the overdue todo items feature locally.

---

## Prerequisites

- Node.js 16+ installed
- Git repository cloned
- Branch `001-overdue-todos` checked out

```bash
git checkout 001-overdue-todos
```

---

## Installation

From the repository root:

```bash
# Install all dependencies (frontend + backend)
npm install
```

This uses npm workspaces to install dependencies for both packages.

---

## Running the Application

### Start Both Frontend and Backend

```bash
# From repository root
npm run start
```

This starts:
- **Backend**: `http://localhost:3001` (Express API server)
- **Frontend**: `http://localhost:3000` (React development server)

The frontend will automatically open in your browser.

### Start Individual Packages

If you need to run only one package:

```bash
# Backend only
npm run start --workspace=packages/backend

# Frontend only  
npm run start --workspace=packages/frontend
```

---

## Testing Overdue Functionality

### Manual Testing

1. **Create test todos** with various due dates:

   **Via UI**:
   - Open `http://localhost:3000`
   - Use the todo form to add items with different due dates:
     - Past date (e.g., yesterday): `2025-11-12`
     - Today's date: `2025-11-13`
     - Future date (e.g., tomorrow): `2025-11-14`
     - No due date: leave date field empty

   **Via API** (using curl or Postman):
   ```bash
   # Overdue todo
   curl -X POST http://localhost:3001/api/todos \
     -H "Content-Type: application/json" \
     -d '{"title": "Overdue task", "dueDate": "2025-11-12"}'

   # Due today todo
   curl -X POST http://localhost:3001/api/todos \
     -H "Content-Type: application/json" \
     -d '{"title": "Due today task", "dueDate": "2025-11-13"}'

   # Future todo
   curl -X POST http://localhost:3001/api/todos \
     -H "Content-Type: application/json" \
     -d '{"title": "Future task", "dueDate": "2025-11-15"}'
   ```

2. **Verify icon display**:
   - ⏰ **Overdue todos** (past due date, incomplete): Should display **clock/hourglass icon** on left side before title
   - 📅 **Due today todos** (today's date, incomplete): Should display **calendar icon** on left side before title
   - **Future todos** or **no due date**: Should display **no icon**
   - **Completed todos**: Should display **no icon** regardless of due date

3. **Test completion behavior**:
   - Mark an overdue todo as complete → icon should disappear immediately
   - Mark a due-today todo as complete → icon should disappear immediately
   - Uncheck a completed overdue todo → icon should reappear immediately

4. **Test due date changes**:
   - Edit an overdue todo and change due date to future → icon should disappear
   - Edit a future todo and change due date to past → icon should appear
   - Edit a no-due-date todo and add past due date → icon should appear

### Accessibility Testing

1. **Screen reader testing**:
   - Use a screen reader (NVDA, JAWS, VoiceOver)
   - Navigate to a todo with an overdue icon
   - Verify screen reader announces "Overdue task" or similar
   - Verify due-today icon is announced as "Due today"

2. **Keyboard navigation**:
   - Tab through todo list
   - Verify icons do not receive focus (they are informational only)
   - Verify checkbox and buttons are keyboard accessible

3. **High contrast mode**:
   - Enable OS high contrast mode
   - Verify icon outlines are visible
   - Verify icons are distinguishable by shape (not just color)

---

## Running Tests

### All Tests (Frontend + Backend)

```bash
# From repository root
npm test
```

### Frontend Tests Only

```bash
npm test --workspace=packages/frontend
```

**Key test files**:
- `packages/frontend/src/utils/__tests__/dateUtils.test.js` - Date calculation logic
- `packages/frontend/src/components/__tests__/TodoCard.test.js` - Icon rendering

### Backend Tests Only

```bash
npm test --workspace=packages/backend
```

(No backend changes for this feature, but existing tests should still pass)

### Test Coverage

```bash
# Generate coverage report
npm test -- --coverage

# View coverage in browser (after running above)
open coverage/lcov-report/index.html
```

**Coverage targets**:
- Overall: 80%+ required
- New files (`dateUtils.js`): 100% expected
- Modified files (`TodoCard.js`): 90%+ expected

### Watch Mode (for development)

```bash
# Run tests in watch mode (re-runs on file changes)
npm test -- --watch
```

---

## Debugging Tips

### Date Not Calculating Correctly

**Issue**: Icons not showing when expected or showing at wrong times

**Debug steps**:
1. Check browser console for current date:
   ```javascript
   console.log(new Date().toLocaleDateString('en-CA')); // Should be YYYY-MM-DD
   ```

2. Verify todo's `dueDate` format:
   ```javascript
   console.log(todo.dueDate); // Should be "YYYY-MM-DD" string
   ```

3. Test date comparison manually:
   ```javascript
   import { isOverdue, isDueToday } from './utils/dateUtils';
   console.log(isOverdue('2025-11-12', false)); // Should be true if today is after 2025-11-12
   ```

4. Check system date/time is correct (overdue uses client local date)

### Icons Not Rendering

**Issue**: Icons missing from TodoCard

**Debug steps**:
1. Verify icon components exist:
   - `packages/frontend/src/components/OverdueIcon.js`
   - `packages/frontend/src/components/DueTodayIcon.js`

2. Check TodoCard imports:
   ```javascript
   import { OverdueIcon } from './OverdueIcon';
   import { DueTodayIcon } from './DueTodayIcon';
   import { isOverdue, isDueToday } from '../utils/dateUtils';
   ```

3. Verify `renderDateIcon()` logic in TodoCard

4. Check browser DevTools Elements panel for SVG elements

### Tests Failing Due to Date

**Issue**: Tests fail inconsistently or only on certain dates

**Solution**: Mock the current date in tests:

```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-11-13')); // Fix date for consistency
});

afterEach(() => {
  jest.useRealTimers();
});
```

---

## File Locations

### Files Created (New)

```
packages/frontend/src/
├── utils/
│   ├── dateUtils.js                    # Date calculation functions
│   └── __tests__/
│       └── dateUtils.test.js           # Unit tests for date logic
└── components/
    ├── OverdueIcon.js                  # Clock/hourglass SVG icon
    └── DueTodayIcon.js                 # Calendar SVG icon
```

### Files Modified

```
packages/frontend/src/components/
├── TodoCard.js                         # Added icon rendering logic
└── __tests__/
    └── TodoCard.test.js                # Added tests for overdue/due-today icons
```

---

## Common Development Workflows

### Adding a New Date-Related Feature

1. Add utility function to `dateUtils.js`
2. Write unit tests in `dateUtils.test.js`
3. Update TodoCard to use new function
4. Add integration tests to `TodoCard.test.js`
5. Verify in browser with manual testing

### Changing Icon Design

1. Modify `OverdueIcon.js` or `DueTodayIcon.js` SVG paths
2. Update `aria-label` if meaning changes
3. Test in browser and verify accessibility
4. No test changes needed (tests check for aria-label, not specific SVG paths)

### Adjusting Date Comparison Logic

1. Modify `dateUtils.js` functions
2. Update unit tests to cover new edge cases
3. Run tests: `npm test -- dateUtils.test.js`
4. Verify in browser with manual test cases

---

## Performance Verification

### Measuring Icon Render Time

Open browser DevTools Performance tab:

1. Start recording
2. Navigate to todo list page
3. Stop recording
4. Look for TodoCard render time

**Expected**: Each TodoCard should render in <10ms, including icon calculation.

### Load Testing

Create 100 todos with various due dates:

```bash
# Shell script to create test data
for i in {1..100}; do
  curl -X POST http://localhost:3001/api/todos \
    -H "Content-Type: application/json" \
    -d "{\"title\": \"Test todo $i\", \"dueDate\": \"2025-11-$((10 + (i % 20)))\"}";
done
```

Verify:
- Page loads in <2 seconds
- Scrolling is smooth
- Icons render within 1 second of list appearing

---

## Troubleshooting

### Backend not starting

```bash
# Check if port 3001 is already in use
lsof -i :3001

# Kill process if needed
kill -9 <PID>

# Restart backend
npm run start --workspace=packages/backend
```

### Frontend not connecting to backend

1. Verify backend is running on `http://localhost:3001`
2. Check frontend proxy configuration in `package.json`:
   ```json
   "proxy": "http://localhost:3001"
   ```
3. Restart frontend: `npm run start --workspace=packages/frontend`

### Tests not finding date utils

Verify import path:
```javascript
// Correct (relative path from component)
import { isOverdue } from '../utils/dateUtils';

// Incorrect (absolute path without alias)
import { isOverdue } from 'utils/dateUtils'; // Won't work without alias config
```

---

## Next Steps

After verifying the feature works locally:

1. ✅ Run full test suite: `npm test`
2. ✅ Check test coverage: `npm test -- --coverage` (must be 80%+)
3. ✅ Manual accessibility testing with screen reader
4. ✅ Commit changes: `git commit -m "feat: add overdue todo icons"`
5. ✅ Push branch: `git push origin 001-overdue-todos`
6. ⏭️ Create pull request for code review
7. ⏭️ Address review feedback
8. ⏭️ Merge to main branch

---

## Additional Resources

- **Feature Spec**: `specs/001-overdue-todos/spec.md`
- **Implementation Plan**: `specs/001-overdue-todos/plan.md`
- **Research Notes**: `specs/001-overdue-todos/research.md`
- **Data Model**: `specs/001-overdue-todos/data-model.md`
- **Project Docs**: `docs/` (coding guidelines, testing guidelines, UI guidelines)

**Questions or issues?** Check the project documentation or ask in code review comments.
