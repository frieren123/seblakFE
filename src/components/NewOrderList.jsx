import React, { useState, useEffect } from 'react'
import { Box, List, ListItem, NumberInputStepper, NumberDecrementStepper, NumberInput, 
         NumberIncrementStepper, NumberInputField, Text } from '@chakra-ui/react'
import { ShoppingBag } from 'phosphor-react'
import ModalElement from './ModalElement'
import { useOrder } from '../context/OrderProvider'
import { useProduct } from '../context/ProductProvider'

const NewOrderList = ({ orderId, onClose, getOrderlists }) => {

    const [orderItem, setOrderItem] = useState([])
    const { createOrderAndAddItems } = useOrder()
    const { products, getProducts } = useProduct()

    useEffect(() => {
      getProducts()
    }, [])

    const handleQuantityChange = (quantity, product) => {

        let qty = parseInt(quantity);
        
        if (qty > 0) {
    
          if (!orderItem.find(item => item.productsId === product.id)) {
            setOrderItem([...orderItem, { productsId: product.id, qty: qty }]);
          } else {
            setOrderItem(orderItem.map(item => {
              if (item.productsId === product.id) {
                return { ...item, qty: qty };
              }
              return item;
            }));
          }
        } else {
          setOrderItem(orderItem.filter(item => item.productsId !== product.id));
        }
      };

      const handleAddItemToOrderlist = async () => {
          await createOrderAndAddItems(orderItem)
          console.log(orderItem)
          onClose()
          // getOrderlists()
      }

    const mapProducts = products?.map((product, index) => {
        return (
          <ListItem display='flex' gap='5px' alignItems='center' key={index}>
            <ShoppingBag size={32}/>
            <Box w='100%' display='flex' justifyContent='space-between'>
              <Text>{product.name}</Text>
              <Text>{product.price}</Text>
            </Box>
            <NumberInput defaultValue={0} min={0} max={20} w='100px' onChange={(valueString) => handleQuantityChange(valueString, product)}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </ListItem>
        )
      })

  return (
    <ModalElement action={"Add Item"} onClose={onClose} actionFunction={handleAddItemToOrderlist} modalHeader={"Add Item"}>
      <List spacing={3}>
        {mapProducts}
      </List>
    </ModalElement>
  )
}

export default NewOrderList