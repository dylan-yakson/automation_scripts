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
import checkout from "layouts/pages/orders-sitetosite/edit-order/schemas/form";

const {
  formField: {
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
    customerLocationID,
    customerLocationDisplayName,
    destinationAddress1,
    destinationState,
    destinationCity,
    destinationZip,
    orderItems,
    orderItemDescription,
    orderItemID,
    orderItemPackage,
    orderItemPrice,
    orderItemQuantity,
    orderItemPackageID,
    destinationContactPhone,
    itemCount,
  },
} = checkout;

export default [
  Yup.object().shape({
    [deliveryByDate.name]: Yup.date().required(deliveryByDate.errorMsg),
    [isQuoteOrOrder.name]: Yup.string().required(isQuoteOrOrder.errorMsg),
    [customerType.name]: Yup.string().required(customerType.errorMsg),
    [quoteNum.name]: Yup.string(),
    [originAddress.name]: Yup.string().required(originAddress.errorMsg),
    //   [firstName.name]: Yup.string().required(firstName.errorMsg),
    //   [lastName.name]: Yup.string().required(lastName.errorMsg),
    //   [email.name]: Yup.string().required(email.errorMsg).email(email.invalidMsg),
    //   [password.name]: Yup.string().required(password.errorMsg).min(6, password.invalidMsg),
    //   [password.name]: Yup.string().required(password.errorMsg).min(6, password.invalidMsg),
    //   [repeatPassword.name]: Yup.string()
    //     .required(repeatPassword.errorMsg)
    //     .oneOf([Yup.ref("password"), null], repeatPassword.invalidMsg),
  }),
  Yup.object().shape({
    [customerName.name]: Yup.string().required(customerName.errorMsg),
  }),
  Yup.object().shape({
    [customerLocationName.name]: Yup.string().required(customerLocationName.errorMsg),
    [customerLocationID.name]: Yup.string().required(customerLocationID.errorMsg),
    [destinationAddress1.name]: Yup.string().required(destinationAddress1.errorMsg),
    // [destinationCity.name]: Yup.string().required(destinationCity.errorMsg),
    // [destinationState.name]: Yup.string().required(destinationState.errorMsg),
    // [destinationZip.name]: Yup.string().required(destinationZip.errorMsg),

    //   [twitter.name]: Yup.string().required(twitter.errorMsg),
  }),
  Yup.object().shape({
    [orderItems.name]: Yup.array()
      .of(
        Yup.object().shape({
          Description: Yup.string().min(2, "too short").required(orderItemDescription.errorMsg),
          ID: Yup.string().required(orderItemID.errorMsg),
          Package: Yup.string().required(orderItemPackage.errorMsg),
          Price: Yup.number().moreThan(0).required(orderItemPrice.errorMsg),
          Quantity: Yup.number().moreThan(0).required(orderItemQuantity.errorMsg),
        })
      )
      .required(orderItems.errorMsg) // these constraints are shown if and only if inner constraints are satisfied
      .min(1, "Minimum of 1 product"),
  }),
];
