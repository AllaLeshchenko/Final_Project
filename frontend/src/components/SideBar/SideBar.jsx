import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; // ✅ добавили импорт
import styles from './SideBar.module.css';
import Logo from '../../assets/ichgra-5.png';
import Home from '../../assets/Home.png';
import Search from '../../assets/Search.png';
import Explore from '../../assets/Explor.png';
import Messages from '../../assets/Messenger.png';
import Notifications from '../../assets/Notification.png';
import Create from '../../assets/Create.png';
import Profile from '../../assets/Profile.png'; 
import MenuItem from '../../ui/MenuItem/MenuItem.jsx';

const SideBar = ({ activeLink: initialActiveLink, onPanelOpen }) => {
  const location = useLocation();
  const [activePanel, setActivePanel] = useState(null);
  const [activeLink, setActiveLink] = useState(initialActiveLink || null);

  // ✅ Берем текущего пользователя из Redux (authSlice)
  const { user: authUser } = useSelector((state) => state.auth);
  const userId = authUser?._id; // добавляем переменную userId

  const menuItems = [
    { name: 'Home', type: 'link', path: '/', icon: Home },
    { name: 'Search', type: 'panel', icon: Search },
    { name: 'Explore', type: 'link', path: '/explore', icon: Explore },
    { name: 'Message', type: 'link', path: `/chat/${userId}`, icon: Messages },
    { name: 'Notifications', type: 'panel', icon: Notifications },
    { name: 'Create', type: 'link', path: '/addPost', icon: Create },
    { 
      name: 'Profile', 
      type: 'link', 
      // ✅ Если пользователь авторизован — путь на его профиль
      // иначе можно направить, например, на /login
      path: userId ? `/profile/${userId}` : '/login', 
      icon: Profile 
    },
  ];

  const handleClick = (item) => {
    if (item.type === 'panel') {
      setActivePanel(item.name);
      setActiveLink(null);
      if (onPanelOpen) onPanelOpen(item.name);
    } else {
      setActivePanel(null);
      setActiveLink(item.name);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <img src={Logo} alt="logo" className={styles.logo} />
      <nav>
        <ul>
          {menuItems.map((item) => {
            const isActiveLink =
              item.type === 'link' &&
              (activeLink === item.name || location.pathname === item.path);
            const isActivePanel = item.type === 'panel' && activePanel === item.name;

            return (
              <li
                key={item.name}
                style={{
                  marginBottom:
                    item.name === 'Profile' ? '60px' : '30px',
                }}
              >
                <MenuItem
                  item={item}
                  isActive={isActiveLink || isActivePanel}
                  onClick={() => handleClick(item)}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;

