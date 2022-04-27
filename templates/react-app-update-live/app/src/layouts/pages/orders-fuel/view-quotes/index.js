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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";

// Material Dashboard 2 PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { Link } from "react-router-dom";
// Data
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import generateDataTableFromOrders from "layouts/pages/orders-fuel/view-quotes/data/fuelOrderDataTable";
import EditOrder from "layouts/pages/orders-fuel/edit-order";
import Invoice from "layouts/pages/orders-fuel/invoice";

import {
  pullCustomerAddresses,
  pullWarehouseQuotes,
  pullPreviousPrices,
  pullProductPackages,
  pullProducts,
  pullOrderStatus,
  pullFuelQuotes,
  updateQuote,
  sendQuoteConfirmationEmail,
} from "utils/koapi";

function OrderList() {
  const { instance, accounts } = useMsal();
  const [menu, setMenu] = useState(null);
  const { login, result, error } = useMsalAuthentication("redirect");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [OrderStatusAlert, setOrderStatusAlert] = useState(null);
  const [dispatchedOrders, setDispatchedOrders] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState(null);
  const [selectedOrderToEdit, setSelectedOrderToEdit] = useState(null);
  const [selectedOrderToReview, setSelectedOrderToReview] = useState(null);
  const [isEditingOrder, setisEditingOrder] = useState(null);
  const [isReviewingOrder, setisReviewingOrder] = useState(null);
  const [isActiveResendEmailAlert, setResendEmailAlert] = useState(null);
  const [emailToSendTo, setEmailToResendSendTo] = useState(null);
  const [orderToEmail, setorderToEmail] = useState(null);
  // const { instance, accounts } = useMsal();
  const [IsConvertQuoteToOrder, setIsConvertQuoteToOrder] = useState(null);
  const [selectedQuoteToSubmit, setselectedQuoteToSubmit] = useState(null);

  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);
  const submitQuoteToOrder = (order) => {
    const selectedQuote = selectedQuoteToSubmit;
    setIsLoading(true);
    console.log(`Converting Quote to Order ${selectedQuote.PO}`);
    console.log(selectedQuote);
    selectedQuote.requestPayload.sales.quoteType = "Order";
    updateQuote(selectedQuote.requestPayload, "fuel", selectedQuote.PO).then(
      (orderSubmisionResponse) => {
        console.log(orderSubmisionResponse);
        if (orderSubmisionResponse.Error && orderSubmisionResponse.Error === "True") {
          if (orderSubmisionResponse.Message) {
            setIsLoading(false);
            setOrderStatusAlert(
              <MDAlert color="error">
                We had an issue...
                {orderSubmisionResponse.Message}
                <MDAlertCloseIcon
                  onClick={() => {
                    setOrderStatusAlert(null);
                    setIsConvertQuoteToOrder(false);
                  }}
                >
                  &times;
                </MDAlertCloseIcon>
              </MDAlert>
            );
          } else {
            setIsLoading(false);
            setOrderStatusAlert(
              <MDAlert color="error">
                Not sure what went wrong there.. Please try again in a few or contact IT if you
                still have issues.
                <MDAlertCloseIcon
                  onClick={() => {
                    setOrderStatusAlert(null);
                    setIsConvertQuoteToOrder(false);
                  }}
                >
                  &times;
                </MDAlertCloseIcon>
              </MDAlert>
            );
          }
        } else {
          setIsLoading(false);
          try {
            setOrderStatusAlert(
              <MDAlert color="success">
                Order {orderSubmisionResponse.PO} Edited Successfully
                <MDAlertCloseIcon
                  onClick={() => {
                    setOrderStatusAlert(null);
                    setIsConvertQuoteToOrder(false);
                  }}
                >
                  &times;
                </MDAlertCloseIcon>
              </MDAlert>
            );
          } catch (Error) {
            console.log("Error changing status");
            console.log(Error);
          }
          setIsConvertQuoteToOrder(false);
        }
      }
    );
  };
  const convertQuoteToOrder = (order) => {
    // eslint-disable-next-line no-alert
    console.log(`Updating order ${order.PO}`);
    console.log(order);
    // eslint-disable-next-line no-underscore-dangle
    setselectedQuoteToSubmit(order);
    setIsConvertQuoteToOrder(true);
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
  };
  const submitOrderEmailResend = () => {
    setIsLoading(true);
    console.log(orderToEmail);
    console.log(emailToSendTo);
    sendQuoteConfirmationEmail(accounts[0].username, emailToSendTo, "fuel", orderToEmail.PO).then(
      () => {
        setOrderStatusAlert(
          <MDAlert color="success">
            Order {orderToEmail.PO} Emailed to {emailToSendTo} succesfully.
            <MDAlertCloseIcon
              onClick={() => {
                setOrderStatusAlert(null);
              }}
            >
              &times;
            </MDAlertCloseIcon>
          </MDAlert>
        );
        setIsLoading(false);
        setResendEmailAlert(false);
      }
    );
  };
  const resendEmailOrderFunction = (order) => {
    // eslint-disable-next-line no-alert
    setResendEmailAlert(true);
    setorderToEmail(order);
    setSelectedOrderToReview(order);
    console.log(`Updating order ${order.PO}`);
    console.log(order);
    console.log(emailToSendTo);
    // eslint-disable-next-line no-underscore-dangle
  };

  const refreshButtonFunction = () => {
    setIsLoading(true);
    const { username } = accounts[0];
    console.log(username);
    console.log(accounts[0]);
    pullFuelQuotes(username).then((response) => {
      const orders = response;
      try {
        const tableData = generateDataTableFromOrders(
          orders,
          updateOrderFunction,
          reviewOrderFunction,
          resendEmailOrderFunction,
          convertQuoteToOrder
        );
        setOrderData(tableData);
        setIsLoading(false);
        closeMenu();
        // pullOrderStatus(username).then((dispatchedOrdersStatus) => {
        //   console.log("Orders Statuses:");
        //   console.log(dispatchedOrdersStatus);
        //   setOrderStatuses(dispatchedOrdersStatus);
        //   console.log("Orders:");
        //   console.log(orders);
        //   console.log("dispatchOrders:");
        //   console.log(dispatchedOrdersStatus);
        //   const tableData = generateDataTableFromOrders(
        //     orders,
        //     updateOrderFunction,
        //     reviewOrderFunction,
        //     resendEmailOrderFunction,
        //     dispatchedOrdersStatus
        //   );
        //   setOrderData(tableData);
        // });
      } catch (DispatchedOrderError) {
        console.log("Orders:");
        console.log(orders);
        const tableData = generateDataTableFromOrders(
          orders,
          updateOrderFunction,
          reviewOrderFunction,
          resendEmailOrderFunction
        );
        setOrderData(tableData);
      }
    });
  };
  useEffect(() => {
    const { username } = accounts[0];
    console.log(username);
    console.log(accounts[0]);
    setIsLoading(true);
    pullFuelQuotes(username).then((response) => {
      const orders = response;
      try {
        const tableData = generateDataTableFromOrders(
          orders,
          updateOrderFunction,
          reviewOrderFunction,
          resendEmailOrderFunction,
          convertQuoteToOrder
        );
        setOrderData(tableData);
        setIsLoading(false);

        // pullOrderStatus(username).then((dispatchedOrdersStatus) => {
        //   console.log("Orders Statuses:");
        //   console.log(dispatchedOrdersStatus);
        //   setOrderStatuses(dispatchedOrdersStatus);
        //   console.log("Orders:");
        //   console.log(orders);
        //   console.log("dispatchOrders:");
        //   console.log(dispatchedOrdersStatus);
        //   const tableData = generateDataTableFromOrders(
        //     orders,
        //     updateOrderFunction,
        //     reviewOrderFunction,
        //     resendEmailOrderFunction,
        //     dispatchedOrdersStatus
        //   );
        //   setOrderData(tableData);
        // });
      } catch (DispatchedOrderError) {
        console.log("Orders:");
        console.log(orders);
        const tableData = generateDataTableFromOrders(
          orders,
          updateOrderFunction,
          reviewOrderFunction,
          resendEmailOrderFunction,
          convertQuoteToOrder
        );
        setOrderData(tableData);
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
          <CircularProgress center />
        </MDBox>
      </DashboardLayout>
    );
  }
  if (isReviewingOrder) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox>
          <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
            <MDBox>
              <MDButton
                variant="outlined"
                color="dark"
                onClick={() => {
                  setisReviewingOrder(false);
                }}
              >
                <Link to="/orders/order-list-warehouse">Back</Link>
              </MDButton>
              <MDButton
                variant="outlined"
                color="dark"
                onClick={() => {
                  setisReviewingOrder(false);
                  updateOrderFunction(selectedOrderToReview);
                }}
              >
                Edit Order
              </MDButton>
              <MDButton
                variant="outlined"
                color="dark"
                onClick={() => {
                  setisReviewingOrder(false);
                  setResendEmailAlert(true);
                  setorderToEmail(selectedOrderToReview);
                }}
              >
                Email Order
              </MDButton>
            </MDBox>
          </MDBox>
          <Invoice
            OrderData={selectedOrderToReview.requestPayload}
            po={selectedOrderToReview.PO}
            orderDate={selectedOrderToReview.createdDate}
          />
        </MDBox>
      </DashboardLayout>
    );
  }
  if (isActiveResendEmailAlert) {
    return (
      <DashboardLayout>
        <MDButton
          variant="outlined"
          color="dark"
          onClick={() => {
            setisReviewingOrder(false);
            setResendEmailAlert(false);
          }}
        >
          <Link to="/orders/order-list-warehouse">Back</Link>
        </MDButton>
        <DashboardNavbar />
        <MDBox>
          <Grid
            container
            spacing={3}
            align="center"
            justify="center"
            alignItems="center"
            margin="30px"
          >
            <Grid item xs={12}>
              <MDInput
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                onChange={(e) => {
                  console.log(e);
                  setEmailToResendSendTo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <MDButton center color="success" variant="contained" onClick={submitOrderEmailResend}>
                Submit
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Invoice
            OrderData={selectedOrderToReview.requestPayload}
            po={selectedOrderToReview.PO}
            orderDate={selectedOrderToReview.createdDate}
          />
        </MDBox>
      </DashboardLayout>
    );
  }
  if (IsConvertQuoteToOrder) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox>
          <Grid
            container
            spacing={3}
            align="center"
            justify="center"
            justifyContent="center"
            alignItems="center"
            margin="30px"
          >
            <Grid item xs={12}>
              Are you sure you want to convert this quote to an order?
            </Grid>
            <Grid item xs={12}>
              <MDButton
                variant="outlined"
                color="dark"
                onClick={() => {
                  setisReviewingOrder(false);
                  setselectedQuoteToSubmit(false);
                  setResendEmailAlert(false);
                  setselectedQuoteToSubmit(null);
                }}
              >
                <Link to="/orders/order-list-warehouse">Back</Link>
              </MDButton>
            </Grid>
            <Grid item xs={12}>
              <MDButton center color="success" variant="contained" onClick={submitQuoteToOrder}>
                Submit
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Invoice
            OrderData={selectedQuoteToSubmit.requestPayload}
            po={selectedQuoteToSubmit.PO}
            orderDate={selectedQuoteToSubmit.createdDate}
          />
        </MDBox>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      {OrderStatusAlert}
      <DashboardNavbar />
      <MDBox>
        {isEditingOrder ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {OrderStatusAlert}
              <EditOrder
                OrderToEdit={selectedOrderToEdit}
                onOrderCompletion={() => setisEditingOrder(false)}
                alertFunction={setOrderStatusAlert}
              />
            </Grid>
            <Grid item xs={12}>
              <Footer padding="30px" margin="30px" />
            </Grid>
          </Grid>
        ) : (
          <MDBox my={3}>
            <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <MDBox display="flex">
                <MDBox ml={1}>
                  <MDButton variant="outlined" color="dark" onClick={refreshButtonFunction}>
                    <Icon>refresh</Icon>
                    &nbsp;Refresh
                  </MDButton>
                </MDBox>
                <MDBox ml={1}>
                  <MDButton variant="outlined" color="dark" onClick={refreshButtonFunction}>
                    <Icon>add</Icon>
                    <Link to="/orders/new-order-warehouse">&nbsp;New Order</Link>
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
            <Card>
              {orderData ? (
                <DataTable table={orderData || []} entriesPerPage={false} canSearch />
              ) : (
                <></>
              )}
            </Card>
          </MDBox>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default OrderList;
