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
import { useEffect, useState } from "react";
// prop-type is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// NewUser page components
import MDDatePicker from "components/MDDatePicker";
import MDInput from "components/MDInput";
import FormField from "layouts/pages/customers/new-customer/components/FormFields/FormField";
import { ErrorMessage, Field } from "formik";

import { pullOriginWarehouses } from "utils/koapi";
import { useMsal } from "@azure/msal-react";

function OrderInfo({ formData }) {
  const { formField, values, errors, touched, setFieldValue } = formData;
  const { isQuoteOrOrder, customerType, deliveryByDate, quoteNum, originAddress } = formField;
  const [originWarehouseLocations, setOriginWarehouseLocations] = useState({});
  const { accounts } = useMsal();

  const {
    quoteNum: quoteNumV,
    isQuoteOrOrder: isQuoteOrOrderV,
    deliveryByDate: deliveryByDateV,
    customerType: customerTypeV,
    originAddress: originAddressV,
  } = values;
  useEffect(() => {
    const tmpOriginWarehouseLocations = pullOriginWarehouses();
    setOriginWarehouseLocations(tmpOriginWarehouseLocations.map((item) => item.address));

    // Set Sales Data
    setFieldValue("salesName", accounts[0].name);
    setFieldValue("salesEmail", accounts[0].username);
  }, []);
  const itemMargins = "5px 0px 25px 0px";
  return (
    <MDBox>
      <MDTypography variant="h5">Order Information</MDTypography>
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormField
              type={quoteNum.type}
              label={quoteNum.label}
              name={quoteNum.name}
              value={quoteNumV}
              placeholder={quoteNum.placeholder}
            />
            <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
              <ErrorMessage name={quoteNum.name} />
            </MDTypography>
          </Grid>
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
                    {originAddress.name}
                  </MDTypography>
                </MDBox>
                <Autocomplete
                  placeholder={originAddress.placeholder}
                  defaultValue="Quote"
                  options={originWarehouseLocations.map((item) => item.address)}
                  renderInput={(params) => <MDInput {...params} variant="standard" />}
                  onSelect={(val) => setFieldValue("originAddress", val.target.value)}
                  value={originAddressV}
                />
                <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                  <ErrorMessage name={originAddress.name} />
                </MDTypography>
              </MDBox>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} margin={itemMargins}>
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
                  Quote or Order?
                </MDTypography>
              </MDBox>
              <Autocomplete
                defaultValue="Quote"
                options={["Order", "Quote"]}
                renderInput={(params) => <MDInput {...params} variant="standard" />}
                onSelect={(val) => setFieldValue("isQuoteOrOrder", val.target.value)}
                value={isQuoteOrOrderV}
              />
              <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                <ErrorMessage name={isQuoteOrOrder.name} />
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} sm={6} margin={itemMargins}>
            {/* <FormField type="text" label="Weight" /> */}
            <MDBox>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  textTransform="capitalize"
                >
                  Customer Type?
                </MDTypography>
              </MDBox>
              <Autocomplete
                defaultValue="End User"
                options={["End User", "Distributor"]}
                renderInput={(params) => <MDInput {...params} variant="standard" />}
                onSelect={(val) => setFieldValue("customerType", val.target.value)}
                value={customerTypeV}
              />
              <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                <ErrorMessage name={customerType.name} />
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={3} fullWidth>
        <Grid container spacing={3}>
          <Grid item margin={itemMargins}>
            <MDBox>
              <MDTypography component="label" variant="button" fontWeight="regular" color="text">
                Needing Delivery By&nbsp;&nbsp;
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
        <MDDatePicker
          input={{ placeholder: "Select a date" }}
          options={{ minDate: new Date(Date.now()) }}
          onChange={(val) => {
            console.log(val);
            setFieldValue("deliveryByDate", val);
          }}
          fullWidth
          value={deliveryByDateV}
        />
        <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
          <ErrorMessage name={deliveryByDate.name} />
        </MDTypography>
      </MDBox>
    </MDBox>
    // <MDBox>
    //   <MDTypography variant="h5" fontWeight="bold">
    //     Profile
    //   </MDTypography>
    //   <MDBox mt={1.625}>
    //     <Grid container spacing={1}>
    //       <Grid item xs={12}>
    //         <FormField
    //           type={publicEmail.type}
    //           label={publicEmail.label}
    //           name={publicEmail.name}
    //           value={publicEmailV}
    //           placeholder={publicEmail.placeholder}
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <FormField
    //           type={bio.type}
    //           label={bio.label}
    //           name={bio.name}
    //           value={bioV}
    //           placeholder={bio.placeholder}
    //           multiline
    //           rows={5}
    //         />
    //       </Grid>
    //     </Grid>
    //   </MDBox>
    // </MDBox>
  );
}

// typechecking props for Profile
OrderInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default OrderInfo;
