import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Search from "../../components/Search/Search";
import Notification from "../../components/Notification/Notification";
import Feed from "../../components/Feed/Feed"; // ✅ добавляем
import styles from "./MainPage.module.css";

function MainPage() {
  const [activePanel, setActivePanel] = useState(null);

  const openPanel = (panelName) => setActivePanel(panelName);
  const closePanel = () => setActivePanel(null);

  return (
    <Layout onPanelOpen={openPanel}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Feed /> 
        </div>

        {/* Overlay для затемнения контента */}
        {activePanel && (
          <div className={styles.overlay} onClick={closePanel}></div>
        )}

        {/* Панели Search / Notifications */}
        {activePanel === "Search" && (
          <div className={styles.panel}>
            <Search />
          </div>
        )}
        {activePanel === "Notifications" && (
          <div className={styles.panel}>
            <Notification />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MainPage;












