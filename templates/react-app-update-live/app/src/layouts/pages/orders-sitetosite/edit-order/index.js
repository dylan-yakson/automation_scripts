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
import PropTypes from "prop-types";

// formik components
import { Formik, Form } from "formik";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// EditOrder page components
// import UserInfo from "layouts/pages/orders-sitetosite/edit-order/components/UserInfo";
import CustomerInfo from "layouts/pages/orders-sitetosite/edit-order/components/Customers";
import CustomerLocationInfo from "layouts/pages/orders-sitetosite/edit-order/components/CustomerLocation";
import OrderInfo from "layouts/pages/orders-sitetosite/edit-order/components/OrderInfo";
import ProductInfo from "layouts/pages/orders-sitetosite/edit-order/components/ProductInfo";
import ConfirmationScreen from "layouts/pages/orders-sitetosite/edit-order/components/Confirmation";
// import Address from "layouts/pages/orders-sitetosite/edit-order/components/Address";
// import Socials from "layouts/pages/orders-sitetosite/edit-order/components/Socials";
// import Profile from "layouts/pages/orders-sitetosite/edit-order/components/Profile";
import MDAlert from "components/MDAlert";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";

// EditOrder layout schemas for form and form feilds
import validations from "layouts/pages/orders-sitetosite/edit-order/schemas/validations";
import form from "layouts/pages/orders-sitetosite/edit-order/schemas/form";
import initialValues from "layouts/pages/orders-sitetosite/edit-order/schemas/initialValues";
import { useMsal } from "@azure/msal-react";

import {
  pullCustomerAddresses,
  convertOrderFormat,
  submitOrder,
  updateOrder,
  convertToSchemaFormat,
} from "utils/koapi";

function getSteps() {
  return ["Order Info", "Destination Info", "Pricing", "Confirmation"];
}

function EditOrder({ OrderToEdit, onOrderCompletion, alertFunction }) {
  const [activeStep, setActiveStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [stagedOrder, setStagedOrder] = useState({});
  const [OrderStatusAlert, setOrderStatusAlert] = useState(null);
  const [originalOrder, setoriginalOrder] = useState(null);
  const [stagedActions, setStagedActions] = useState(null);
  const [stagedFormattedOrder, setStagedFormattedOrder] = useState({});
  const steps = getSteps();
  const { formId, formField } = form;
  const currentValidation = validations[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const { accounts } = useMsal();

  const setOrderInProgress = () => {
    onOrderCompletion(false);
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleBack = () => setActiveStep(activeStep - 1);
  useEffect(() => {
    const { username } = accounts[0];
    console.log(username);
    console.log(accounts[0]);
    console.log("ORDER TO EDIT:");
    console.log(OrderToEdit);
    const convertedOrder = convertToSchemaFormat(OrderToEdit);
    setoriginalOrder(OrderToEdit);

    pullCustomerAddresses(username).then((response) => {
      const customers = response;
      console.log(customers);
      setCustomerAddresses(response);
    });
  }, []);

  const sendOrderForProcessing = () => {
    if (stagedActions) {
      updateOrder(stagedFormattedOrder, "warehouse", OrderToEdit.PO).then(
        (orderSubmisionResponse) => {
          console.log(orderSubmisionResponse);
          if (orderSubmisionResponse.Error && orderSubmisionResponse.Error === "True") {
            if (orderSubmisionResponse.Message) {
              setOrderStatusAlert(
                <MDAlert color="error">
                  We had an issue...
                  {orderSubmisionResponse.Message}
                  <MDAlertCloseIcon
                    onClick={() => {
                      setOrderStatusAlert(null);
                    }}
                  >
                    &times;
                  </MDAlertCloseIcon>
                </MDAlert>
              );
            } else {
              setOrderStatusAlert(
                <MDAlert color="error">
                  Not sure what went wrong there.. Please try again in a few or contact IT if you
                  still have issues.
                  <MDAlertCloseIcon
                    onClick={() => {
                      setOrderStatusAlert(null);
                    }}
                  >
                    &times;
                  </MDAlertCloseIcon>
                </MDAlert>
              );
            }
          } else {
            stagedActions.setSubmitting(false);
            stagedActions.resetForm();
            stagedActions.setFieldValue("orderItems", []);
            setActiveStep(0);
            setDialogOpen(false);
            setOrderStatusAlert(
              <MDAlert color="success">
                Order {orderSubmisionResponse.PO} Edited Successfully
                <MDAlertCloseIcon
                  onClick={() => {
                    setOrderStatusAlert(null);
                  }}
                >
                  &times;
                </MDAlertCloseIcon>
              </MDAlert>
            );
            try {
              alertFunction(
                <MDAlert color="success">
                  Order {orderSubmisionResponse.PO} Edited Successfully
                  <MDAlertCloseIcon
                    onClick={() => {
                      alertFunction(null);
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
            setOrderInProgress(false);
          }
        }
      );
    }
  };
  const submitForm = async (values, actions) => {
    // await sleep(1000);
    // eslint-disable-next-line no-alert
    // Clear button components
    values.orderItems.map((item) => {
      const responseObj = item;
      try {
        delete responseObj.EditBtn;
      } catch (error) {
        console.log("Error deleting item button", error);
      }
      return responseObj;
    });
    setStagedOrder(values);
    setDialogOpen(true);
    const formattedOrder = convertOrderFormat(values);
    setStagedFormattedOrder(formattedOrder);
    console.log(values);
    console.log(formattedOrder);
    setStagedActions(actions);

    // eslint-disable-next-line no-alert
    // alert(
    //   JSON.stringify(values, (key, value) => (value === null ? "" : value)),
    //   2
    // );
    // // eslint-disable-next-line no-alert
    // alert(
    //   JSON.stringify(formattedOrder, (key, value) => (value === null ? "" : value)),
    //   2
    // );
  };

  const handleSubmit = (values, actions) => {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };
  function getStepContent(stepIndex, formData) {
    switch (stepIndex) {
      case 0:
        return <OrderInfo formData={formData} orderToEdit={convertToSchemaFormat(OrderToEdit)} />;
      case 1:
        return <CustomerInfo formData={formData} />; // <CustomerInfo formData={formData} customerAddresses={customerAddresses} />;
      case 2:
        return <ProductInfo formData={formData} customerAddresses={customerAddresses} />; // <Profile formData={formData} />;
      case 3:
        return <ConfirmationScreen formData={formData} />; // <Profile formData={formData} />;
      default:
        return null;
    }
  }
  const handleDialogClickOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    stagedActions.setSubmitting(false);
  };
  return (
    <MDBox py={3} mb={20} height="65vh">
      {OrderStatusAlert}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to submit this order?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Make sure everything is correct before you shoot it our way please. Once its in, we
            start working on it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleDialogClose}>Disagree</MDButton>
          <MDButton onClick={() => sendOrderForProcessing()} autoFocus>
            Agree
          </MDButton>
        </DialogActions>
      </Dialog>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%", mt: 8 }}
        spacing={3}
      >
        <Grid item xs={12} lg={8}>
          <Formik
            initialValues={initialValues}
            validationSchema={currentValidation}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form id={formId} autoComplete="off">
                <Card sx={{ height: "100%" }}>
                  <MDBox mx={2} mt={-3}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </MDBox>
                  <MDBox p={3}>
                    <MDBox>
                      {getStepContent(activeStep, {
                        values,
                        touched,
                        formField,
                        errors,
                        setFieldValue,
                      })}
                      <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
                        {activeStep === 0 ? (
                          <MDBox />
                        ) : (
                          <MDButton variant="gradient" color="light" onClick={handleBack}>
                            back
                          </MDButton>
                        )}
                        <MDButton
                          disabled={isSubmitting}
                          type="submit"
                          variant="gradient"
                          color="dark"
                        >
                          {isLastStep ? "send" : "next"}
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </Card>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </MDBox>
  );
}
// Typechecking props for the ActionCell
EditOrder.propTypes = {
  OrderToEdit: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  onOrderCompletion: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  alertFunction: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default EditOrder;
