'use client';
import { Stack, Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { getDocs, query, collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  // Function to update inventory
  const updateInventory = async () => {
    const snapshot = await getDocs(query(collection(firestore, 'inventory')));
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        quantity: doc.data().counts || 0, 
      });
    });
    setInventory(inventoryList);
  };

  // Function to add item from database
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { counts } = docSnap.data();
      await setDoc(docRef, { counts: counts + 1 });
    } else {
      await setDoc(docRef, { counts: 1 });
    }
    await updateInventory();
  };

  // Function to remove item from database
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { counts } = docSnap.data();
      if (counts === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { counts: counts - 1 });
      }
    }
    await updateInventory();
  };

  // UseEffect to fetch inventory on component mount
  useEffect(() => {
    updateInventory();
  }, []);

  // Handlers for modal open and close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filtered inventory items based on search term
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection={'column'}
      justifyContent="center" 
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position={'absolute'}      
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="1px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined" 
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Enter
            </Button>
          </Stack>
        </Box> 
      </Modal>

      {/* Search Bar */}
      <Box width="800px" mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {/* Outline box */}
      <Box border='1px solid #333'>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Typography variant='h3' color={'#333'}>
            Inventory Items
          </Typography>
        </Box>
        <Box
          width="800px"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          gap={2}
          overflow="auto"
          p={2}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box 
              key={name}
              width="calc(33.33% - 16px)" // Adjust the width based on the number of items you want per row
              minHeight="150px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              bgcolor="#f0f0f0"
              padding={2}
              textAlign="center"
              border="1px solid #ddd"
              borderRadius={2}
            >
              <Typography variant='h5' color='#333'>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant='h5' color='#333'>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={1} marginTop={2}>
              <Button variant="contained" onClick={() => addItem(name)}>
                Add item
              </Button>

                <Button variant='contained' onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>


  <Button           
    variant="outlined"
    onClick={handleOpen}
    sx={{
      position: 'absolute',
      bottom: 16, // Distance from the bottom of the container
      left: 16,   // Distance from the left of the container
    }}
  >
   New item
  </Button>
</Box>
  );
}
