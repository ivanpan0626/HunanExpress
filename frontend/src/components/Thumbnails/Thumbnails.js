import React from "react";
import styles from "./thumbnails.module.css";
import { Link } from "react-router-dom";
import StarRating from "../StarRating/StarRating.js";
import Price from "../Price/Price";

export default function Thumbnails({ foods }) {
  return (
    <ul className={styles.list}>
      {
        //Maps every item in sample food data with an link and image to display on menu
        foods.map((food) => (
          <li key={food.id}>
            <Link to={`/food/${food.id}`}>
              <img
                className={styles.image}
                src={`${food.imageUrl}`}
                alt={food.name}
              ></img>
              <div className={styles.content}>
                <div className={styles.name}>{food.name}</div>
                <div className={styles.price}>
                  <Price price={food.price}></Price>
                </div>
              </div>
            </Link>
          </li>
        ))
      }
    </ul>
  );
}
