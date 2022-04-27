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
import { useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

function ActionCell({ value, emailFunction, updateFunction, reviewFunction, ordersList }) {
  const [menu, setMenu] = useState(null);
  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const handleUpdate = (id) => {
    console.log(id);
  };
  const findOrderFromID = (id) => {
    // eslint-disable-next-line no-underscore-dangle
    const filteredOrders = ordersList.filter((order) => order._id === id);
    console.log("ORDER FOUND");
    console.log(filteredOrders[0]);
    return filteredOrders[0];
  };
  const renderMenu = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem onClick={() => updateFunction(findOrderFromID(value))}>Update</MenuItem>
      <MenuItem onClick={() => reviewFunction(findOrderFromID(value))}>Review</MenuItem>
      <MenuItem onClick={() => emailFunction(findOrderFromID(value))}>Re-Send Email</MenuItem>
      <MenuItem onClick={() => handleUpdate(findOrderFromID(value))}>Cancel</MenuItem>
      <Divider sx={{ margin: "0.5rem 0" }} />
    </Menu>
  );
  return (
    <>
      <MDBox>
        <MDButton variant={menu ? "contained" : "outlined"} color="dark" onClick={openMenu}>
          Actions&nbsp;
          <Icon>keyboard_arrow_down</Icon>
        </MDButton>
        {renderMenu}
      </MDBox>
    </>
  );
}

// ActionCell.defaultProps = {
//   updateFunction: console.log,
//   emailFunction: console.log,
// };
// Typechecking props for the ActionCell
ActionCell.propTypes = {
  value: PropTypes.string.isRequired,
  emailFunction: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  updateFunction: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  ordersList: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  reviewFunction: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default ActionCell;
