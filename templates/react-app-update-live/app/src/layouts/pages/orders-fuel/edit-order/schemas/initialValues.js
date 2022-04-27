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

import checkout from "layouts/pages/orders-fuel/edit-order/schemas/form";
import { pullOriginWarehouses } from "utils/koapi";

const {
  formField: {
    // Sales
    salesName,
    salesEmail,
    quoteNum,
    isQuoteOrOrder,
    customerTypeId,
    customerType,
    deliveryByDate,
    // Origin
    originAddress,
    customerId,
    customerName,
    customerLocationName,
    customerLocationDisplayName,
    customerLocationID,
    destinationAddress1,
    destinationState,
    destinationCity,
    destinationZip,
    destinationContactPhone,
    orderItems,
    itemCount,
    orderNotes,
  },
} = checkout;

const originInitial = pullOriginWarehouses()[0].address;
export default {
  [isQuoteOrOrder.name]: "Quote",
  [deliveryByDate.name]: "",
  [salesName.name]: "",
  [salesEmail.name]: "",
  [quoteNum.name]: "",
  [originAddress.name]: originInitial,
  [customerTypeId.name]: "",
  [customerType.name]: "End User",
  [customerId.name]: "",
  [customerName.name]: "",
  [customerLocationName.name]: "",
  [customerLocationDisplayName.name]: "",
  [customerLocationID.name]: "",
  [destinationAddress1.name]: "",
  [destinationState.name]: "",
  [destinationCity.name]: "",
  [destinationZip.name]: "",
  [destinationContactPhone.name]: "",
  [itemCount.name]: "",
  [orderItems.name]: [],
  [orderNotes.name]: "",
};
