import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  // User Story 1: Visual Identification of Overdue Items
  describe('Overdue indicators', () => {
    it('should render clock icon when todo is overdue', () => {
      const overdueTodo = {
        ...mockTodo,
        dueDate: '2025-11-01', // Past date
        completed: 0
      };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const icon = screen.getByLabelText('Overdue');
      expect(icon).toBeInTheDocument();
    });

    it('should NOT render clock icon when todo is completed (even if overdue)', () => {
      const completedOverdueTodo = {
        ...mockTodo,
        dueDate: '2025-11-01', // Past date
        completed: 1
      };
      render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    });

    it('should NOT render clock icon when todo has no due date', () => {
      const todoNoDate = { ...mockTodo, dueDate: null, completed: 0 };
      render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    });

    it('should NOT render clock icon when due date is today or future', () => {
      const futureDate = '2025-12-31';
      const futureTodo = { ...mockTodo, dueDate: futureDate, completed: 0 };
      render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
      
      const today = new Date().toLocaleDateString('en-CA');
      const todayTodo = { ...mockTodo, dueDate: today, completed: 0 };
      const { rerender } = render(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    });
  });

  // User Story 2: Automatic Overdue Status Updates
  describe('Automatic status updates', () => {
    it('should recalculate overdue status on component render', () => {
      const overdueTodo = {
        ...mockTodo,
        dueDate: '2025-11-01',
        completed: 0
      };
      
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      // Icon should be present on first render
      expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
      
      // Icon should still be present on re-render (recalculated)
      rerender(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
    });
  });

  // User Story 3: Clear Distinction Between Overdue and Non-Overdue
  describe('Date state icons', () => {
    it('should render calendar icon when todo is due today', () => {
      const today = new Date().toLocaleDateString('en-CA');
      const todayTodo = {
        ...mockTodo,
        dueDate: today,
        completed: 0
      };
      render(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);
      
      const icon = screen.getByLabelText('Due today');
      expect(icon).toBeInTheDocument();
    });

    it('should NOT render any icon when due date is in future', () => {
      const futureTodo = {
        ...mockTodo,
        dueDate: '2025-12-31',
        completed: 0
      };
      render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Due today')).not.toBeInTheDocument();
    });

    it('should NOT render any icon when there is no due date', () => {
      const todoNoDate = {
        ...mockTodo,
        dueDate: null,
        completed: 0
      };
      render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
      
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Due today')).not.toBeInTheDocument();
    });

    it('should display distinct icons for overdue vs due-today vs future', () => {
      // Overdue
      const overdueTodo = { ...mockTodo, dueDate: '2025-11-01', completed: 0 };
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
      expect(screen.queryByLabelText('Due today')).not.toBeInTheDocument();
      
      // Due today
      const today = new Date().toLocaleDateString('en-CA');
      const todayTodo = { ...mockTodo, dueDate: today, completed: 0 };
      rerender(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Due today')).toBeInTheDocument();
      
      // Future
      const futureTodo = { ...mockTodo, dueDate: '2025-12-31', completed: 0 };
      rerender(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Due today')).not.toBeInTheDocument();
    });
  });
});
