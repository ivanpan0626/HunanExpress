import React from 'react'
import styles from './header.module.css'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.js'

export default function Header(){
    const user = {
        name: 'John'
    };

    const cart = {
        totalCount: 10,
    };

    return(
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to='/' className={styles.logo}>
                    Food Mine!
                </Link>
                <Navbar user={user} cart={cart}></Navbar>
            </div>
        </header>
    )
}