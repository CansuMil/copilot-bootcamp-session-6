/**
 * Date utility functions for todo items
 */

/**
 * Checks if a todo item is overdue
 * @param {string} dueDate - ISO date string (YYYY-MM-DD)
 * @param {boolean} completed - whether the todo is completed
 * @returns {boolean} - true if overdue, false otherwise
 */
export function isOverdue(dueDate, completed) {
  if (!dueDate || completed) {
    return false;
  }
  
  const today = new Date().toLocaleDateString('en-CA');
  return dueDate < today;
}

/**
 * Checks if a todo item is due today
 * @param {string} dueDate - ISO date string (YYYY-MM-DD)
 * @param {boolean} completed - whether the todo is completed
 * @returns {boolean} - true if due today, false otherwise
 */
export function isDueToday(dueDate, completed) {
  if (!dueDate || completed) {
    return false;
  }
  
  const today = new Date().toLocaleDateString('en-CA');
  return dueDate === today;
}
