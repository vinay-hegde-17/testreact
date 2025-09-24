import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import LoadData from "./LoadData";
import { fetchAllItems } from "../service/items";

jest.mock("../service/items");

const mockItems = [
  { _id: "1", name: "Bluetooth Speaker", description: "Portable speaker" },
  { _id: "2", name: "Wireless Mouse", description: "Ergonomic mouse" },
];

describe("LoadData Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders heading correctly", async () => {
    fetchAllItems.mockResolvedValue(mockItems);
    
    render(<LoadData />);
    
    // Check immediately available elements
    expect(screen.getByText(/Item List/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Item/i })).toBeInTheDocument();
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  test("shows loading spinner initially", async () => {
    let resolvePromise;
    const controllablePromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    fetchAllItems.mockReturnValue(controllablePromise);
    
    render(<LoadData />);
    
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    
    // Resolve the promise to complete the test
    act(() => {
      resolvePromise([]);
    });
    
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  test("renders item list from API", async () => {
    fetchAllItems.mockResolvedValue(mockItems);
    
    render(<LoadData />);

    // Wait for all async operations to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Check if items are rendered after loading completes
    await waitFor(() => {
      mockItems.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
        expect(screen.getByText(item.description)).toBeInTheDocument();
      });
    });
  });

  test("renders empty table when no items returned", async () => {
    fetchAllItems.mockResolvedValue([]);
    
    render(<LoadData />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Bluetooth Speaker")).not.toBeInTheDocument();
    
    // Wait for DataGrid to render with no rows message
    await waitFor(() => {
      expect(screen.getByText(/No rows/i)).toBeInTheDocument();
    });
  });

  test("clicking edit button calls handler with correct id", async () => {
    fetchAllItems.mockResolvedValue(mockItems);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    
    render(<LoadData />);

    // Wait for loading to complete and data to be rendered
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Wait for edit buttons to be available using a more specific approach
    await waitFor(() => {
      // Find buttons that contain EditIcon (more specific than generic edit label)
      const editIcons = screen.getAllByTestId('EditIcon');
      expect(editIcons).toHaveLength(2);
      
      // Click the parent button of the first EditIcon
      const firstEditButton = editIcons[0].closest('button');
      fireEvent.click(firstEditButton);
    });

    expect(logSpy).toHaveBeenCalledWith("Edit item with ID:", "1");
    logSpy.mockRestore();
  });
});
