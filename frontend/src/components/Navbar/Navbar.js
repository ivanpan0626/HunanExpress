import React from 'react'
import styles from './navbar.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth';

export default function Navbar({cart}){
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return(
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
                                    <a onClick={handleLogout}>
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
    )
}