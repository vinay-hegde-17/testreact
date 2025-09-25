import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const ItemDialog = ({ open, handleClose, handleSave, initialData }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        stock: initialData.stock,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSave = () => {
    handleSave({
      ...formData,
      price: formData.price ? Number(formData.price) : undefined,
      stock: formData.stock ? Number(formData.stock) : undefined,
    });
    setFormData({});
  };

  const oncloseDialog = () =>{
    handleClose();
    setFormData('');
  }
  return (
    <Dialog open={open} onClose={oncloseDialog}>
      <DialogTitle>{initialData ? "Edit Item" : "Add Item"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          fullWidth
          multiline
          minRows={3}
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Price"
          name="price"
          type="number"
          fullWidth
          value={formData.price}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Stock"
          name="stock"
          type="number"
          fullWidth
          value={formData.stock}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={oncloseDialog} color="secondary" variant="contained">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          {initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDialog;
