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

// @mui material components
import { forwardRef } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import DataTable from "examples/Tables/InvoiceDisplayTable";
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Invoice page components
import BaseLayout from "layouts/pages/account/components/BaseLayout";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

// Images
import logoCT from "assets/images/logo-ct.png";
import logo from "assets/images/logo.png";

import logoCTDark from "assets/images/logo-ct-dark.png";

// Material Dashboard 2 PRO React context
import { useMaterialUIController } from "context";

const Invoice = forwardRef(({ OrderData, po, InitialOrderDate }, ref) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const PO = po || "";
  const orderDate = InitialOrderDate || new Date(Date.now());
  const order = OrderData;
  const borderBottom = {
    borderBottom: ({ borders: { borderWidth }, palette: { light } }) =>
      `${borderWidth[1]} solid ${light.main}`,
  };

  if (order && orderDate) {
    return (
      <div id="Invoice">
        {/* <MDBox mt={{ xs: 4, md: 10 }} mb={{ xs: 4, md: 8 }}> */}
        <MDBox>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8}>
              <Card>
                {/* Invoice header */}
                <MDBox p={3}>
                  <Grid container justifyContent="space-between">
                    <Grid item xs={12} md={4} lg={4}>
                      <MDBox
                        component="img"
                        // src={darkMode ? logoCT : logoCTDark}
                        src={logo}
                        width="25%"
                        p={1}
                        mb={1}
                      />
                      <MDTypography variant="h6" fontWeight="medium">
                        {order.origin.OriginAddress}
                      </MDTypography>
                      <MDBox mt={1} mb={2}>
                        <MDTypography
                          display="block"
                          variant="body2"
                          color={darkMode ? "text" : "secondary"}
                        >
                          tel: +1(936) 825 3068
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={7} lg={4}>
                      <MDBox width="100%" textAlign={{ xs: "left", md: "right" }} mt={6}>
                        <MDBox mt={1}>
                          <MDTypography variant="h6" fontWeight="medium">
                            Billed to: <br /> {order.destination.Customer}
                          </MDTypography>
                        </MDBox>
                        <MDBox mb={1}>
                          <MDTypography variant="body2" color={darkMode ? "text" : "secondary"}>
                            {order.destination.Address1}
                            <br />
                            {order.destination.City}
                            <br />
                            {order.destination.State}
                            {order.destination.ZipCode}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </Grid>
                  </Grid>
                  <MDBox mt={{ xs: 5, md: 10 }}>
                    <Grid container justifyContent="space-between">
                      <Grid item xs={12} md={4}>
                        <MDTypography
                          variant="h6"
                          color={darkMode ? "text" : "secondary"}
                          fontWeight="regular"
                        >
                          Invoice no
                        </MDTypography>
                        <MDTypography variant="h5" fontWeight="medium">
                          {PO}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={7} lg={5}>
                        <MDBox
                          width="100%"
                          display="flex"
                          flexDirection={{ xs: "column", md: "row" }}
                          alignItems={{ xs: "flex-start", md: "center" }}
                          textAlign={{ xs: "left", md: "right" }}
                          mt={{ xs: 3, md: 0 }}
                        >
                          <MDBox width="50%">
                            <MDTypography
                              variant="h6"
                              color={darkMode ? "text" : "secondary"}
                              fontWeight="regular"
                            >
                              Invoice date:
                            </MDTypography>
                          </MDBox>
                          <MDBox width="50%">
                            <MDTypography variant="h6" fontWeight="medium">
                              {orderDate}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                        <MDBox
                          width="100%"
                          display="flex"
                          flexDirection={{ xs: "column", md: "row" }}
                          alignItems={{ xs: "flex-start", md: "center" }}
                          textAlign={{ xs: "left", md: "right" }}
                        >
                          <MDBox width="50%">
                            <MDTypography
                              variant="h6"
                              color={darkMode ? "text" : "secondary"}
                              fontWeight="regular"
                            >
                              Due date:
                            </MDTypography>
                          </MDBox>
                          <MDBox width="50%">
                            <MDTypography variant="h6" fontWeight="medium">
                              {new Date(order.sales.deliveryDate).toDateString()}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                </MDBox>

                {/* Invoice table */}
                <MDBox p={3}>
                  <MDBox width="100%" overflow="auto">
                    <DataTable
                      usePagination={false}
                      table={{
                        columns: [
                          { Header: "Description", accessor: "Description" },
                          { Header: "ID", accessor: "ID" },
                          { Header: "Package", accessor: "Package" },
                          { Header: "Quantity", accessor: "Quantity" },
                          { Header: "Price", accessor: "PricePerGal" },
                        ],
                        rows: order.items.items.map((item) => {
                          const orderItem = item;
                          if (typeof orderItem.Package !== "string") {
                            orderItem.Package = orderItem.Package.packName;
                          }
                          return orderItem;
                        }),
                      }}
                    />
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </div>
    );
  }
  return (
    <MDBox>
      <Grid container justifyContent="center">
        <Stack spacing={1}>
          <Skeleton variant="text" />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={118} />
        </Stack>
      </Grid>
    </MDBox>
  );
});
Invoice.defaultProps = {
  po: "",
  InitialOrderDate: new Date(Date.now()).toDateString(),
};
// typechecking props for Profile
Invoice.propTypes = {
  OrderData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  po: PropTypes.string,
  InitialOrderDate: PropTypes.string,
};
export default Invoice;
