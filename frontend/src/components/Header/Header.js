import React from 'react'
import styles from './header.module.css'
import { Link } from 'react-router-dom'

export default function Header(){
    const user = {
        name: 'John'
    };

    const cart = {
        totalCount: 10,
    };

    const logout = () => {}

    return(
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to='/' className={styles.logo}>
                    Food Mine!
                </Link>
                <nav>
                    <ul>
                        {
                            user?
                            <li className={styles.menu_container}>
                                <Link to='/profile'>
                                    {user.name}
                                </Link>
                                <div className={styles.menu}>
                                    <Link to='/profile'>
                                        Profile
                                    </Link>
                                    <Link to='/orders'>
                                        Orders
                                    </Link>
                                    <a onClick={logout}>
                                        Logout
                                    </a>
                                </div>
                            </li>
                            :
                            <Link to='/login'>
                                Login
                            </Link>
                        }

                        <li>
                            <Link to='/cart'>
                                Cart
                                {cart.totalCount > 0 && <span className={styles.cart_count}>{cart.totalCount}</span>}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}