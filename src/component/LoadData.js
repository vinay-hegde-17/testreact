import React, { useEffect, useState } from "react";
import { fetchAllItems, createItem, updateItem } from "../service/items";
import { Grid, Typography, CircularProgress, Box, Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import ItemDialog from "./ItemDialog";

const LoadData = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    itemsList();
  }, []);

  const itemsList = async () => {
    try {
      const response = await fetchAllItems();
      setItems(response);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedItem(row);
    setDialogOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedItem) {
        await updateItem(selectedItem.id, data);
      } else {
        await createItem(data);
      }
      await itemsList();
      setDialogOpen(false);
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

const columns = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "description", headerName: "Description", flex: 2 },
  { field: "price", headerName: "Price", flex: 1 },
  { field: "stock", headerName: "Stock", flex: 1 },
  {
    field: "actions",
    headerName: "Edit",
    sortable: false,
    filterable: false,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <IconButton
        onClick={() => handleEdit(params.row)}
        color="primary"
        aria-label={`edit ${params.row.name}`}
      >
        <EditIcon />
      </IconButton>
    ),
  },
];

const rows = items.map((item) => ({
  id: item._id,
  name: item.name,
  description: item.description,
  price: item.price,
  stock: item.stock,
}));

  return (
    <Grid sx={{ margin: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Item List</Typography>
        <Button variant="contained" onClick={handleAdd}>
          Add Item
        </Button>
      </Box>

      {loading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <DataGrid rows={rows} columns={columns} autoHeight />
        </Box>
      )}

      <ItemDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        handleSave={handleSave}
        initialData={selectedItem}
      />
    </Grid>
  );
};

export default LoadData;
