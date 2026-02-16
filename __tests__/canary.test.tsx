import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock Convex hooks
vi.mock('convex/react', () => ({
  useQuery: vi.fn(() => []), // Return empty array by default
  useMutation: vi.fn(),
}))

describe('Mission Control', () => {
  it('renders a heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })
})
