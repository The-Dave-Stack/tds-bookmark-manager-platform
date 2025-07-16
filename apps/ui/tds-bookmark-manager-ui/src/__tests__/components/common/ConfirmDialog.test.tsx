/**
 * ConfirmDialog.test.tsx
 *
 * Purpose:
 * - Unit tests for the `ConfirmDialog` component.
 * - Verifies correct rendering, styling, and interaction handling of the confirmation dialog.
 *
 * Logic Overview:
 * 1. Defines `defaultProps` for the `ConfirmDialog` component, including mock functions for `onClose` and `onConfirm`.
 * 2. Uses `beforeEach` to clear all mocks and `afterEach` to clean up the DOM after each test.
 * 3. Tests:
 *    - Renders correctly with default (destructive) styling, checking for title, message, buttons, and red button class.
 *    - Renders correctly with non-destructive styling when `isDestructive` is false, checking for blue button class and absence of alert icon.
 *    - Calls `onConfirm` and `onClose` when the confirm button is clicked.
 *    - Calls `onClose` and does not call `onConfirm` when the cancel button is clicked.
 *    - Does not render the dialog when `isOpen` is false.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';


import ConfirmDialog from '../../../components/common/ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Test Title',
    message: 'Test Message',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup(); // Clean up DOM after each test
  });

  it('renders correctly with destructive styling by default', () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.confirmText)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.cancelText)).toBeInTheDocument();
    
    // Check for destructive styling (red button)
    const confirmButton = screen.getByRole('button', { name: defaultProps.confirmText });
    expect(confirmButton).toHaveClass('bg-red-600');
    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument(); // Assuming AlertTriangle has a testId
  });

  it('renders correctly with non-destructive styling when isDestructive is false', () => {
    render(<ConfirmDialog {...defaultProps} isDestructive={false} />);

    // Check for non-destructive styling (blue button)
    const confirmButton = screen.getByRole('button', { name: defaultProps.confirmText });
    expect(confirmButton).toHaveClass('bg-blue-600');
    expect(screen.queryByTestId('alert-triangle-icon')).not.toBeInTheDocument();
  });

  it('calls onConfirm and onClose when confirm button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText(defaultProps.confirmText));
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText(defaultProps.cancelText));
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(defaultProps.title)).not.toBeInTheDocument();
  });
});
