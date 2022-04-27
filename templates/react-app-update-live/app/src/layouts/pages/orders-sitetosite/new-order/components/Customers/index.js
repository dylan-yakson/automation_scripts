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
import FormField from "layouts/pages/orders-sitetosite/new-order/components/FormFields/FormField";
import { ErrorMessage, Field } from "formik";

import { pullOriginWarehouses } from "utils/koapi";
import { useMsal } from "@azure/msal-react";

function CustomerInfo({ formData }) {
  const { formField, values, errors, touched, setFieldValue } = formData;
  const { isQuoteOrOrder, customerType, deliveryByDate, quoteNum, originAddress, customerName } =
    formField;
  const [originWarehouseLocations, setOriginWarehouseLocations] = useState({});
  const { accounts } = useMsal();

  const {
    quoteNum: quoteNumV,
    isQuoteOrOrder: isQuoteOrOrderV,
    deliveryByDate: deliveryByDateV,
    customerType: customerTypeV,
    originAddress: originAddressV,
    customerName: customerNameV,
  } = values;
  useEffect(() => {
    const tmpOriginWarehouseLocations = pullOriginWarehouses();
    setOriginWarehouseLocations(tmpOriginWarehouseLocations);
    const addressSelected = tmpOriginWarehouseLocations[0];
    // Set Sales Data
    setFieldValue("customerName", addressSelected.name);
    setFieldValue("customerId", "6868");
    setFieldValue("destinationAddress1", addressSelected.address);
    setFieldValue("destinationCity", "");
    setFieldValue("destinationState", "");
    setFieldValue("destinationZip", "");
    setFieldValue("customerLocationName", addressSelected.name);
    setFieldValue("customerLocationID", addressSelected.name);
    setFieldValue("customerLocationDisplayName", addressSelected.name);
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
                    Destination Warehouse Address
                  </MDTypography>
                </MDBox>
                <Autocomplete
                  placeholder={originAddress.placeholder}
                  options={originWarehouseLocations.map((item) => `${item.name}`)}
                  renderInput={(params) => <MDInput {...params} variant="standard" />}
                  onSelect={(val) => {
                    const selectedValue = val.target.value;
                    console.log(selectedValue);
                    const destinationAddressVal = val.target.value;
                    const addressSelected = originWarehouseLocations.filter(
                      (value) => value.name === destinationAddressVal
                    )[0];
                    if (val && addressSelected) {
                      console.log(val);
                      console.log(addressSelected);
                      console.log("CHANGING NAME");
                      setFieldValue("customerName", addressSelected.name);
                      setFieldValue("customerId", "6868");
                      setFieldValue("destinationAddress1", addressSelected.address);
                      setFieldValue("destinationCity", "");
                      setFieldValue("destinationState", "");
                      setFieldValue("destinationZip", "");
                      setFieldValue("customerLocationName", addressSelected.name);
                      setFieldValue("customerLocationID", addressSelected.name);
                      setFieldValue("customerLocationDisplayName", addressSelected.name);
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
        </Grid>
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
CustomerInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default CustomerInfo;
