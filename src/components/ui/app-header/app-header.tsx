import React, { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname.startsWith('/feed');
  const isProfileActive = location.pathname.startsWith('/profile');

  const linkClass = (isActive: boolean) =>
    `${styles.link} ${isActive ? styles.link_active : ''}`;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to='/' className={({ isActive }) => linkClass(isActive)}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink to='/feed' className={({ isActive }) => linkClass(isActive)}>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) => linkClass(isActive)}
          >
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
