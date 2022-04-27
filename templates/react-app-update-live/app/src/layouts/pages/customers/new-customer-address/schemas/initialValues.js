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

import checkout from "layouts/pages/customers/new-customer-address/schemas/form";
import { pullOriginWarehouses } from "utils/koapi";

const {
  formField: {
    // Sales
    salesName,
    salesEmail,
    // Origin
    originAddress,
    customerId,
    customerName,
    address1,
    address2,
    city,
    state,
    zip,
    locationContactname,
    locationContactNumber,
    locationContactEmail,
    customerLocationName,
  },
} = checkout;

const originInitial = pullOriginWarehouses()[0].address;
export default {
  [salesName.name]: "",
  [salesEmail.name]: "",
  [originAddress.name]: originInitial,
  [customerId.name]: "",
  [customerName.name]: "",
  [address1.name]: "",
  [address2.name]: "",
  [city.name]: "",
  [state.name]: "",
  [zip.name]: "",
  [locationContactname.name]: "",
  [locationContactNumber.name]: "",
  [locationContactEmail.name]: "",
  [customerLocationName.name]: "",
};
