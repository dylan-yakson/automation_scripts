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
// import FormField from "layouts/pages/orders-warehouse/new-order/components/FormFields/FormField";
// import CustomerField from "layouts/pages/orders-warehouse/new-order/components/FormFields/CustomersField";

// @mui material components
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

// import MDEditor from "components/MDEditor";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import MDDatePicker from "components/MDDatePicker";
import CategoriesList from "examples/Lists/CategoriesList";

// import SalesTable from "examples/Tables/SalesTable";
import DataTable from "examples/Tables/DataTable";

import { useMsal } from "@azure/msal-react";

import { pullProducts, pullProductPackages } from "utils/koapi";

// Formik
import { useField, Field, Form, Formik, FormikProps, ErrorMessage, FieldArray } from "formik";

function ProductInfo({ formData }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductPackages, setSelectedProductPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedPrice, setselectedPrice] = useState("");
  const [selectedQuantity, setselectedQuantity] = useState("");
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { accounts } = useMsal();

  const { formField, values, errors, touched, setFieldValue } = formData;
  const { customerLocationName, orderItemPrice, orderItemQuantity, orderItems } = formField;

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
  } = values;
  useEffect(() => {
    setIsLoading(true);
    pullProducts().then((ProductApiResponse) => {
      console.log(ProductApiResponse);
      setProducts(ProductApiResponse);
      setIsLoading(false);
    });
  }, []);
  const clearStates = () => {
    setselectedPrice("");
    setselectedQuantity("");
    setSelectedPackage("");
    setSelectedProduct("");
  };
  const addOrderItem = () => {
    const orderItemProduct = selectedProduct;
    const orderItemPackage = selectedPackage;
    console.log(orderItemProduct);
    console.log(orderItemPackage);
    if (
      orderItemProduct &&
      orderItemProduct.ID &&
      orderItemPackage &&
      selectedQuantity > 0 &&
      selectedPrice > 0
    ) {
      const orderItemObj = {
        Description: orderItemProduct.Description,
        ID: orderItemProduct.ID,
        Package: orderItemPackage.Package,
        Quantity: selectedQuantity,
        Price: selectedPrice,
      };
      // eslint-disable-next-line prefer-const
      if (orderItemsV) {
        delete orderItemsV.EditBtn;
        orderItemsV.push(orderItemObj);
        setSelectedOrderItems();
        setFieldValue("orderItems", orderItemsV);
        clearStates();
      } else {
        delete orderItemObj.EditBtn;
        setFieldValue("orderItems", [orderItemObj]);
        clearStates();
      }

      console.log(orderItemsV);
    }
  };
  const removeOrderItem = (itemID) => {
    const newOrderItems = orderItemsV.filter((orderItem) => orderItem.ID !== itemID);
    console.log(`New Order Items: `, newOrderItems);
    setSelectedOrderItems();
    setFieldValue("orderItems", newOrderItems);
  };
  if (isLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
        <CircularProgress center />
      </MDBox>
    );
  }
  return (
    <MDBox>
      <MDTypography variant="h5">Products & Pricing</MDTypography>
      <MDBox mt={3}>
        <Grid container spacing={3} marginBottom="20px">
          <Grid item xs={12} sm={12} fullWidth>
            {products ? (
              <>
                <Autocomplete
                  options={products.map((prod) => `${prod.ID} | ${prod.Description}`)}
                  renderInput={(params) => (
                    <MDInput
                      {...params}
                      variant="standard"
                      placeholder="Select to search for Product"
                      value={selectedProduct}
                    />
                  )}
                  onSelect={(val) => {
                    console.log(val);
                    // Clear Packages when we load new product to prevent overlap
                    setSelectedProductPackages("");
                    const productSelected = products.filter(
                      (prod) => val.target.value === `${prod.ID} | ${prod.Description}`
                    )[0];
                    if (productSelected) {
                      console.log(productSelected);
                      setSelectedProduct(productSelected);
                      setIsLoading(true);
                      pullProductPackages(productSelected.ID).then((packagesResponse) => {
                        console.log(packagesResponse);
                        console.log(packagesResponse);
                        setSelectedProductPackages(packagesResponse);
                        setIsLoading(false);
                      });
                    }
                  }}
                  value={selectedProduct.Description}
                />
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={3}>
        {selectedProduct && selectedProductPackages ? (
          <>
            <Grid container spacing={3} marginBottom="20px">
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  options={selectedProductPackages.map((prod) => prod.Package)}
                  renderInput={(params) => (
                    <MDInput
                      {...params}
                      variant="standard"
                      placeholder="Select to search for Package"
                      value={selectedPackage}
                    />
                  )}
                  onSelect={(val) => {
                    console.log(val);
                    const packageSelected = selectedProductPackages.filter(
                      (prod) => val.target.value === prod.Package
                    )[0];
                    if (packageSelected) {
                      console.log(packageSelected);
                      setSelectedPackage(packageSelected);
                    }
                  }}
                  value={selectedPackage.Package}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} marginBottom="20px" justifyContent="center">
              <Grid item xs={6} sm={6}>
                <MDInput
                  type="number"
                  label="Price"
                  value={selectedPrice}
                  onChange={(val) => {
                    const productPrice = val.target.value;
                    setselectedPrice(productPrice);
                  }}
                />
                <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                  <ErrorMessage name={orderItemPrice.name} />
                </MDTypography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <MDInput
                  type="number"
                  label="Quantity"
                  value={selectedQuantity}
                  onChange={(val) => {
                    const productQuantity = val.target.value;
                    setselectedQuantity(productQuantity);
                  }}
                />
                <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                  <ErrorMessage name={orderItemQuantity.name} />
                </MDTypography>
              </Grid>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </MDBox>
      <MDBox mt={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={12}>
            {selectedProduct && selectedPackage && selectedQuantity && selectedPrice ? (
              <MDButton variant="outlined" color="info" onClick={() => addOrderItem()}>
                Add Product
              </MDButton>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </MDBox>
      <DataTable
        table={{
          columns: [
            { Header: "Edit", accessor: "EditBtn" },
            { Header: "Description", accessor: "Description" },
            { Header: "ID", accessor: "ID" },
            { Header: "Package", accessor: "Package" },
            { Header: "Quantity", accessor: "Quantity" },
            { Header: "Price", accessor: "Price" },
          ],
          rows: orderItemsV.map((item) => {
            const orderItem = item;
            orderItem.EditBtn = (
              <MDButton variant="outlined" color="info" onClick={() => removeOrderItem(item.ID)}>
                Remove
              </MDButton>
            );
            return orderItem;
          }),
        }}
      />
      <ErrorMessage name={orderItemQuantity.name} />
      <ErrorMessage name={orderItems.name} />
      <ErrorMessage name={orderItemPrice.name} />
      <ErrorMessage name={orderItemPrice.name} />
      {/* <SalesTable title="Products Added:" rows={orderItemsV} fullWidth /> */}
    </MDBox>
  );
}

// typechecking props for UserInfo
ProductInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default ProductInfo;
