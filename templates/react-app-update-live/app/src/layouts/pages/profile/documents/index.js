/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/iframe-has-title */
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

// @mui material components
import { useMemo, useState, useEffect, Link } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

function Overview() {
  useEffect(() => {
    window.open("https://kppetro.sharepoint.com/sites/KPSales/Shared Documents", "_blank");
  }, []);
  // eslint-disable-next-line no-unreachable
  return <Navigate to="/" />;
}

export default Overview;
