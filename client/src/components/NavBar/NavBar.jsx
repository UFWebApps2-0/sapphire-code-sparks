import React from 'react';
import './NavBar.less';
import config from './NavBarConfig.json';
import Logo from '../../assets/casmm_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { removeUserSession } from '../../Utils/AuthRequests';
import { useGlobalState } from '../../Utils/userState';

export default function NavBar() {
  //Gets current user
  const [value] = useGlobalState('currUser');

  let currentRoute = window.location.pathname;
  let navigate = useNavigate();
  const routes = {
    ...config.routes,
    SignOut: "/"
  };

  const handleLogout = () => {
    removeUserSession();
    navigate('/');
  };

   //Changes webpage
  const handleRouteChange = (route) => {
    navigate(route);
  };

  //Checks which buttons to show depending on user type
  const shouldShowRoute = (route) => {
    if (currentRoute === routes[route]) return false;
    return config.users[value.role].includes(route);
  };

  //Generates buttons by instantiating them and using info from NavBarConfig.json
  const genButtons = () => {
    const buttons = config.navButtons.map((button) => {
      if (shouldShowRoute(button.route)) {
        console.log("test");
        return(
          <button className="button-30" key={button.route} onClick={() => handleRouteChange(routes[button.route])}>
            {button.icon && <i className={`fa ${button.icon}`} />}
            &nbsp; {button.label}
          </button>
        );
      }
      console.log(button.route);
      return null;
    });
    return buttons.filter(Boolean);
  };

  return (
    <span id='navBar'>
      <Link
        id='link'
        to={
          value.role === 'ContentCreator'
            ? '/ccdashboard'
            : value.role === 'Mentor'
            ? '/dashboard'
            : value.role === 'Student'
            ? '/student'
            : value.role === 'Researcher'
            ? '/report'
            : '/'
        }
      >
        <img src={Logo} id='casmm-logo' alt='logo' />
      </Link>
      <div id='line-menu'>
        {genButtons()}
      </div>
    </span>
  );
}
