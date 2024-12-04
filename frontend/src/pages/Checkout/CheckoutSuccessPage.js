import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import axios from "axios";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/stripe/checkout-session/${sessionId}`
        );
        if (response.status === 200) {
          clearCart();
          setMsg(response.data.message);
        }
      } catch (error) {
        setMsg("Invalid Session Id");
        console.error("Error fetching session details:", error);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  return (
    <div>
      <h1>Thank you for your order!</h1>
      <h2> {msg} </h2>
    </div>
  );
};

export default CheckoutSuccess;
