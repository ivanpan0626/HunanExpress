import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import styles from "./checkoutPage.module.css";
import Title from "../../components/Title/Title";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useCart } from "../../hooks/useCart";
import Price from "../../components/Price/Price";
import NotFound from "../../components/NotFound/NotFound"; // In case the cart is empty
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51QOU6CGMMMgbOUn4SuChOCJL0QjrikLwUBN7nZJxtOEMLdYFIFSNUt1Q6kjM9Tg1I9CsegyRWKJRJtmk5bWsGN1100XZ3NOi6D"
);

export default function CheckoutPage() {
  const { cart } = useCart();
  const [orderType, setOrderType] = useState("pickup"); // State to hold 'pickup' or 'delivery'
  const [pickupTime, setPickupTime] = useState(""); // State to hold the selected pickup time
  const [deliveryTime, setDeliveryTime] = useState(""); // State to hold the selected delivery time

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Convert a Date object to 12-hour format with AM/PM
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  // Generate time options for pickup or delivery (15-minute increments, starting from 30 minutes from now, with a max of 2 hours)
  const getTimeOptions = () => {
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 30); // Start 30 minutes from now
    const timeOptions = ["ASAP"];

    // Generate time options for the next 2 hours (15-minute increments)
    for (let i = 0; i < 8; i++) {
      timeOptions.push(formatTime(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    return timeOptions;
  };

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value); // Update the form based on the selection
  };

  const onSubmit = async (data) => {
    try {
      // Create the cart items array to send to the backend
      const items = cart.items.map((item) => ({
        name: item.food.name,
        description: item.food.description, // Optional, add product description
        price: item.food.price,
        quantity: item.quantity,
      }));

      // Add order type, pickup time, and delivery time (if applicable)
      const orderData = {
        ...data,
        orderType,
        pickupTime: orderType === "pickup" ? pickupTime : null, // Only include pickup time if it's a pickup order
        deliveryTime: orderType === "delivery" ? deliveryTime : null, // Only include delivery time if it's a delivery order
      };

      // Make a POST request to create the Checkout session using axios
      const response = await axios.post("/api/stripe/create-checkout-session", {
        items,
        customData: orderData,
      });

      if (response.data && response.data.sessionId) {
        const { sessionId } = response.data;

        // Redirect the user to Stripe Checkout using the session ID
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error(error);
          alert("An error occurred during payment!");
        }
      } else {
        throw new Error("No session ID returned");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during payment!");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
        <div className={styles.cart}>
          <Title title="Cart" fontSize="1.6rem" />
          {cart.items.length === 0 ? (
            <NotFound
              message="Your cart is empty"
              linkedText="Add items to cart!"
            />
          ) : (
            <div className={styles.cartItems}>
              <ul>
                {cart.items.map((item) => (
                  <li key={item.food.id}>
                    <div>
                      <img src={item.food.imageUrl} alt={item.food.name} />
                    </div>
                    <div>{item.food.name}</div>
                    <div>Quantity: {item.quantity}</div>
                    <div>
                      <Price price={item.price} />
                    </div>
                  </li>
                ))}
              </ul>
              <div className={styles.cartSummary}>
                <div>Total Count: {cart.totalCount}</div>
                <div>
                  Subtotal: <Price price={cart.totalPrice} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <Title title="" fontSize="1.6rem" />
          <div className={styles.inputs}>
            {/* Select Order Type (Pickup or Delivery) */}
            <div>
              <label>Select Order Type</label>
              <select
                onChange={handleOrderTypeChange}
                value={orderType}
                required
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            {/* Conditionally render fields based on order type */}
            {orderType === "pickup" ? (
              <>
                <Input
                  label="Name"
                  {...register("name", { required: "Name is required" })}
                  error={errors.name}
                />
                <Input
                  label="Phone Number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/, // 10-digit number
                      message: "Phone number must be 10 digits",
                    },
                  })}
                  error={errors.phone}
                />
                <div>
                  <label>Pickup Time</label>
                  <select
                    {...register("pickupTime", {
                      required: "Pickup time is required",
                    })}
                    onChange={(e) => setPickupTime(e.target.value)}
                    value={pickupTime}
                  >
                    {getTimeOptions().map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <Input
                  label="Name"
                  {...register("name", { required: "Name is required" })}
                  error={errors.name}
                />
                <Input
                  label="Phone Number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/, // 10-digit number
                      message: "Phone number must be 10 digits",
                    },
                  })}
                  error={errors.phone}
                />
                <Input
                  label="Address"
                  {...register("address", { required: "Address is required" })}
                  error={errors.address}
                />
                <Input label="APT#" {...register("apt")} error={errors.apt} />
                <Input
                  label="City"
                  {...register("city", { required: "City is required" })}
                  error={errors.city}
                />
                <Input
                  label="Zip Code"
                  {...register("zipcode", {
                    required: "Zip Code is required",
                    pattern: {
                      value: /^[0-9]{5}$/, // 5-digit zip code
                      message: "Zip Code must be 5 digits",
                    },
                  })}
                  error={errors.zipcode}
                />
                <div>
                  <label>Delivery Time</label>
                  <select
                    {...register("deliveryTime", {
                      required: "Delivery time is required",
                    })}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    value={deliveryTime}
                  >
                    {getTimeOptions().map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className={styles.total}>
            Subtotal: <Price price={cart.totalPrice} />
          </div>
          <div className={styles.total}>
            Fees & Taxes:
            <div className={styles.infocontainer}>
              <i className={styles.infoicon}>i</i>
              <div className={styles.popup}>
                <p>
                  Tax: <Price price={cart.totalPrice * 0.06625} />
                </p>
                <p>Fees: $0.99</p>
              </div>
            </div>
            <Price price={cart.totalPrice * 0.06625 + 0.99} />
          </div>
          <div className={styles.total}>
            Total: <Price price={cart.totalPrice * 1.06625 + 0.99} />
          </div>
        </div>

        <div className={styles.buttons_container}>
          <div className={styles.buttons}>
            <Button
              type="submit"
              text="Go To Payment"
              width="100%"
              height="3rem"
            />
          </div>
        </div>
      </form>
    </>
  );
}
