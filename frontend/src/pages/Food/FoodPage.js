import React, { useEffect, useState } from 'react'
import styles from './foodPage.module.css'
import { useParams } from 'react-router-dom';
import { getById } from '../../services/foodService';
import StarRating from '../../components/StarRating/StarRating';
import Tags from '../../components/Tags/Tags';
import Price from '../../components/Price/Price';

export default function FoodPage() {
    const [food, setFood] = useState({});
    const {id} = useParams();

    useEffect(() => {
        getById(id).then(setFood);
    }, [id])

  return ( //Food page for each individual item
    <>
    {food && <div className={styles.container}>
        <img className={styles.image}
        src={`/foods/${food.imageUrl}`}
        alt={food.name}></img>
        <div className={styles.details}>
            <div className={styles.header}>
                <span className={styles.name}>
                    {food.name}
                </span>
                <span className={`${styles.favorites} ${food.favorite ? '' : styles.not}`}>
                    ❤
                </span>
            </div>
            <div className={styles.rating}>
                <StarRating stars={food.stars} size={25}></StarRating>
            </div>
            <div className={styles.origins}>
                {
                    food.origins?.map(origin => <span key={origin}>{origin}</span>)
                }
            </div>
            <div className={styles.tags}>
                {food.tags && (<Tags tags={food.tags.map(tag => ({name: tag}))}
                forFoodPage={true}></Tags>
                )}
            </div>
            <div className={styles.cook_time}>
                <span>
                    Time to cook about: <strong>{food.cookTime}</strong> minutes
                </span>
            </div>
            <div className={styles.price}>
                <Price price={food.price}></Price>
            </div>
            
            <button>Add to Cart</button>
        </div>
    </div>}
    </>
  )
}
