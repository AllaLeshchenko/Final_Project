import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MenuItem.module.css';

const MenuItem = ({ item, isActive, onClick }) => {
  const isProfile = item.name === 'Profile'; // проверяем, это профиль или нет

  if (item.type === 'link') {
    return (
      <NavLink
        to={item.path}
        className={({ isActive: navIsActive }) =>
          isActive || navIsActive ? styles.linkActive : styles.link
        }
        onClick={onClick}
      >
        <img
          src={item.icon}
          alt={item.name}
          className={`${styles.icon} ${isProfile ? styles.profileIcon : ''} ${
            isProfile && (isActive ? styles.profileIconActive : '')
          }`}
        />
        {item.name}
      </NavLink>
    );
  }

  return (
    <button
      onClick={onClick}
      className={isActive ? styles.linkActive : styles.link}
    >
      <img
        src={item.icon}
        alt={item.name}
        className={`${styles.icon} ${isProfile ? styles.profileIcon : ''} ${
          isProfile && (isActive ? styles.profileIconActive : '')
        }`}
      />
      {item.name}
    </button>
  );
};

export default MenuItem;


// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import styles from './MenuItem.module.css';

// const MenuItem = ({ item, isActive, onClick }) => {
//   if (item.type === 'link') {
//     return (
//       <NavLink
//         to={item.path}
//         className={({ isActive: navIsActive }) =>
//           isActive || navIsActive ? styles.linkActive : styles.link
//         }
//         onClick={onClick}
//       >
//         <img src={item.icon} alt={item.name} className={styles.icon} />
//         {item.name}
//       </NavLink>
//     );
//   }

//   return (
//     <button
//       onClick={onClick}
//       className={isActive ? styles.linkActive : styles.link}
//     >
//       <img src={item.icon} alt={item.name} className={styles.icon} />
//       {item.name}
//     </button>
//   );
// };

// export default MenuItem;


