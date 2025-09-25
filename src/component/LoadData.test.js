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

  test("clicking edit button opens dialog with correct item", async () => {
    fetchAllItems.mockResolvedValue(mockItems);

    render(<LoadData />);

    // Wait for table
    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );

    // Click edit
    const editIcons = screen.getAllByTestId("EditIcon");
    fireEvent.click(editIcons[0].closest("button"));

    // Now check if dialog opened with correct data
    expect(await screen.findByDisplayValue(mockItems[0].name)).toBeInTheDocument();
  });
  });
