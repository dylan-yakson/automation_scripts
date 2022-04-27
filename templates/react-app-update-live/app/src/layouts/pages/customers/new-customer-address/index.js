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
import Footer from "examples/Footer";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import MDAlert from "components/MDAlert";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
// NewUser page components
// import UserInfo from "layouts/pages/customers/new-customer-address/components/UserInfo";
import CustomerInfo from "layouts/pages/customers/new-customer-address/components/Customers";
import CustomerLocationInfo from "layouts/pages/customers/new-customer-address/components/CustomerLocation";
import CustomerLocationContactInfo from "layouts/pages/customers/new-customer-address/components/CustomerLocationContactInfo";
import OrderInfo from "layouts/pages/customers/new-customer-address/components/OrderInfo";
import ProductInfo from "layouts/pages/customers/new-customer-address/components/ProductInfo";
import ConfirmationScreen from "layouts/pages/customers/new-customer-address/components/Confirmation";
// import Address from "layouts/pages/customers/new-customer-address/components/Address";
// import Socials from "layouts/pages/customers/new-customer-address/components/Socials";
// import Profile from "layouts/pages/customers/new-customer-address/components/Profile";

// NewUser layout schemas for form and form feilds
import validations from "layouts/pages/customers/new-customer-address/schemas/validations";
import form from "layouts/pages/customers/new-customer-address/schemas/form";
import initialValues from "layouts/pages/customers/new-customer-address/schemas/initialValues";
import { useMsal } from "@azure/msal-react";

import {
  pullCustomerAddresses,
  convertOrderFormat,
  submitOrder,
  submitQuote,
  sendCustomerAddressRequestEmail,
} from "utils/koapi";

function getSteps() {
  return ["Customer Info", "Customer Address", "Location Contact Info"];
}

function NewUser() {
  const [activeStep, setActiveStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [stagedOrder, setStagedOrder] = useState({});
  const [stagedActions, setStagedActions] = useState(null);
  const [stagedFormattedCustomerAddress, setStagedFormattedCustomerAddress] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [OrderStatusAlert, setOrderStatusAlert] = useState(null);

  const steps = getSteps();
  const { formId, formField } = form;
  const currentValidation = validations[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const { accounts } = useMsal();
  const { username } = accounts[0];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleBack = () => setActiveStep(activeStep - 1);
  useEffect(() => {
    console.log(username);
    console.log(accounts[0]);
    pullCustomerAddresses(username).then((response) => {
      const customers = response;
      console.log(customers);
      setCustomerAddresses(response);
    });
  }, []);

  const sendOrderForProcessing = () => {
    if (stagedActions) {
      setIsLoading(true);
      sendCustomerAddressRequestEmail(username, stagedFormattedCustomerAddress).then((response) => {
        setIsLoading(false);
        setDialogOpen(false);
        setOrderStatusAlert(
          <MDAlert color="success">
            New Address request submited properly. We will be reaching out to you shortly.
            <MDAlertCloseIcon
              onClick={() => {
                setOrderStatusAlert(null);
              }}
            >
              &times;
            </MDAlertCloseIcon>
          </MDAlert>
        );
      });
      // if (stagedFormattedOrder.sales && stagedFormattedOrder.sales.quoteType === "Quote") {
      //   submitQuote(stagedFormattedOrder, "fuel").then((orderSubmisionResponse) => {
      //     console.log(orderSubmisionResponse);
      //     stagedActions.setSubmitting(false);
      //     stagedActions.resetForm();
      //     stagedActions.setFieldValue("orderItems", []);
      //     setActiveStep(0);
      //   });
      // } else {
      //   submitOrder(stagedFormattedOrder, "fuel").then((orderSubmisionResponse) => {
      //     console.log(orderSubmisionResponse);
      //     stagedActions.setSubmitting(false);
      //     stagedActions.resetForm();
      //     stagedActions.setFieldValue("orderItems", []);
      //     setActiveStep(0);
      //   });
      // }
    }
  };
  const handleDialogClickOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    stagedActions.setSubmitting(false);
  };
  const submitForm = async (values, actions) => {
    await setDialogOpen(true);
    await setStagedFormattedCustomerAddress(values);
    await console.log(values);
    await console.log(stagedFormattedCustomerAddress);
    await setStagedActions(actions);
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
        // return <OrderInfo formData={formData} />;
        return <CustomerInfo formData={formData} customerAddresses={customerAddresses} />;
      case 1:
        // return <CustomerInfo formData={formData} customerAddresses={customerAddresses} />;
        return <CustomerLocationInfo formData={formData} />; // <Socials formData={formData} />;
      case 2:
        // return <CustomerInfo formData={formData} customerAddresses={customerAddresses} />;
        return <CustomerLocationContactInfo formData={formData} />;
      default:
        return null;
    }
  }
  if (isLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
        <CircularProgress center />
      </MDBox>
    );
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} mb={20} height="65vh">
        {OrderStatusAlert}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to submit this request? Make sure the address is correct pleas
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
          <Grid item xs={12}>
            <Footer padding="30px" margin="30px" />
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default NewUser;
