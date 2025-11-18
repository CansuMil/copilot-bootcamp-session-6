import { isOverdue, isDueToday } from '../dateUtils';

describe('dateUtils', () => {
  describe('isOverdue', () => {
    test('should return true for past date with incomplete status', () => {
      const pastDate = '2025-11-01'; // Past date
      const completed = false;
      expect(isOverdue(pastDate, completed)).toBe(true);
    });

    test('should return false for today\'s date', () => {
      const today = new Date().toLocaleDateString('en-CA');
      const completed = false;
      expect(isOverdue(today, completed)).toBe(false);
    });

    test('should return false for future date', () => {
      const futureDate = '2025-12-31'; // Future date
      const completed = false;
      expect(isOverdue(futureDate, completed)).toBe(false);
    });

    test('should return false when todo is completed', () => {
      const pastDate = '2025-11-01'; // Past date
      const completed = true;
      expect(isOverdue(pastDate, completed)).toBe(false);
    });

    test('should return false for null dueDate', () => {
      const completed = false;
      expect(isOverdue(null, completed)).toBe(false);
    });

    test('should return false for undefined dueDate', () => {
      const completed = false;
      expect(isOverdue(undefined, completed)).toBe(false);
    });
  });

  describe('isDueToday', () => {
    test('should return true for today\'s date with incomplete status', () => {
      const today = new Date().toLocaleDateString('en-CA');
      const completed = false;
      expect(isDueToday(today, completed)).toBe(true);
    });

    test('should return false for past date', () => {
      const pastDate = '2025-11-01'; // Past date
      const completed = false;
      expect(isDueToday(pastDate, completed)).toBe(false);
    });

    test('should return false for future date', () => {
      const futureDate = '2025-12-31'; // Future date
      const completed = false;
      expect(isDueToday(futureDate, completed)).toBe(false);
    });

    test('should return false when todo is completed', () => {
      const today = new Date().toLocaleDateString('en-CA');
      const completed = true;
      expect(isDueToday(today, completed)).toBe(false);
    });

    test('should return false for null dueDate', () => {
      const completed = false;
      expect(isDueToday(null, completed)).toBe(false);
    });

    test('should return false for undefined dueDate', () => {
      const completed = false;
      expect(isDueToday(undefined, completed)).toBe(false);
    });
  });

  describe('Date mocking and recalculation', () => {
    test('should use current date for overdue calculation', () => {
      // This test verifies that isOverdue uses the current date
      const pastDate = '2025-11-01';
      const futureDate = '2025-12-31';
      
      expect(isOverdue(pastDate, false)).toBe(true);
      expect(isOverdue(futureDate, false)).toBe(false);
    });
  });
});
