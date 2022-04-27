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
// @mui material components
import Autocomplete from "@mui/material/Autocomplete";

// import MDEditor from "components/MDEditor";
import MDInput from "components/MDInput";
import MDDatePicker from "components/MDDatePicker";
import { useMsal } from "@azure/msal-react";
import { pullOriginWarehouses } from "utils/koapi";

// Formik
import { useField, Field, Form, Formik, FormikProps, ErrorMessage } from "formik";

function CustomerInfo({ formData }) {
  const { accounts } = useMsal();
  const [originWarehouseLocations, setOriginWarehouseLocations] = useState([{}]);

  const { formField, values, errors, touched, setFieldValue } = formData;
  const {
    isQuoteOrOrder,
    customerType,
    deliveryByDate,
    quoteNum,
    originAddress,
    customerLocationName,
    customerLocationDisplayName,
    destinationAddress1,
  } = formField;
  const { customerName } = formField;

  const {
    isQuoteOrOrder: isQuoteOrOrderV,
    customerType: customerTypeV,
    deliveryByDate: deliveryByDateV,
    customerName: customerNameV,
    customerId: customerIdV,
    destinationAddress1: destinationAddress1V,
    destinationCity: destinationCityV,
    destinationState: destinationStateV,
    destinationZip: destinationZipV,
    customerLocationName: customerLocationNameV,
    customerLocationDisplayName: customerLocationDisplayNameV,
    originAddress: originAddressV,
  } = values;
  useEffect(() => {
    const tmpOriginWarehouseLocations = pullOriginWarehouses();
    setOriginWarehouseLocations(tmpOriginWarehouseLocations.map((item) => item.address));

    // Set Sales Data
    if (tmpOriginWarehouseLocations.length > 0) {
      setFieldValue("customerLocationDisplayName", tmpOriginWarehouseLocations[0].name);
      setFieldValue("customerLocationName", tmpOriginWarehouseLocations[0].name);
      setFieldValue("destinationAddress1", tmpOriginWarehouseLocations[0].address);
      setFieldValue("customerId", "6868");
    }
  }, []);
  const itemMargins = "5px 0px 25px 0px";
  return (
    <MDBox>
      <MDTypography variant="h5">Destination Information</MDTypography>
      <MDBox mt={3}>
        <Grid container spacing={3}>
          {originWarehouseLocations.length > 0 ? (
            <Grid item xs={12} sm={12} margin={itemMargins}>
              {/* <FormField type="text" label="Name" /> */}
              <MDBox>
                <MDBox display="inline-block">
                  <MDTypography
                    component="label"
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    textTransform="capitalize"
                  >
                    {customerLocationName.name}
                  </MDTypography>
                </MDBox>
                <Autocomplete
                  placeholder={customerLocationName.placeholder}
                  defaultValue="Quote"
                  options={originWarehouseLocations.map((item) => item.name)}
                  renderInput={(params) => <MDInput {...params} variant="standard" />}
                  onSelect={(val) => {
                    const destinationNameVal = val.target.value;
                    const addressSelected = originWarehouseLocations.filter(
                      (value) => value.name === destinationNameVal
                    )[0];
                    if (addressSelected) {
                      setFieldValue("customerName", addressSelected.name);
                      setFieldValue("customerId", "6868");
                      setFieldValue("customerLocationDisplayName", addressSelected.name);
                      setFieldValue("customerLocationName", addressSelected.name);
                      setFieldValue("destinationAddress1", addressSelected.address);
                    }
                  }}
                  value={customerNameV}
                />
                <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                  <ErrorMessage name={customerName.name} />
                </MDTypography>
              </MDBox>
            </Grid>
          ) : (
            <></>
          )}
          {/* <Grid item xs={12} sm={6}>
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
                  console.log(customerSelected);
                  console.log("CHANGING NAME");
                  setFieldValue("customerName", customerSelected.name);
                  setFieldValue("customerId", customerSelected.customerID);
                }
              }}
              value={customerNameV}
            />
            <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
              <ErrorMessage name={customerName.name} />
            </MDTypography>
          </Grid> */}
        </Grid>
      </MDBox>
    </MDBox>
  );
}

// typechecking props for UserInfo
CustomerInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default CustomerInfo;
