import React from 'react';
import './index.scss';

interface Props {
  children: JSX.Element;
}

export default function HeaderContainer(props: Props): React.ReactElement {
  const isUserLoggedIn = localStorage.getItem('role') ? true : false;
  
  return (
    <header>
      <div className={`header ${isUserLoggedIn ? 'last_child' : ''}`}>
        <img src='/logo.svg' className='header__logo' alt="" />
        {
          isUserLoggedIn
            ? <div className='logout'
              onClick={(): void => {
                localStorage.clear();
                window.location.href = '/';
              }}>
              Logout
            </div>
            : ''
        }
      </div>
      {props.children}
    </header>
  );
}