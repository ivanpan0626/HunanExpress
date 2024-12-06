import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import axios from "axios";
import styles from "./checkoutSuccess.module.css";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [data, setData] = useState();
  const [errorTitle, setErrorTitle] = useState("Fetching details from Stripe");
  const [errorMsg, setErrorMsg] = useState("Loading... Please Wait.");

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/stripe/checkout-session/${sessionId}`
        );
        if (response.status === 200) {
          clearCart();
          setData(response.data);
        }
      } catch (error) {
        setErrorTitle("Error Fetching Details");
        setErrorMsg("Invalid Session");
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  return (
    <div className={styles.container}>
      {data ? (
        <div className={styles.success}>
          <h1 className={styles.title}>{data.title}</h1>
          <h2 className={styles.body}>{data.body}</h2>
          <h3 className={styles.footer}>{data.footer}</h3>
        </div>
      ) : (
        <div className={styles.error}>
          <h1>{errorMsg}</h1>
          <h2>{errorTitle}</h2>
          <h3>You have not been charged.</h3>
        </div>
      )}
    </div>
  );
};

export default CheckoutSuccess;
