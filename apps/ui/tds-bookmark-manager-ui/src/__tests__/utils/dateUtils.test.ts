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