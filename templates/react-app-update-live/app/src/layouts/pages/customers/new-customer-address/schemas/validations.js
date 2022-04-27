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

import * as Yup from "yup";
import checkout from "layouts/pages/customers/new-customer-address/schemas/form";

const {
  formField: {
    // Origin
    originAddress,
    customerId,
    customerName,
    destinationContactPhone,
    itemCount,
    address1,
    address2,
    city,
    state,
    zip,
    locationContactname,
    locationContactNumber,
    locationContactEmail,
  },
} = checkout;

export default [
  Yup.object().shape({
    [customerName.name]: Yup.string().required(customerName.errorMsg),
  }),
  Yup.object().shape({
    [address1.name]: Yup.string().required(address1.errorMsg),
    [address2.name]: Yup.string(),
    [city.name]: Yup.string().required(city.errorMsg),
    [state.name]: Yup.string().required(state.errorMsg),
    [zip.name]: Yup.string().required(zip.errorMsg),
  }),
  Yup.object().shape({
    [locationContactname.name]: Yup.string().required(locationContactname.errorMsg),
    [locationContactNumber.name]: Yup.string().required(locationContactNumber.errorMsg),
    [locationContactEmail.name]: Yup.string().email().required(locationContactEmail.errorMsg),

    //   // [destinationCity.name]: Yup.string().required(destinationCity.errorMsg),
    //   // [destinationState.name]: Yup.string().required(destinationState.errorMsg),
    //   // [destinationZip.name]: Yup.string().required(destinationZip.errorMsg),
    //   //   [twitter.name]: Yup.string().required(twitter.errorMsg),
  }),
  // Yup.object().shape({
  // }),
];
