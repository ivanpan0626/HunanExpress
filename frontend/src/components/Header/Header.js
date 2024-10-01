import React from 'react'
import styles from './header.module.css'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.js'
import { useCart } from '../../hooks/useCart'

export default function Header(){
    const {cart} = useCart();

    return(
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to='/' className={styles.logo}>
                    Hunan Express!
                </Link>
                <Navbar cart={cart}></Navbar>
            </div>
        </header>
    )
}