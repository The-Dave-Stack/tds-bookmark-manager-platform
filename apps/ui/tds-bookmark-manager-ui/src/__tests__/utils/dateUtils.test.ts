/**
 * dateUtils.test.ts
 *
 * Purpose:
 * - Unit tests for the date utility functions (`formatDate`, `getDateRange`, `isWithinRange`).
 * - Verifies that date formatting, range calculation, and range checking work as expected.
 *
 * Logic Overview:
 * 1. Imports the utility functions from `../../utils/dateUtils`.
 * 2. Tests `formatDate`:
 *    - Asserts that a given Date object is formatted into a 'YYYY-MM-DD' string.
 * 3. Tests `getDateRange`:
 *    - Asserts that `lastHour` and `last24Hours` presets return correct start and end Date objects with the expected time difference.
 * 4. Tests `isWithinRange`:
 *    - Asserts that a date falls within a specified range.
 *    - Asserts that dates outside the range are correctly identified.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { describe, it, expect } from 'vitest';

import { formatDate, getDateRange, isWithinRange } from '../../utils/dateUtils';

describe('Date Utils', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-01T12:00:00Z');
    expect(formatDate(date)).toBe('2024-01-01');
  });

  it('gets correct date range for last hour', () => {
    const now = new Date();
    const { start, end } = getDateRange('lastHour');
    
    const diff = end.getTime() - start.getTime();
    expect(diff).toBe(3600000); // 1 hour in milliseconds
  });

  it('gets correct date range for last 24 hours', () => {
    const { start, end } = getDateRange('last24Hours');
    
    const diff = end.getTime() - start.getTime();
    expect(diff).toBe(86400000); // 24 hours in milliseconds
  });

  it('checks if date is within range', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    const date = new Date('2024-01-15');
    
    expect(isWithinRange(date, start, end)).toBe(true);
    expect(isWithinRange(new Date('2023-12-31'), start, end)).toBe(false);
    expect(isWithinRange(new Date('2024-02-01'), start, end)).toBe(false);
  });
});
