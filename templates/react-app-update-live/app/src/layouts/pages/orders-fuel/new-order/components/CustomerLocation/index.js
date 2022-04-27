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

function CustomerLocationInfo({ formData, customerAddresses }) {
  const [customerLocations, setcustomerLocations] = useState([]);
  const { accounts } = useMsal();

  const { formField, values, errors, touched, setFieldValue } = formData;
  const { customerLocationName } = formField;

  const {
    customerType: customerTypeV,
    customerName: customerNameV,
    customerId: customerIdV,
    destinationAddress1: destinationAddress1V,
    destinationCity: destinationCityV,
    destinationState: destinationStateV,
    destinationZip: destinationZipV,
    customerLocationName: customerLocationNameV,
    customerLocationDisplayName: customerLocationDisplayNameV,
  } = values;
  useEffect(() => {
    const customerSelected = customerAddresses.filter(
      (value) => value.customerID === customerIdV
    )[0];
    if (customerIdV && customerSelected) {
      console.log(customerSelected);
      setcustomerLocations(customerSelected.locations);
    }
  }, []);

  return (
    <MDBox>
      <MDTypography variant="h5">Customer Location Information</MDTypography>
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            {customerLocations ? (
              <>
                <MDTypography
                  component="label"
                  fontWeight="regular"
                  color="text"
                  textTransform="capitalize"
                >
                  {customerLocationName.placeholder}
                </MDTypography>
                <Autocomplete
                  options={customerLocations.map(
                    (addy) => `${addy.Description} | ${addy.Address1} | ${addy.City}`
                  )}
                  renderInput={(params) => <MDInput {...params} variant="standard" />}
                  onSelect={(val) => {
                    console.log(val);
                    const customerLocationSelected = customerLocations.filter(
                      (value) =>
                        val.target.value ===
                        `${value.Description} | ${value.Address1} | ${value.City}`
                    )[0];
                    if (customerLocationSelected) {
                      console.log(customerLocationSelected);
                      setFieldValue("destinationAddress1", customerLocationSelected.Address1);
                      setFieldValue("destinationCity", customerLocationSelected.City);
                      setFieldValue("destinationState", customerLocationSelected.State);
                      setFieldValue("destinationZip", customerLocationSelected.Zip);
                      setFieldValue("customerLocationName", customerLocationSelected.Description);
                      setFieldValue("customerLocationID", customerLocationSelected.LocationID);
                      setFieldValue("customerLocationDisplayName", val.target.value);
                    }
                  }}
                  value={customerLocationDisplayNameV}
                />
                <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                  <ErrorMessage name={customerLocationName.name} />
                </MDTypography>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

// typechecking props for UserInfo
CustomerLocationInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  customerAddresses: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default CustomerLocationInfo;
