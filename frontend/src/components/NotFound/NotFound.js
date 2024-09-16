import React from 'react'
import styles from './notFound.module.css'
import { Link } from 'react-router-dom'

export default function NotFound({message, linkedRoute, linkedText}) {
  return (
    <div className={styles.container}>
        {message}
        <Link to={linkedRoute}>{linkedText}</Link>
    </div>
  )
}

NotFound.defaultProps = {
    message: 'Nothing Found!',
    linkedRoute: '/',
    linkText: 'Go to Home Page',
}
