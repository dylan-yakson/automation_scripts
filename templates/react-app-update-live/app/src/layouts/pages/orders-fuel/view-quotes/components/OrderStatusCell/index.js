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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

const getColor = (status) => {
  switch (status) {
    case "Billed":
      return "success";
    case "Open":
      return "primary";
    case "Order Cancelled":
      return "error";
    default:
      return "secondary";
  }
};
function OrderStatusCell({ value, suffix }) {
  return (
    <MDTypography variant="caption" fontWeight="medium" color="text">
      <MDBadge badgeContent={value} container color={getColor(value)} />
      {suffix && (
        <MDTypography variant="caption" fontWeight="medium" color="primary">
          &nbsp;&nbsp;{suffix}
        </MDTypography>
      )}
    </MDTypography>
  );
}

// Setting default values for the props of DefaultCell
OrderStatusCell.defaultProps = {
  suffix: "",
};

// Typechecking props for the DefaultCell
OrderStatusCell.propTypes = {
  value: PropTypes.string.isRequired,
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default OrderStatusCell;
