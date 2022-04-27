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

// prop-type is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// NewUser page components
// import FormField from "layouts/pages/orders-fuel/new-order/components/FormFields/FormField";
// import CustomerField from "layouts/pages/orders-fuel/new-order/components/FormFields/CustomersField";

// @mui material components
import Autocomplete from "@mui/material/Autocomplete";

// import MDEditor from "components/MDEditor";
import MDInput from "components/MDInput";
import MDDatePicker from "components/MDDatePicker";
import { useMsal } from "@azure/msal-react";

// Formik
import { useField, Field, Form, Formik, FormikProps, ErrorMessage } from "formik";

function CustomerInfo({ formData, customerAddresses }) {
  const { accounts } = useMsal();
  const [CustomerStatusAlert, setCustomerStatusAlert] = useState(null);

  const { formField, values, errors, touched, setFieldValue } = formData;
  const { customerName } = formField;

  const {
    isQuoteOrOrder: isQuoteOrOrderV,
    customerType: customerTypeV,
    deliveryByDate: deliveryByDateV,
    customerName: customerNameV,
    customerId: customerIdV,
  } = values;

  return (
    <MDBox>
      <MDTypography variant="h5">Customer Information</MDTypography>
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <MDTypography
              component="label"
              fontWeight="regular"
              color="text"
              textTransform="capitalize"
            >
              {customerName.name}
            </MDTypography>
            <Autocomplete
              placeholder={customerName.placeholder}
              options={customerAddresses.map((addy) => addy.name)}
              renderInput={(params) => <MDInput {...params} variant="standard" />}
              onSelect={(val) => {
                const customerNameVal = val.target.value;
                const customerSelected = customerAddresses.filter(
                  (value) => value.name === customerNameVal
                )[0];
                if (val && customerSelected) {
                  console.log(val);
                  if (
                    customerSelected.CreditStatus &&
                    customerSelected.CreditStatus.toLowerCase().includes("hold")
                  ) {
                    setCustomerStatusAlert("Customer has exceeded their credit hold");
                  } else {
                    console.log("CHANGING NAME");
                    setFieldValue("customerName", customerSelected.name);
                    setFieldValue("customerId", customerSelected.customerID);
                  }
                }
              }}
              value={customerNameV}
            />
            <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
              <ErrorMessage name={customerName.name} />
              {CustomerStatusAlert}
            </MDTypography>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

// typechecking props for UserInfo
CustomerInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  customerAddresses: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default CustomerInfo;
