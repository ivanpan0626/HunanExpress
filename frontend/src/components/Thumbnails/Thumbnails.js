import React from 'react'
import styles from './thumbnails.module.css'
import { Link } from 'react-router-dom'
import StarRating from '../StarRating/StarRating.js'
import Price from '../Price/Price'

export default function Thumbnails({foods}) {
  return (
    <ul className={styles.list}>
        { //Maps every item in sample food data with an link and image to display on menu
            foods.map(food =>
                <li key={food.id}>
                    <Link to={`/food/${food.id}`}>
                        <img
                            className={styles.image}
                            src={`/foods/${food.imageUrl}`}
                            alt={food.name}
                        ></img>
                    <div className={styles.content}>
                        <div className={styles.name}>
                            {food.name}
                        </div>
                        <span
                            className={`${styles.favorite} ${
                                food.favorite ? '' : styles.not
                            }`}>
                                ❤
                        </span>
                        <div className={styles.stars}>
                            <StarRating stars={food.stars}></StarRating>
                        </div>
                        <div className={styles.product_item_footer}>
                            <div className={styles.origins}>
                                {
                                    food.origins.map(origin => (
                                        <span key={origin}>{origin}</span>
                                ))}
                            </div>
                            <div className={styles.cook_time}>
                                <span>🕒</span>
                                {food.cookTime}
                            </div>
                        </div>
                        <div className={styles.price}>
                            <Price price={food.price}></Price>
                        </div>
                    </div>
                    </Link>
                </li>
            )
        }
    </ul>
  )
}
