import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "cart";
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

export default function CartProvider({ children }) {
  const initCart = getCartFromLocalStorage();
  const [cartItems, setCartItems] = useState(initCart.items);
  const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
  const [totalCount, setTotalCount] = useState(initCart.totalCount);

  useEffect(() => {
    const totalPrice = sum(cartItems.map((item) => item.price));
    const totalCount = sum(cartItems.map((item) => item.quantity));
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);

    localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        items: cartItems,
        totalPrice,
        totalCount,
      })
    );
  }, [cartItems]);

  function getCartFromLocalStorage() {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
  }

  const sum = (items) => {
    return items.reduce((prevValue, currValue) => prevValue + currValue, 0);
  };

  const removeFromCart = (food) => {
    const filteredCartItems = cartItems.filter(
      (item) =>
        !(
          item.food.id === food.id &&
          item.food.price === food.price &&
          item.food.instructions === food.instructions
        )
    );
    setCartItems(filteredCartItems);
  };

  const changeQuantity = (cartItem, newQuantity) => {
    const { food } = cartItem;

    const changedCartItem = {
      ...cartItem,
      quantity: newQuantity,
      price: food.price * newQuantity,
    };

    setCartItems(
      cartItems.map((item) =>
        item.food.id === food.id &&
        item.food.price === food.price &&
        item.food.instructions === food.instructions
          ? changedCartItem
          : item
      )
    );
  };

  const addToCart = (food, quantity) => {
    const cartItem = cartItems.find(
      (item) =>
        item.food.id === food.id &&
        item.food.price === food.price &&
        item.food.instructions === food.instructions
    );
    if (cartItem) {
      changeQuantity(cartItem, cartItem.quantity + quantity);
    } else {
      setCartItems([
        ...cartItems,
        { food, quantity: quantity, price: food.price * quantity },
      ]);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    setTotalCount(0);
    localStorage.setItem(CART_KEY, JSON.stringify(EMPTY_CART));
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice, totalCount },
        removeFromCart,
        changeQuantity,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
