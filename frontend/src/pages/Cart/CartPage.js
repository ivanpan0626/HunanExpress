import React, { useEffect } from "react";
import styles from "./cartPage.module.css";
import { useCart } from "../../hooks/useCart";
import Title from "../../components/Title/Title.js";
import { Link } from "react-router-dom";
import Price from "../../components/Price/Price";
import NotFound from "../../components/NotFound/NotFound";

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();

  return (
    <>
      <Title title="Cart" margin="1.5rem 0 0 2.5rem"></Title>

      {cart.items.length === 0 ? (
        <NotFound
          message="Cart is Empty"
          linkedText="Order from Menu!"
        ></NotFound>
      ) : (
        <div className={styles.container}>
          <ul className={styles.list}>
            {cart.items.map((item) => (
              <li key={item.food.id}>
                <div>
                  <img src={`${item.food.imageUrl}`} alt={item.food.name}></img>
                </div>
                <div>
                  <Link to={`/food/${item.food.id}`}>{item.food.name}</Link>
                  {item.food.instructions !== "" ? (
                    <div>{item.food.instructions}</div>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    value={item.quantity || Number(1)}
                    min="1"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only update quantity if the input is a valid number or empty
                      if (
                        value === "" ||
                        (!isNaN(value) && Number(value) >= 1)
                      ) {
                        changeQuantity(item, value === "" ? 1 : Number(value)); // Default to 1 if empty
                      }
                    }}
                  />
                </div>
                <div>
                  <Price price={item.price}></Price>
                </div>
                <div>
                  <button
                    className={styles.remove_button}
                    onClick={() => removeFromCart(item.food)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.checkout}>
            <div>
              <div className={styles.foods_count}>{cart.totalCount}</div>
              <div className={styles.total_price}>
                <Price price={cart.totalPrice}></Price>
              </div>
            </div>
            <Link to="/checkout">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </>
  );
}
