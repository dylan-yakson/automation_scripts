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
import ChannelsChart from "layouts/pages/dashboards/sales/components/ChannelsChart";

// Data
import defaultLineChartData from "layouts/pages/dashboards/sales/data/defaultLineChartData";
import dataTableData from "layouts/pages/dashboards/sales/data/dataTableData";

import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import PieChart from "examples/Charts/PieChart";

// API & Data Functions
import {
  pullMonthlySalesAnalytics,
  pullWarehouseOrders,
  pullFuelOrders,
  pullAllOrders,
} from "utils/koapi";
import generateAnalyticsDataFromOrders from "utils/analyticsapi";
import formatRevenueChartData from "layouts/pages/dashboards/sales/data/revenueChartData";
import formatCustomerBreakdownData from "layouts/pages/dashboards/sales/data/customerBreakdownChartData";
import formatTopProductsData from "layouts/pages/dashboards/sales/data/topProductsChartData";
import formatTopCustomersChartData from "layouts/pages/dashboards/sales/data/topCustomersChartData";
import formatCalendarEventData from "layouts/pages/dashboards/sales/data/calendarOrderData";
import {
  getOrderQuantityDifferences,
  getRevenueDifferences,
  getCustomerCountDifferences,
} from "layouts/pages/dashboards/sales/data/differenceFormulations";

function Sales() {
  const { instance, accounts } = useMsal();
  const { login, result, error } = useMsalAuthentication("redirect");

  // DefaultStatisticsCard state for the dropdown value
  const [salesDropdownValue, setSalesDropdownValue] = useState("Yearly");
  const [customersDropdownValue, setCustomersDropdownValue] = useState("Yearly");
  const [revenueDropdownValue, setRevenueDropdownValue] = useState("Yearly");

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
    // Not working for some reason
    const WarehouseOrders = pullAllOrders(username).then((warehouseOrders) => {
      setmonthlyRevenueChartData(formatRevenueChartData(warehouseOrders));

      const formattedOrderAnalyticsData = generateAnalyticsDataFromOrders(warehouseOrders);
      console.log(formattedOrderAnalyticsData);
      setAnalyticalData(formattedOrderAnalyticsData);
      const tmpcustomerBreakdownChartData = formatCustomerBreakdownData(
        formattedOrderAnalyticsData
      );
      setCustomerBreakdownChartData(tmpcustomerBreakdownChartData);

      const tmpTopProductsChartData = formatTopProductsData(formattedOrderAnalyticsData);
      setTopProductsChartData(tmpTopProductsChartData);

      // get Order Quantity Difference
      const orderQuantityDifferenceLabel = getOrderQuantityDifferences(formattedOrderAnalyticsData);
      setOrderQuantityDifferenceObj(orderQuantityDifferenceLabel);

      const revenueDifferenceLabel = getRevenueDifferences(formattedOrderAnalyticsData);
      setrevenueDifferenceObj(revenueDifferenceLabel);

      const tmpCustomerCountDifferenceLabel = getCustomerCountDifferences(
        formattedOrderAnalyticsData
      );
      setCustomerCountDifferenceObj(tmpCustomerCountDifferenceLabel);

      const tmpTopCustomersChartData = formatTopCustomersChartData(formattedOrderAnalyticsData);
      setTopCustomersChartData(tmpTopCustomersChartData);

      const tmpCalendarEventData = formatCalendarEventData(formattedOrderAnalyticsData);
      setCalendarEventData(tmpCalendarEventData);
    });

    // pullMonthlySalesAnalytics(username).then((analyticsData) => {
    //   console.log(analyticsData);
    //   setAnalyticalData(analyticsData);
    //   // Configure Revenue Dataset
    //   const tmpDataset = [];
    //   console.log(analyticsData);
    //   // const revenueTableData = formatRevenueChartData(analyticsData);
    //   // setmonthlyRevenueChartData(revenueTableData);

    //   const WarehouseOrders = pullWarehouseOrders(username).then((warehouseOrders) => {
    //     setmonthlyRevenueChartData(formatRevenueChartData(warehouseOrders));

    //     const formattedOrderAnalyticsData = generateAnalyticsDataFromOrders(warehouseOrders);
    //   });

    //   const tmpcustomerBreakdownChartData = formatCustomerBreakdownData(analyticsData);
    //   setCustomerBreakdownChartData(tmpcustomerBreakdownChartData);

    //   const tmpTopProductsChartData = formatTopProductsData(analyticsData);
    //   setTopProductsChartData(tmpTopProductsChartData);

    //   // get Order Quantity Difference
    //   const orderQuantityDifferenceLabel = getOrderQuantityDifferences(analyticsData);
    //   setOrderQuantityDifferenceObj(orderQuantityDifferenceLabel);

    //   const revenueDifferenceLabel = getRevenueDifferences(analyticsData);
    //   setrevenueDifferenceObj(revenueDifferenceLabel);

    //   const tmpCustomerCountDifferenceLabel = getCustomerCountDifferences(analyticsData);
    //   setCustomerCountDifferenceObj(tmpCustomerCountDifferenceLabel);

    //   const tmpTopCustomersChartData = formatTopCustomersChartData(analyticsData);
    //   setTopCustomersChartData(tmpTopCustomersChartData);

    //   const tmpCalendarEventData = formatCalendarEventData(analyticsData);
    //   setCalendarEventData(tmpCalendarEventData);
    // });
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
      <MenuItem onClick={close}>Weekly</MenuItem>
      <MenuItem onClick={close}>Monthly</MenuItem>
      <MenuItem onClick={close}>Yearly</MenuItem>
    </Menu>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              {revenueDifferenceObj ? (
                <DefaultStatisticsCard
                  title="sales"
                  count={`$${Number(revenueDifferenceObj.currentRevenue).toFixed(2)}`}
                  percentage={{
                    color: revenueDifferenceObj.color,
                    value: revenueDifferenceObj.label,
                    label: `since last year ($${revenueDifferenceObj.lastYearsRevenue})`,
                  }}
                  dropdown={{
                    action: openSalesDropdown,
                    menu: renderMenu(salesDropdown, closeSalesDropdown),
                    value: salesDropdownValue,
                  }}
                />
              ) : (
                <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
                  <CircularProgress center />
                </MDBox>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              {analyticalData && CustomerCountDifferenceObj ? (
                <DefaultStatisticsCard
                  title="customers"
                  count={`${CustomerCountDifferenceObj.currentData}`}
                  percentage={{
                    color: CustomerCountDifferenceObj.color,
                    value: CustomerCountDifferenceObj.label, // "+12",
                    label: `since last year (${CustomerCountDifferenceObj.priorData})`,
                  }}
                  dropdown={{
                    action: openCustomersDropdown,
                    menu: renderMenu(customersDropdown, closeCustomersDropdown),
                    value: customersDropdownValue,
                  }}
                />
              ) : (
                <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
                  <CircularProgress center />
                </MDBox>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              {OrderQuantityDifferenceObj ? (
                <DefaultStatisticsCard
                  title="order quantity"
                  count={analyticalData.monthlySummary.currentYear.totalOrders}
                  percentage={{
                    color: OrderQuantityDifferenceObj.color,
                    value: OrderQuantityDifferenceObj.label, // "+12",
                    label: `since last year (${analyticalData.monthlySummary.oneYearPrior.totalOrders})`,
                  }}
                  dropdown={{
                    action: openRevenueDropdown,
                    menu: renderMenu(revenueDropdown, closeRevenueDropdown),
                    value: revenueDropdownValue,
                  }}
                />
              ) : (
                <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
                  <CircularProgress center />
                </MDBox>
              )}
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={6}>
              <Card sx={{ height: "100%" }}>
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  pt={2}
                  px={2}
                >
                  <MDTypography variant="h6">Top 5 Customers</MDTypography>
                  <Tooltip title="See your top 5 Customers" placement="bottom" arrow>
                    <MDButton variant="outlined" color="secondary" size="small" circular iconOnly>
                      <Icon>priority_high</Icon>
                    </MDButton>
                  </Tooltip>
                </MDBox>
                <MDBox mt={3}>
                  {CustomerBreakdownChartData ? (
                    <Grid container alignItems="center">
                      <Grid item lg={5} md={12} xs={12}>
                        {CustomerBreakdownChartData.labels.map((label, index) => (
                          <MDBox mb={2}>
                            <MDBadgeDot
                              color={CustomerBreakdownChartData.datasets.backgroundColors[index]}
                              size="md"
                              badgeContent={label}
                              variant="gradient"
                            />
                          </MDBox>
                        ))}
                      </Grid>
                      <Grid item lg={7} md={12} xs={12}>
                        <MDBox pr={1}>
                          <PieChart chart={CustomerBreakdownChartData} height="13.5rem" />
                        </MDBox>
                      </Grid>
                    </Grid>
                  ) : (
                    <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
                      <CircularProgress center />
                    </MDBox>
                  )}
                </MDBox>
              </Card>{" "}
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              {monthlyRevenueChartData ? (
                <DefaultLineChart
                  title="Revenue"
                  description={
                    <MDBox display="flex" justifyContent="space-between">
                      <MDBox display="flex" ml={-1}>
                        <MDBadgeDot color="info" size="sm" badgeContent="Warehouse" />
                        <MDBadgeDot color="dark" size="sm" badgeContent="Fuel" />
                      </MDBox>
                      <MDBox mt={-4} mr={-1} position="absolute" right="1.5rem">
                        <Tooltip
                          title="See amount sold for the past 12 months"
                          placement="left"
                          arrow
                        >
                          <MDButton
                            variant="outlined"
                            color="secondary"
                            size="small"
                            circular
                            iconOnly
                          >
                            <Icon>priority_high</Icon>
                          </MDButton>
                        </Tooltip>
                      </MDBox>
                    </MDBox>
                  }
                  chart={monthlyRevenueChartData}
                />
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card>
                <MDBox pt={3} px={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Top Customers
                  </MDTypography>
                </MDBox>
                {analyticalData && TopCustomersChartData ? (
                  <MDBox py={1}>
                    <DataTable
                      table={TopCustomersChartData}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      isSorted={false}
                      noEndBorder
                    />
                  </MDBox>
                ) : (
                  <></>
                )}
              </Card>
            </Grid>
            {/* <Grid item xs={12} lg={6}>
              <HorizontalBarChart title="Sales by age" chart={horizontalBarChartData} />
            </Grid> */}
            <Grid item xs={12} lg={6}>
              <Card>
                <MDBox pt={3} px={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Top Selling Products
                  </MDTypography>
                </MDBox>
                {analyticalData && TopProductsChartData ? (
                  <MDBox py={1}>
                    <DataTable
                      table={TopProductsChartData}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      isSorted={false}
                      noEndBorder
                    />
                  </MDBox>
                ) : (
                  <></>
                )}
              </Card>
            </Grid>
            <Grid item xs={12} lg={12}>
              {CalendarAlert}
              {useMemo(
                () =>
                  calendarEventData ? (
                    <EventCalendar
                      header={{ title: "Order Deliveries" }}
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
                    <></>
                  ),
                [calendarEventData]
              )}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Sales;
