/* eslint-disable guard-for-in */
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

import { useMemo, useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDBadgeDot from "components/MDBadgeDot";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";

// Material Dashboard 2 PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultStatisticsCard from "examples/Cards/StatisticsCards/DefaultStatisticsCard";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
// import HorizontalBarChart from "examples/Charts/BarCharts/HorizontalBarChart";
import EventCalendar from "examples/Calendar";
// import calendarEventsData from "layouts/pages/widgets/data/calendarEventsData";

// import SalesTable from "examples/Tables/SalesTable";
import DataTable from "examples/Tables/DataTable";

// Sales dashboard components
import ChannelsChart from "layouts/pages/dashboards/dispatch/components/ChannelsChart";

// Data
import defaultLineChartData from "layouts/pages/dashboards/dispatch/data/defaultLineChartData";
// import horizontalBarChartData from "layouts/pages/dashboards/dispatch/data/horizontalBarChartData";
// import salesTableData from "layouts/pages/dashboards/dispatch/data/salesTableData";
import dataTableData from "layouts/pages/dashboards/dispatch/data/dataTableData";
import { pullMonthlySalesAnalytics } from "utils/koapi";
import formatRevenueChartData from "layouts/pages/dashboards/dispatch/data/revenueChartData";
import formatCustomerBreakdownData from "layouts/pages/dashboards/dispatch/data/customerBreakdownChartData";
import formatTopProductsData from "layouts/pages/dashboards/dispatch/data/topProductsChartData";
import formatTopCustomersChartData from "layouts/pages/dashboards/dispatch/data/topCustomersChartData";
import formatCalendarEventData from "layouts/pages/dashboards/dispatch/data/calendarOrderData";
import NextEvents from "layouts/pages/dashboards/dispatch/components/NextEvents";

import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import PieChart from "examples/Charts/PieChart";

import {
  getOrderQuantityDifferences,
  getRevenueDifferences,
  getCustomerCountDifferences,
} from "layouts/pages/dashboards/dispatch/data/differenceFormulations";

function Sales() {
  const { instance, accounts } = useMsal();
  const { login, result, error } = useMsalAuthentication("redirect");

  // DefaultStatisticsCard state for the dropdown value
  const [salesDropdownValue, setSalesDropdownValue] = useState("6 May - 7 May");
  const [customersDropdownValue, setCustomersDropdownValue] = useState("6 May - 7 May");
  const [revenueDropdownValue, setRevenueDropdownValue] = useState("6 May - 7 May");

  // DefaultStatisticsCard state for the dropdown action
  const [salesDropdown, setSalesDropdown] = useState(null);
  const [customersDropdown, setCustomersDropdown] = useState(null);
  const [revenueDropdown, setRevenueDropdown] = useState(null);
  const [analyticalData, setAnalyticalData] = useState(null);
  const [monthlyRevenueChartData, setmonthlyRevenueChartData] = useState(null);
  const [CustomerBreakdownChartData, setCustomerBreakdownChartData] = useState(null);
  const [TopProductsChartData, setTopProductsChartData] = useState(null);
  const [TopCustomersChartData, setTopCustomersChartData] = useState(null);
  const [OrderQuantityDifferenceObj, setOrderQuantityDifferenceObj] = useState(null);
  const [CustomerCountDifferenceObj, setCustomerCountDifferenceObj] = useState(null);
  const [revenueDifferenceObj, setrevenueDifferenceObj] = useState(null);
  const [calendarEventData, setCalendarEventData] = useState(null);
  const [CalendarAlert, setCalendarAlert] = useState(null);

  // DefaultStatisticsCard handler for the dropdown action
  const openSalesDropdown = ({ currentTarget }) => setSalesDropdown(currentTarget);
  const closeSalesDropdown = ({ currentTarget }) => {
    setSalesDropdown(null);
    setSalesDropdownValue(currentTarget.innerText || salesDropdownValue);
  };
  const openCustomersDropdown = ({ currentTarget }) => setCustomersDropdown(currentTarget);
  const closeCustomersDropdown = ({ currentTarget }) => {
    setCustomersDropdown(null);
    setCustomersDropdownValue(currentTarget.innerText || salesDropdownValue);
  };
  const openRevenueDropdown = ({ currentTarget }) => setRevenueDropdown(currentTarget);
  const closeRevenueDropdown = ({ currentTarget }) => {
    setRevenueDropdown(null);
    setRevenueDropdownValue(currentTarget.innerText || salesDropdownValue);
  };
  useEffect(() => {
    const { username } = accounts[0];
    console.log(username);
    console.log(accounts[0]);
    pullMonthlySalesAnalytics(username).then((analyticsData) => {
      console.log(analyticsData);
      setAnalyticalData(analyticsData);

      // Configure Revenue Dataset
      const tmpDataset = [];
      console.log(analyticsData);
      const revenueTableData = formatRevenueChartData(analyticsData);
      setmonthlyRevenueChartData(revenueTableData);

      const tmpcustomerBreakdownChartData = formatCustomerBreakdownData(analyticsData);
      setCustomerBreakdownChartData(tmpcustomerBreakdownChartData);

      const tmpTopProductsChartData = formatTopProductsData(analyticsData);
      setTopProductsChartData(tmpTopProductsChartData);

      // get Order Quantity Difference
      const orderQuantityDifferenceLabel = getOrderQuantityDifferences(analyticsData);
      setOrderQuantityDifferenceObj(orderQuantityDifferenceLabel);

      const revenueDifferenceLabel = getRevenueDifferences(analyticsData);
      setrevenueDifferenceObj(revenueDifferenceLabel);

      const tmpCustomerCountDifferenceLabel = getCustomerCountDifferences(analyticsData);
      setCustomerCountDifferenceObj(tmpCustomerCountDifferenceLabel);

      const tmpTopCustomersChartData = formatTopCustomersChartData(analyticsData);
      setTopCustomersChartData(tmpTopCustomersChartData);

      const tmpCalendarEventData = formatCalendarEventData(analyticsData);
      setCalendarEventData(tmpCalendarEventData);
    });
  }, []);
  // Dropdown menu template for the DefaultStatisticsCard
  const renderMenu = (state, close) => (
    <Menu
      anchorEl={state}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={Boolean(state)}
      onClose={close}
      keepMounted
      disableAutoFocusItem
    >
      <MenuItem onClick={close}>Last 7 days</MenuItem>
      <MenuItem onClick={close}>Last week</MenuItem>
      <MenuItem onClick={close}>Last 30 days</MenuItem>
    </Menu>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} xl={9}>
              {CalendarAlert}
              {useMemo(
                () =>
                  calendarEventData ? (
                    <EventCalendar
                      header={{ title: "Order Deliveries Scheduled" }}
                      initialView="dayGridMonth"
                      initialDate={new Date(Date.now())}
                      events={calendarEventData}
                      selectable
                      editable
                      eventClick={(info) => {
                        console.log(info.event);
                        const eventTitle = info.event.title;
                        const eventStartDate = info.event.start;
                        setCalendarAlert(
                          <MDAlert color="dark">
                            Delivery for {eventTitle} @ {new Date(eventStartDate).toDateString()}
                            <MDAlertCloseIcon
                              onClick={() => {
                                setCalendarAlert(null);
                              }}
                            >
                              &times;
                            </MDAlertCloseIcon>
                          </MDAlert>
                        );
                        // eslint-disable-next-line no-alert
                      }}
                    />
                  ) : (
                    <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
                      <CircularProgress center />
                    </MDBox>
                  ),
                [calendarEventData]
              )}
            </Grid>
            <Grid item xs={12} xl={3}>
              <MDBox mb={3}>
                {calendarEventData ? (
                  <NextEvents orders={calendarEventData} onClickFunction={setCalendarAlert} />
                ) : (
                  <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
                    <CircularProgress center />
                  </MDBox>
                )}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Sales;
