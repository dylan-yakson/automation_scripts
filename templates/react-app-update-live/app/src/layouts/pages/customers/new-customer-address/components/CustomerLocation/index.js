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
// import FormField from "layouts/pages/customers/new-customer-address/components/FormFields/FormField";
// import CustomerField from "layouts/pages/customers/new-customer-address/components/FormFields/CustomersField";

// @mui material components
import Autocomplete from "@mui/material/Autocomplete";

// import MDEditor from "components/MDEditor";
import MDInput from "components/MDInput";
import MDDatePicker from "components/MDDatePicker";
import { useMsal } from "@azure/msal-react";

// Formik
import { useField, Field, Form, Formik, FormikProps, ErrorMessage } from "formik";

import StatesArray from "utils/staticData";
import FormField from "layouts/pages/users/new-user/components/FormField";

function CustomerLocationInfo({ formData }) {
  const [customerLocations, setcustomerLocations] = useState([]);
  const { accounts } = useMsal();

  const { formField, values, errors, touched, setFieldValue } = formData;
  const {
    address1,
    address2,
    city,
    zip,
    locationContactname,
    locationContactNumber,
    locationContactEmail,
    customerLocationName,
    customerLocationDisplayName,
  } = formField;

  const {
    customerType: customerTypeV,
    customerName: customerNameV,
    customerId: customerIdV,
    address1: address1V,
    address2: address2V,
    city: cityV,
    state: stateV,
    zip: zipV,
    locationContactname: locationContactnameV,
    locationContactNumber: locationContactNumberV,
    locationContactEmail: locationContactEmailV,
    customerLocationName: customerLocationNameV,
    customerLocationDisplayName: customerLocationDisplayNameV,
  } = values;
  return (
    <MDBox>
      <MDTypography variant="h5">Customer Location Information</MDTypography>
      <MDBox>
        <MDTypography variant="h5" fontWeight="bold">
          Address
        </MDTypography>
        <MDBox mt={1.625}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormField
                type={address1.type}
                label={address1.label}
                name={address1.name}
                value={address1V}
                placeholder={address1.placeholder}
                error={errors.address1 && touched.address1}
                success={address1V.length > 0 && !errors.address1}
              />
            </Grid>
            <Grid item xs={12}>
              <MDBox mt={-1.625}>
                <FormField
                  type={address2.type}
                  label={address2.label}
                  name={address2.name}
                  value={address2V}
                  placeholder={address2.placeholder}
                  error={errors.address2 && touched.address2}
                  success={address2V.length > 0 && !errors.address2}
                />
              </MDBox>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormField
                type={city.type}
                label={city.label}
                name={city.name}
                value={cityV}
                placeholder={city.placeholder}
                error={errors.city && touched.city}
                success={cityV.length > 0 && !errors.city}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Autocomplete
                options={StatesArray}
                renderInput={(params) => <MDInput {...params} variant="standard" label="State" />}
                onSelect={(val) => {
                  const stateVal = val.target.value;
                  setFieldValue("state", stateVal);
                }}
                value={stateV}
                error={errors.state && touched.state}
                success={stateV.length > 0 && !errors.state}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormField
                type={zip.type}
                label={zip.label}
                name={zip.name}
                value={zipV}
                placeholder={zip.placeholder}
                error={errors.zip && touched.zip}
                success={zipV.length > 0 && !errors.zip}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// typechecking props for UserInfo
CustomerLocationInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default CustomerLocationInfo;
