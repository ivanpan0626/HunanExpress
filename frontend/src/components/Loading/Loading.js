import React from 'react';
import { useLoading } from '../../hooks/useLoading';
import styles from './loading.module.css';

export default function Loading() {
  const { isLoading } = useLoading();

  if (!isLoading) return;
  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <img src="/loading.svg" alt="Loading!" />
        <h1>Loading...</h1>
      </div>
    </div>
  );
}