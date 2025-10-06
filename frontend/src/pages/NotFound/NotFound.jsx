import React from 'react';
import styles from './NotFound.module.css';
import Phones from '../../assets/phone.png';
import Layout from "../../components/Layout/Layout";

const NotFound = () => {
  return (
    <Layout>
    <div className={styles.wrapper}>
      <img src={Phones} alt="Phones" />
      <div className={styles.info}>
        <h2 className={styles.header}>Oops! Page Not Found (404 Error)</h2>
        <p className={styles.par}>
          We're sorry, but the page you're looking for doesn't seem to exist. <br /> 
          If you typed the URL manually, please double-check the spelling. <br /> 
          If you clicked on a link, it may be outdated or broken.
        </p>
      </div>
    </div>
    </Layout>
  );
};

export default NotFound;