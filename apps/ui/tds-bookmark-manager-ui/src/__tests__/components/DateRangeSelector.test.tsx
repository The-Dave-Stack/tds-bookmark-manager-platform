/**
 * DateRangeSelector.test.tsx
 *
 * Purpose:
 * - Unit tests for the `DateRangeSelector` component.
 * - Verifies the rendering of date preset options and the functionality of selecting presets and custom date ranges.
 *
 * Logic Overview:
 * 1. Mocks the `onChange` callback function to track component interactions.
 * 2. Uses `beforeEach` to render the component and `afterEach` to clean up.
 * 3. Tests:
 *    - Renders preset options (e.g., "Last Hour", "Last 24 Hours").
 *    - Handles preset selection: simulates a click on a preset button and asserts that `onChange` is called with valid `Date` objects.
 *    - Switches to custom date range: simulates a click on the "Custom" button and asserts that date input fields appear.
 *    - Handles custom date range changes: simulates input into start and end date fields and asserts that `onChange` is called.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import DateRangeSelector from '../../components/statistics/DateRangeSelector';
import { cleanup, fireEvent, render, screen } from '../test-utils';

describe('DateRangeSelector', () => {
  const mockOnChange = vi.fn();
  let unmount: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    ({ unmount } = render(<DateRangeSelector onChange={mockOnChange} />));
  });

  afterEach(() => {
    cleanup();
    if (unmount) {
      unmount();
    }
  });

  it('renders preset options', () => {
    expect(screen.getByTestId('preset-lastHour')).toBeInTheDocument();
    expect(screen.getByTestId('preset-last24Hours')).toBeInTheDocument();
  });

  it('handles preset selection', async () => {
    const lastHourButton = screen.getByTestId('preset-lastHour');
    await fireEvent.click(lastHourButton);
    
    expect(mockOnChange).toHaveBeenCalled();
    const call = mockOnChange.mock.calls[0][0];
    expect(call.start).toBeInstanceOf(Date);
    expect(call.end).toBeInstanceOf(Date);
  });

  it('switches to custom date range', async () => {
    const customButton = screen.getByText('statistics.dateRange.custom');
    await fireEvent.click(customButton);
    
    expect(screen.getByTestId('start-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('end-date-input')).toBeInTheDocument();
  });

  it('handles custom date range changes', async () => {
    const customButton = screen.getByText('statistics.dateRange.custom');
    await fireEvent.click(customButton);
    
    const startDate = screen.getByTestId('start-date-input');
    const endDate = screen.getByTestId('end-date-input');
    
    await fireEvent.change(startDate, { target: { value: '2024-01-01' } });
    await fireEvent.change(endDate, { target: { value: '2024-01-31' } });
    
    expect(mockOnChange).toHaveBeenCalled();
  });
});
