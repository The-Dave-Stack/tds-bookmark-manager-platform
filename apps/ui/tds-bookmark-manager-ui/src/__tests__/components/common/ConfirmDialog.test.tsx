import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
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

  it('calls onConfirm and onClose when confirm button is clicked', async () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    await act(async () => {
      fireEvent.click(screen.getByText(defaultProps.confirmText));
    });
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', async () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    await act(async () => {
      fireEvent.click(screen.getByText(defaultProps.cancelText));
    });
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(defaultProps.title)).not.toBeInTheDocument();
  });
});
