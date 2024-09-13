import React from 'react'
import styles from './starRating.module.css'

export default function StarRating({stars, size}) {
    const starStyles = {
        width: size + 'px',
        height: size + 'px',
        marginRight: size/6 + 'px',
    };

    function Star({number}){
        const halfNumber = number - 0.5;

        return (
            stars >= number ? (
                <img src='/star-full.svg' style={starStyles} alt={number}>
                </img> )
            : stars >= halfNumber ? (
                <img src='/star-half.svg' style={starStyles} alt={number}>
                </img> )
            : (
                <img src='/star-empty.svg' style={starStyles} alt={number}>
                </img>
            ) 
        );
    }

  return (
    <div className={styles.rating}>
        {
            [1,2,3,4,5].map(number => (
                <Star key={number} number={number}></Star>
            ))
        }
    </div>
  )
}

StarRating.defaultProps = {
    size: 18,

};
