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

import statesArray from "utils/staticData";
import FormField from "layouts/pages/customers/new-customer-address/components/FormField";

function CustomerLocationInfo({ formData }) {
  const [customerLocations, setcustomerLocations] = useState([]);
  const { accounts } = useMsal();

  const { formField, values, errors, touched, setFieldValue } = formData;
  const {
    locationContactname,
    locationContactNumber,
    locationContactEmail,
    customerLocationName,
    customerLocationDisplayName,
  } = formField;

  const {
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
                type={customerLocationName.type}
                label={customerLocationName.label}
                name={customerLocationName.name}
                value={customerLocationNameV}
                placeholder={customerLocationName.placeholder}
                error={errors.customerLocationName && touched.customerLocationName}
                success={customerLocationNameV.length > 0 && !errors.customerLocationName}
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                type={locationContactname.type}
                label={locationContactname.label}
                name={locationContactname.name}
                value={locationContactnameV}
                placeholder={locationContactname.placeholder}
                error={errors.locationContactname && touched.locationContactname}
                success={locationContactname.length > 0 && !errors.locationContactname}
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                type={locationContactNumber.type}
                label={locationContactNumber.label}
                name={locationContactNumber.name}
                value={locationContactNumberV}
                placeholder={locationContactNumber.placeholder}
                error={errors.locationContactNumber && touched.locationContactNumber}
                success={locationContactNumberV.length > 0 && !errors.locationContactNumber}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormField
                type={locationContactEmail.type}
                label={locationContactEmail.label}
                name={locationContactEmail.name}
                value={locationContactEmailV}
                placeholder={locationContactEmail.placeholder}
                error={errors.locationContactEmail && touched.locationContactEmail}
                success={locationContactEmailV.length > 0 && !errors.locationContactEmail}
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
