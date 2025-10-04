import React from 'react';
import styles from './Layout.module.css'
import SideBar from '../SideBar/SideBar';
import Footer from '../Footer/Footer';


const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.content}>
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;