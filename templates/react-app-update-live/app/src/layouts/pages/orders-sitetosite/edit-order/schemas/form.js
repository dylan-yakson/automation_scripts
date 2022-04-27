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

export default {
  formId: "new-user-form",
  formField: {
    salesName: {
      name: "salesName",
      label: "salesName",
      type: "text",
      errorMsg: "salesName is required.",
    },
    salesEmail: {
      name: "salesEmail",
      label: "salesEmail",
      type: "text",
      errorMsg: "salesEmail is required.",
    },
    quoteNum: {
      name: "quoteNum",
      label: "PO Number",
      type: "text",
      errorMsg: "quoteNum is required.",
    },
    isSiteToSiteOrder: {
      name: "isSiteToSiteOrder",
      label: "isSiteToSiteOrder",
      type: "text",
      errorMsg: "isSiteToSiteOrder is required.",
    },
    isQuoteOrOrder: {
      name: "isQuoteOrOrder",
      label: "isQuoteOrOrder",
      type: "text",
      errorMsg: "isQuoteOrOrder is required.",
    },
    customerTypeId: {
      name: "customerTypeId",
      label: "customerTypeId",
      type: "text",
      errorMsg: "customerTypeId is required.",
    },
    customerType: {
      name: "customerType",
      label: "customerType",
      type: "text",
      errorMsg: "customerType is required.",
    },
    deliveryByDate: {
      name: "deliveryByDate",
      label: "deliveryByDate",
      type: "text",
      errorMsg: "deliveryByDate is required.",
    },
    originAddress: {
      name: "originAddress",
      label: "KP Origin Site",
      type: "text",
      errorMsg: "Origin Address is required.",
    },
    customerId: {
      name: "customerId",
      label: "customerId",
      type: "text",
      errorMsg: "customerId is required.",
    },
    customerName: {
      name: "customerName",
      label: "Customer Name",
      placeholder: "Customer Name",
      errorMsg: "Customer Name is required.",
    },
    customerLocationName: {
      name: "customerLocationName",
      label: "customerLocationName",
      type: "text",
      placeholder: "Select Customer Location",
      errorMsg: "customerLocationName is required.",
    },
    customerLocationDisplayName: {
      name: "customerLocationDisplayName",
      label: "customerLocationDisplayName",
      type: "text",
      errorMsg: "customerLocationDisplayName is required.",
    },
    customerLocationID: {
      name: "customerLocationID",
      label: "customerLocationID",
      type: "text",
      errorMsg: "customerLocationID is required.",
    },

    destinationAddress1: {
      name: "destinationAddress1",
      label: "destinationAddress1",
      type: "text",
      errorMsg: "destinationAddress1 is required.",
    },
    destinationState: {
      name: "destinationState",
      label: "destinationState",
      type: "text",
      errorMsg: "destinationState is required.",
    },
    destinationCity: {
      name: "destinationCity",
      label: "destinationCity",
      type: "text",
      errorMsg: "destinationCity is required.",
    },
    destinationZip: {
      name: "destinationZip",
      label: "destinationZip",
      type: "text",
      errorMsg: "destinationZip is required.",
    },
    destinationContactPhone: {
      name: "destinationContactPhone",
      label: "destinationContactPhone",
      type: "text",
      errorMsg: "destinationContactPhone is required.",
    },
    orderItems: {
      name: "orderItems",
      label: "orderItems",
      type: "array",
      errorMsg: "orderItems is required.",
    },
    itemCount: {
      name: "itemCount",
      label: "itemCount",
      type: "text",
    },
    orderItemDescription: {
      name: "orderItemDescription",
      label: "orderItemDescription",
      type: "text",
    },
    orderItemID: {
      name: "orderItemID",
      label: "orderItemID",
      type: "text",
    },
    orderItemPackage: {
      name: "orderItemPackage",
      label: "orderItemPackage",
      type: "text",
    },
    orderItemPrice: {
      name: "orderItemPrice",
      label: "orderItemPrice",
      type: "decimal",
    },
    orderItemQuantity: {
      name: "orderItemQuantity",
      label: "orderItemQuantity",
      type: "number",
    },
    orderItemPackageID: {
      name: "orderItemPackageID",
      label: "orderItemPackageID",
      type: "text",
    },
    orderNotes: {
      name: "orderNotes",
      label: "Order Notes",
      type: "textarea",
      errorMsg: "Order Notes needs to be a string - No special characters.",
    },
  },
};
