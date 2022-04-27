/* eslint-disable no-unused-vars */
/**
=========================================================
* Material Dashboard 2 PRO React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router components
import { useLocation, useNavigate, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
// import MDInput from "components/MDInput";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 PRO React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 PRO React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { pullAnnouncements } from "utils/koapi";

function DashboardNavbar({ absolute, light, isMini }) {
  const { instance, accounts } = useMsal();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openNotificationsMenu, setOpenNotificationsMenu] = useState(false);
  const [openAccountMenu, setOpenAccountMenu] = useState(false);
  const [isPendingAnnouncements, setisPendingAnnouncements] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    pullAnnouncements(accounts[0].username).then((notificationData) => {
      console.log(notificationData);
      if (notificationData && notificationData.announcements) {
        setisPendingAnnouncements(!notificationData.isViewed);
      }
    });
  }, []);
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenAccoountMenu = (event) => setOpenAccountMenu(event.currentTarget);
  const handleCloseAccountMenu = () => setOpenAccountMenu(false);

  const handleOpenNotificationsMenu = (event) => setOpenNotificationsMenu(event.currentTarget);
  const handleCloseNotificationsMenu = () => setOpenNotificationsMenu(false);
  // Render the notifications menu
  const renderNotificationMenu = () => (
    <Menu
      anchorEl={openNotificationsMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openNotificationsMenu)}
      onClose={handleCloseNotificationsMenu}
      sx={{ mt: 2 }}
    >
      <Link to="/announcements">
        {isPendingAnnouncements ? (
          <MDBadge badgeContent="*" color="error" size="xs" circular>
            <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
          </MDBadge>
        ) : (
          <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
        )}
      </Link>
      <Link to="https://kppetro.freshservice.com/support/home">
        <NotificationItem icon={<Icon>podcasts</Icon>} title="Get Help from IT" />
      </Link>
      <Link to="/announcements">
        <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Dispatch Status" />
      </Link>
    </Menu>
  );
  const renderAccountMenu = () => (
    <Menu
      anchorEl={openAccountMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openAccountMenu)}
      onClose={handleCloseAccountMenu}
      sx={{ mt: 2 }}
    >
      {isPendingAnnouncements ? (
        <Link to="/announcements">
          <NotificationItem
            icon={
              <MDBadge badgeContent="*" color="error" size="xs" circular>
                <Icon>email</Icon>
              </MDBadge>
            }
            title="Check new messages"
          />
        </Link>
      ) : (
        <Link to="/announcements">
          <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
        </Link>
      )}
      <a target="_blank" href="https://kppetro.freshservice.com/support/home" rel="noreferrer">
        <NotificationItem icon={<Icon>podcasts</Icon>} title="Get Help from IT" />
      </a>
      <Link to="/dashboards/dispatch">
        <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Dispatch Status" />
      </Link>
      <NotificationItem
        onClick={() => {
          instance.logout({ postLogoutRedirectUri: "/signin" }).then(() => {});
        }}
        icon={<Icon>podcasts</Icon>}
        title="Log Out"
      />
    </Menu>
  );
  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
          <IconButton sx={navbarDesktopMenu} onClick={handleMiniSidenav} size="small" disableRipple>
            <Icon fontSize="medium" sx={iconsStyle}>
              {miniSidenav ? "menu_open" : "menu"}
            </Icon>
          </IconButton>
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="large">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </MDBox>
            <MDBox>
              <IconButton
                size="small"
                disableRipple
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenAccoountMenu}
              >
                {isPendingAnnouncements ? (
                  <MDBadge badgeContent="*" color="error" size="xs" circular>
                    <Icon sx={iconsStyle}>account_circle</Icon>
                  </MDBadge>
                ) : (
                  <Icon sx={iconsStyle}>account_circle</Icon>
                )}
              </IconButton>
              {renderAccountMenu()}
              {/* <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenNotificationsMenu}
              >
                <MDBadge badgeContent={9} color="error" size="xs" circular>
                  <Icon sx={iconsStyle}>notifications</Icon>
                </MDBadge>
              </IconButton>
              {renderNotificationMenu()} */}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
