import React from "react";
import styles from "./Layout.module.css";
import SideBar from "../SideBar/SideBar";
import Footer from "../Footer/Footer";

const Layout = ({ children, onPanelOpen }) => {
  return (
    <div className={styles.layout}>
      <SideBar onPanelOpen={onPanelOpen} />
      <div className={styles.main}>
        <main className={styles.content}>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;


