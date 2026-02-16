import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as convexReact from 'convex/react'
import DashboardPage from '../app/page'

// Mock the API object
vi.mock('@/convex/_generated/api', () => ({
  api: {
    activities: { list: 'activities:list' },
    tasks: { list: 'tasks:list', toggle: 'tasks:toggle' },
  },
}))

// Mock hooks
vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders loading state initially', () => {
    // @ts-ignore
    convexReact.useQuery.mockReturnValue(undefined)
    render(<DashboardPage />)
    expect(screen.getAllByText('Loading...')).toHaveLength(2)
  })

  it('renders empty states', () => {
    // @ts-ignore
    convexReact.useQuery.mockReturnValue([])
    render(<DashboardPage />)
    expect(screen.getByText(/No activities yet/i)).toBeInTheDocument()
    expect(screen.getByText(/No scheduled tasks/i)).toBeInTheDocument()
  })

  it('renders activities and tasks', () => {
    // @ts-ignore
    convexReact.useQuery.mockImplementation((queryKey) => {
      if (queryKey === 'activities:list') {
        return [{
          _id: '1',
          type: 'message',
          action: 'Test Action',
          details: 'Test Details',
          timestamp: Date.now(),
        }]
      }
      if (queryKey === 'tasks:list') {
        return [{
          _id: 't1',
          name: 'Test Task',
          schedule: 'every 5m',
          enabled: true,
          color: '#ff0000',
        }]
      }
      return []
    })

    render(<DashboardPage />)
    expect(screen.getByText('Test Action')).toBeInTheDocument()
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('calls toggleTask mutation when clicking status', () => {
    const toggleFn = vi.fn()
    // @ts-ignore
    convexReact.useMutation.mockReturnValue(toggleFn)
    
    // @ts-ignore
    convexReact.useQuery.mockImplementation((queryKey) => {
      if (queryKey === 'tasks:list') {
        return [{
          _id: 't1',
          name: 'Toggle Me',
          schedule: 'once',
          enabled: true,
          color: '#ff0000',
        }]
      }
      return []
    })

    render(<DashboardPage />)
    
    const statusBadge = screen.getByText('active')
    fireEvent.click(statusBadge)
    
    expect(toggleFn).toHaveBeenCalledWith({ id: 't1' })
  })
})
