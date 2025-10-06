import React from 'react'
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.links}>
        <Link className={styles.link} to='/'>Home</Link>
        <Link className={styles.link} to='/search'>Search</Link>
        <Link className={styles.link} to='/explore'>Explore</Link>
        <Link className={styles.link} to='/message'>Messages</Link>
        <Link className={styles.link} to='/notification'>Notifications</Link>
        <Link className={styles.link} to='/create'>Create</Link>
      </div>
      <div className={styles.dateApp}>
        <p>2025 ICHGRAM</p>
      </div>
    </div>
  )
}

export default Footer