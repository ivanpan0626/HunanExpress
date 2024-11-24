import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import styles from './checkoutPage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useCart } from '../../hooks/useCart';
import Price from '../../components/Price/Price';
import NotFound from '../../components/NotFound/NotFound'; // In case the cart is empty
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51QOU6CGMMMgbOUn4SuChOCJL0QjrikLwUBN7nZJxtOEMLdYFIFSNUt1Q6kjM9Tg1I9CsegyRWKJRJtmk5bWsGN1100XZ3NOi6D'); // Add your Stripe public key

export default function CheckoutPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { cart } = useCart();

  const onSubmit = async (data) => {
    try {
      // Create the cart items array to send to the backend
      const items = cart.items.map(item => ({
        name: item.food.name,
        description: item.food.description, // Optional, add product description
        price: item.food.price, 
        quantity: item.quantity,
      }));

      // Make a POST request to create the Checkout session using axios
      const response = await axios.post('/api/stripe/create-checkout-session', { items, customData: data});
  
      if (response.data && response.data.sessionId) {
        const { sessionId } = response.data;
  
        // Redirect the user to Stripe Checkout using the session ID
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId });
  
        if (error) {
          console.error(error);
          console.log("first error");
          alert('An error occurred during payment!');
        }
      } else {
        throw new Error('No session ID returned');
      }
    } catch (error) {
      console.error(error);
      console.log("second error");
      alert('An error occurred during payment!');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
        <div className={styles.cart}>
          <Title title="Cart" fontSize="1.6rem" />
          {cart.items.length === 0 
            ? <NotFound message="Your cart is empty" linkedText="Add items to cart!" />
            : <div className={styles.cartItems}>
                <ul>
                  {cart.items.map(item => (
                    <li key={item.food.id}>
                      <div>
                        <img src={item.food.imageUrl} alt={item.food.name} />
                      </div>
                      <div>{item.food.name}</div>
                      <div>Quantity: {item.quantity}</div>
                      <div><Price price={item.price} /></div>
                    </li>
                  ))}
                </ul>
                <div className={styles.cartSummary}>
                  <div>Total Count: {cart.totalCount}</div>
                  <div>Subtotal: <Price price={cart.totalPrice} /></div>
                </div>
              </div>
          }
        </div>

        <div className={styles.content}>
          <Title title="" fontSize="1.6rem" />
          <div className={styles.inputs}>
            <Input
              label="Name"
              {...register('name', { required: "Name is required" })}
              error={errors.name}
            />
            <Input
              label="Phone Number"
              {...register('phone', { 
                required: "Phone number is required", 
                pattern: {
                  value: /^[0-9]{10}$/, // 10-digit number
                  message: "Phone number must be 10 digits"
                }
              })}
              error={errors.phone}
            />
            <Input
              label="Address"
              {...register('address', { required: "Address is required" })}
              error={errors.address}
            />
            <Input
              label="APT#"
              {...register('floor')}
              error={errors.floor}
            />
            <Input
              label="City"
              {...register('city', { required: "City is required" })}
              error={errors.city}
            />
            <Input
              label="Zip Code"
              {...register('zipcode', { 
                required: "Zip Code is required", 
                pattern: {
                  value: /^[0-9]{5}$/, // 5-digit zip code
                  message: "Zip Code must be 5 digits"
                }
              })}
              error={errors.zipcode}
            />
          </div>
          
          <div className={styles.total}>
            Subtotal: <Price price={cart.totalPrice} />
          </div>
          <div className={styles.total}>
            Fees & Taxes: 
            <div className={styles.infocontainer}>
              <i className={styles.infoicon}>i</i>
              <div className={styles.popup}>
                <p>Tax: <Price price={cart.totalPrice * 0.06625} /></p>
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
