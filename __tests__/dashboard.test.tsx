import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardPage from "@/app/page";
import { useQuery } from "convex/react";

// Mock the Convex hooks
vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe("Dashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the main heading", () => {
    // Default mock implementation
    (useQuery as any).mockReturnValue([]);
    
    render(<DashboardPage />);
    const heading = screen.getByRole("heading", { name: /dashboard/i });
    expect(heading).toBeInTheDocument();
  });

  it("shows loading state when data is undefined", () => {
    (useQuery as any).mockReturnValue(undefined);

    render(<DashboardPage />);
    // There are two loading states (Activity and Tasks)
    const loadingElements = screen.getAllByText(/loading/i);
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it("shows empty state when data is empty", () => {
    (useQuery as any).mockReturnValue([]);

    render(<DashboardPage />);
    expect(screen.getByText(/no activities yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no scheduled tasks/i)).toBeInTheDocument();
  });
});
