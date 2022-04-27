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
import FormField from "layouts/pages/orders-sitetosite/edit-order/components/FormFields/FormField";
import { ErrorMessage, Field } from "formik";

import { convertOrderFormat } from "utils/koapi";
import { useMsal } from "@azure/msal-react";
import Invoice from "layouts/pages/orders-sitetosite/invoice";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import MDEditor from "components/MDEditor";

function OrderInfo({ formData }) {
  const { formField, values, errors, touched, setFieldValue } = formData;
  const { isQuoteOrOrder, customerType, deliveryByDate, quoteNum, originAddress, orderNotes } =
    formField;
  const [formattedOrderData, setFormattedOrderData] = useState(null);
  const orderDataValues = { ...values };
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
    orderItems: orderItemsV,
    quoteNum: quoteNumV,
  } = values;
  const { accounts } = useMsal();

  const { orderNotes: orderNotesV } = values;
  useEffect(() => {
    console.log(orderDataValues);
    const formattedOrder = convertOrderFormat(orderDataValues);
    console.log(formattedOrder);
    setFormattedOrderData(formattedOrder);
  }, []);
  const itemMargins = "5px 0px 25px 0px";
  return (
    <MDBox>
      <MDTypography variant="h5">Order Confirmation</MDTypography>
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDTypography
              component="div"
              variant="h6"
              color="info"
              fontWeight="regular"
              margin="20px"
            >
              Please confirm everything looks good, then press the send button at the bottom of this
              page to submit it
            </MDTypography>
            <FormField
              type={orderNotes.type}
              label={orderNotes.label}
              name={orderNotes.name}
              value={orderNotesV}
              placeholder={orderNotesV.placeholder}
              multiline
              isTextArea
            />
            <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
              <ErrorMessage name={orderNotes.name} />
            </MDTypography>
          </Grid>
          <Grid item xs={12}>
            <Invoice
              OrderData={formattedOrderData}
              po={quoteNumV || ""}
              initialOrderDate={new Date(Date.now()).toDateString()}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

// typechecking props for Profile
OrderInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default OrderInfo;
