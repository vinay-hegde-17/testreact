import React, { useEffect, useState } from 'react'
import { fetchAllItems } from '../service/items';

const LoadData = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    itemsList();
  }, []);

  const itemsList = async () => {
    try {
      const response = await fetchAllItems();
      setItems(response);
      console.log(response);
      
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  return (
    <div>
      <h3>Item data is</h3>
      <ul style={{listStyle:'none'}}>
        {items.map((item)=>
           <li key={item.id}>{item.name}</li>
          )}
      </ul>
    </div>

  )
}

export default LoadData
