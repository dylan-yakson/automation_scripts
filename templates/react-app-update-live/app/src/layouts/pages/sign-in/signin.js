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

import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// react-router-dom components
// import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
// import Grid from "@mui/material/Grid";
// import MuiLink from "@mui/material/Link";

// // @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
// import BasicLayout from "layouts/authentication/components/BasicLayout";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// Login Methods
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import BasicLayout from "layouts/authentication/components/BasicLayout";

import { loginRequest } from "../../../authConfig";

function Basic() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const { loggedUser, setloggedUser } = useState(null);
  const handleLogin = () => {
    // Handle Session + API Key Generation
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e);
    });
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboards/sales" />;
  }
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            {/* <MDBox mt={4} mb={1}> */}
            <MDButton onClick={() => handleLogin()} variant="gradient" color="info" fullWidth>
              sign in
            </MDButton>
            {/* </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
