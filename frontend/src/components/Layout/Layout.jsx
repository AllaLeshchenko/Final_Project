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


// import React, { useState } from "react";
// import SideBar from "../SideBar/SideBar";
// import Footer from "../Footer/Footer";
// import styles from "./Layout.module.css";

// const Layout = ({ children }) => {
//   const [activePanel, setActivePanel] = useState(null);

//   const openPanel = (panelName) => setActivePanel(panelName);
//   const closePanel = () => setActivePanel(null);

//   return (
//     <div className={styles.container}>
//       <SideBar onPanelOpen={openPanel} />

//       <div className={styles.mainContent}>
//         {children}
//       </div>

//       <Footer />

//       {/* Панель и Overlay */}
//       {activePanel && (
//         <>
//           <div className={styles.overlay} onClick={closePanel}></div>
//           <div className={styles.panel}>
//             <h2>{activePanel}</h2>
//             <p>Здесь будет контент {activePanel.toLowerCase()}...</p>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Layout;





