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

import { useMemo, useState, useEffect, Link } from "react";

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
import DefaultStatisticsCard from "layouts/pages/customers/view-customers/components/DefaultStatisticsCard";
import SelectedCustomerCard from "layouts/pages/customers/view-customers/components/SelectedCustomerCard";

import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
// import HorizontalBarChart from "examples/Charts/BarCharts/HorizontalBarChart";
import EventCalendar from "examples/Calendar";
// import calendarEventsData from "layouts/pages/widgets/data/calendarEventsData";

// import SalesTable from "examples/Tables/SalesTable";
import DataTable from "examples/Tables/DataTable";

// Sales dashboard components
import ChannelsChart from "layouts/pages/customers/view-customers/components/ChannelsChart";

// Data
import defaultLineChartData from "layouts/pages/customers/view-customers/data/defaultLineChartData";

import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import PieChart from "examples/Charts/PieChart";

// API & Data Functions
import {
  pullMonthlySalesAnalytics,
  pullWarehouseOrders,
  pullCustomerAddresses,
  pullWarehouseDispatchOrders,
} from "utils/koapi";
import generateAnalyticsDataFromOrders from "utils/analyticsapi";
import formatRevenueChartData from "layouts/pages/customers/view-customers/data/revenueChartData";
// import generateDataTableFromOrders from "layouts/pages/orders-warehouse/view-orders/data/fuelOrderDataTable";
import generateDataTableFromOrders from "layouts/pages/customers/view-customers/data/warehouseCustomerDataTable";
import formatCustomerRevenueData from "layouts/pages/customers/view-customers/data/customerRevenueData";
import formatCustomerBreakdownData from "layouts/pages/customers/view-customers/data/customerBreakdownChartData";
import formatTopProductsData from "layouts/pages/customers/view-customers/data/topProductsChartData";
import formatSelectedOrderProductData from "layouts/pages/customers/view-customers/data/selectedProductChartData";

import formatTopCustomersChartData from "layouts/pages/customers/view-customers/data/topCustomersChartData";
import formatCalendarEventData from "layouts/pages/customers/view-customers/data/calendarOrderData";
import Autocomplete from "@mui/material/Autocomplete";
import MDInput from "components/MDInput";
import EditOrder from "layouts/pages/orders-warehouse/edit-order";

import {
  getOrderQuantityDifferences,
  getRevenueDifferences,
  getCustomerCountDifferences,
} from "layouts/pages/customers/view-customers/data/differenceFormulations";

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
  const [CustomerList, setCustomerList] = useState(null);
  const [SelectedCustomerOrders, SetSelectedCustomerOrders] = useState(null);
  const [CustomerOrderTableData, setCustomerOrderTableData] = useState(null);
  const [CustomerSelected, setCustomerSelected] = useState(null);
  const [revenueDifferenceObj, setrevenueDifferenceObj] = useState(null);
  const [calendarEventData, setCalendarEventData] = useState(null);
  const [CalendarAlert, setCalendarAlert] = useState(null);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [OrderStatusAlert, setOrderStatusAlert] = useState(null);
  const [dispatchedOrders, setDispatchedOrders] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState(null);
  const [selectedOrderToEdit, setSelectedOrderToEdit] = useState(null);
  const [selectedOrderToReview, setSelectedOrderToReview] = useState(null);
  const [isEditingOrder, setisEditingOrder] = useState(null);
  const [isReviewingOrder, setisReviewingOrder] = useState(null);
  // DefaultStatisticsCard handler for the dropdown action
  const openSalesDropdown = ({ currentTarget }) => setSalesDropdown(currentTarget);
  const closeSalesDropdown = ({ currentTarget }) => {
    setSalesDropdown(null);
    setSalesDropdownValue(currentTarget.innerText || salesDropdownValue);
  };
  const openCustomersDropdown = ({ currentTarget }) => {
    setCustomersDropdown(currentTarget);
    setCustomerSelected(currentTarget);
    console.log(currentTarget);
  };
  const closeCustomersDropdown = ({ currentTarget }) => {
    setCustomersDropdown(null);
    setCustomersDropdownValue(currentTarget.innerText || salesDropdownValue);
  };
  const refreshButtonFunction = () => {
    console.log("REFRESH LOL");
  };

  const openRevenueDropdown = ({ currentTarget }) => setRevenueDropdown(currentTarget);
  const closeRevenueDropdown = ({ currentTarget }) => {
    setRevenueDropdown(null);
    setRevenueDropdownValue(currentTarget.innerText || salesDropdownValue);
  };
  const updateOrderFunction = (order) => {
    // eslint-disable-next-line no-alert
    console.log(`Updating order ${order.PO}`);
    console.log(order);
    // eslint-disable-next-line no-underscore-dangle
    setSelectedOrderToEdit(order);
    setisEditingOrder(true);
  };
  const reviewOrderFunction = (order) => {
    // eslint-disable-next-line no-alert
    console.log(`Editing order ${order.PO}`);
    console.log(order);
    setSelectedOrderToReview(order);
    setisReviewingOrder(true);
    setSelectedOrderForReview(order);
    setSelectedOrderProducts(formatSelectedOrderProductData(order.order.items.items));
    // const tmpTopProductsChartData = formatTopProductsData(customerSelected.products);
    // setSelectedOrderProducts(tmpTopProductsChartData);
  };
  const resendEmailOrderFunction = (order) => {
    // eslint-disable-next-line no-alert
    console.log(`Updating order ${order.PO}`);
    console.log(order);
    // eslint-disable-next-line no-underscore-dangle
    setisEditingOrder(true);
  };
  const handleSelectedCustomer = (customerSelect) => {
    const customerNameVal = customerSelect.target.value;
    const { username } = accounts[0];
    console.log("SELECTED CUSTOMER");
    console.log(customerNameVal);
    const customerSelected = CustomerList.filter((value) => value.Customer === customerNameVal)[0];
    console.log(customerSelected);
    setCustomerSelected(customerSelected);
    if (customerSelected) {
      SetSelectedCustomerOrders(customerSelected.orders);
      const revenueTableData = formatCustomerRevenueData(customerSelected.orders);
      setmonthlyRevenueChartData(revenueTableData);
      const tmpcustomerBreakdownChartData = formatCustomerBreakdownData(customerSelected.products);
      setCustomerBreakdownChartData(tmpcustomerBreakdownChartData);
      const tmpTopProductsChartData = formatTopProductsData(customerSelected.products);
      setTopProductsChartData(tmpTopProductsChartData);
      const tableData = generateDataTableFromOrders(
        customerSelected.orders,
        updateOrderFunction,
        reviewOrderFunction,
        resendEmailOrderFunction
      );
      setCustomerOrderTableData(tableData);
      const revenueDifferenceLabel = getRevenueDifferences(customerSelected.orders);
      setrevenueDifferenceObj(revenueDifferenceLabel);
      setSelectedOrderToReview(null);
      setSelectedOrderProducts(null);
    }
  };
  useEffect(() => {
    const { username } = accounts[0];
    console.log(username);
    console.log(accounts[0]);
    // pullCustomerAddresses(username).then((response) => {
    //   const customers = response;
    //   console.log(customers);
    //   setCustomerList(customers);
    // });
    pullMonthlySalesAnalytics(username).then((analyticsData) => {
      console.log(analyticsData);
      setAnalyticalData(analyticsData);
      // Configure Revenue Dataset
      const tmpDataset = [];
      console.log(analyticsData);
      setCustomerList(analyticsData.customerData);

      // // get Order Quantity Difference
      // const orderQuantityDifferenceLabel = getOrderQuantityDifferences(analyticsData);
      // setOrderQuantityDifferenceObj(orderQuantityDifferenceLabel);

      // const tmpCustomerCountDifferenceLabel = getCustomerCountDifferences(analyticsData);
      // setCustomerCountDifferenceObj(tmpCustomerCountDifferenceLabel);

      // const tmpTopCustomersChartData = formatTopCustomersChartData(analyticsData);
      // setTopCustomersChartData(tmpTopCustomersChartData);

      // const tmpCalendarEventData = formatCalendarEventData(analyticsData);
      // setCalendarEventData(tmpCalendarEventData);
    });
  }, []);
  // Dropdown menu template for the DefaultStatisticsCard
  const renderMenu = (state, close) => (
    <></>
    // <Menu
    //   anchorEl={state}
    //   transformOrigin={{ vertical: "top", horizontal: "center" }}
    //   open={Boolean(state)}
    //   onClose={close}
    //   keepMounted
    //   disableAutoFocusItem
    // >
    //   <MenuItem onClick={close}>Weekly</MenuItem>
    //   <MenuItem onClick={close}>Monthly</MenuItem>
    //   <MenuItem onClick={close}>Yearly</MenuItem>
    // </Menu>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <></>
              {/* {revenueDifferenceObj ? (
                <DefaultStatisticsCard
                  title="sales"
                  percentage={{
                    color: revenueDifferenceObj.color,
                    value: revenueDifferenceObj.label,
                    label: `since last month ($${revenueDifferenceObj.lastYearsRevenue})`,
                  }}
                  dropdown={{
                    action: openSalesDropdown,
                    menu: renderMenu(salesDropdown, closeSalesDropdown),
                    value: salesDropdownValue,
                  }}
                />
              ) : (
                <></>
              )} */}
            </Grid>
            <Grid item xs={12} sm={4}>
              {analyticalData && CustomerList ? (
                <SelectedCustomerCard
                  title="customer selected"
                  CustomerList={CustomerList}
                  dropdown={{
                    action: handleSelectedCustomer,
                    value: CustomerSelected ? CustomerSelected.Customer : "",
                  }}
                />
              ) : (
                <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
                  <CircularProgress center />
                </MDBox>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <></>
              {/* {OrderQuantityDifferenceObj ? (
                <DefaultStatisticsCard
                  title="order quantity"
                  count={analyticalData.monthlySummary.currentYear.totalOrders}
                  percentage={{
                    color: OrderQuantityDifferenceObj.color,
                    value: OrderQuantityDifferenceObj.label, // "+12",
                    label: `since last month (${analyticalData.monthlySummary.oneYearPrior.totalOrders})`,
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
              )} */}
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
                  <MDTypography variant="h6">Top 5 Products</MDTypography>
                  <Tooltip title="See your top 5 Customers" placement="bottom" arrow>
                    <MDButton variant="outlined" color="secondary" size="small" circular iconOnly>
                      <Icon>priority_high</Icon>
                    </MDButton>
                  </Tooltip>
                </MDBox>
                <MDBox mt={3}>
                  {CustomerBreakdownChartData ? (
                    <Grid container alignItems="center">
                      <Grid item lg={7} md={12} xs={12}>
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
                      <Grid item lg={5} md={12} xs={12}>
                        <MDBox pr={1}>
                          <PieChart chart={CustomerBreakdownChartData} height="13.5rem" />
                        </MDBox>
                      </Grid>
                    </Grid>
                  ) : (
                    <></>
                  )}
                </MDBox>
              </Card>{" "}
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
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {monthlyRevenueChartData ? (
                <DefaultLineChart
                  title="Sales by Month"
                  description={
                    <MDBox display="flex" justifyContent="space-between">
                      {/* <MDBox display="flex" ml={-1}>
                        <MDBadgeDot color="info" size="sm" badgeContent="Warehouse" />
                        <MDBadgeDot color="dark" size="sm" badgeContent="Fuel" />
                      </MDBox> */}
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
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4} sm={4}>
              <MDBox>
                <MDBox my={3}>
                  <Card>
                    {CustomerOrderTableData && selectedOrderForReview && selectedOrderProducts ? (
                      <>
                        <MDBox pt={3} px={3}>
                          <MDTypography variant="h6" fontWeight="medium">
                            Selected Order Products
                          </MDTypography>
                        </MDBox>
                        <MDBox py={1}>
                          <DataTable
                            table={selectedOrderProducts}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            isSorted={false}
                            noEndBorder
                          />
                        </MDBox>
                      </>
                    ) : (
                      <></>
                    )}
                  </Card>
                </MDBox>
              </MDBox>
            </Grid>
            {selectedOrderProducts ? (
              <Grid item xs={12} sm={8} lg={8}>
                <MDBox>
                  <MDBox my={3}>
                    <Card>
                      <MDBox pt={3} px={3} center>
                        <MDTypography variant="h5" fontWeight="medium">
                          Order Search
                        </MDTypography>
                      </MDBox>
                      {CustomerOrderTableData ? (
                        <DataTable
                          title="Order Search"
                          table={CustomerOrderTableData || []}
                          entriesPerPage={5}
                          canSearch
                        />
                      ) : (
                        <></>
                      )}
                    </Card>
                  </MDBox>
                </MDBox>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <MDBox>
                  <MDBox my={3}>
                    <Card>
                      <MDBox pt={3} px={3} center>
                        <MDTypography variant="h5" fontWeight="medium">
                          Order Search
                        </MDTypography>
                      </MDBox>
                      {CustomerOrderTableData ? (
                        <DataTable
                          title="Order Search"
                          table={CustomerOrderTableData || []}
                          entriesPerPage={5}
                          canSearch
                        />
                      ) : (
                        <></>
                      )}
                    </Card>
                  </MDBox>
                </MDBox>
              </Grid>
            )}
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          {/* <Grid item xs={12} lg={12}>
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
          </Grid> */}
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Sales;
