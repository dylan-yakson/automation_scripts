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

// react-flatpickr components
import Flatpickr from "react-flatpickr";

// react-flatpickr styles
import "flatpickr/dist/flatpickr.css";

// Material Dashboard 2 PRO React components
import MDInput from "components/MDInput";

function MDDatePicker({ input, fullWidth, ...rest }) {
  return (
    <Flatpickr
      {...rest}
      render={({ defaultValue }, ref) => (
        <MDInput {...input} defaultValue={defaultValue} inputRef={ref} fullWidth />
      )}
    />
  );
}

// Setting default values for the props of MDDatePicker
MDDatePicker.defaultProps = {
  input: {},
  fullWidth: false,
};

// Typechecking props for the MDDatePicker
MDDatePicker.propTypes = {
  input: PropTypes.objectOf(PropTypes.any),
  fullWidth: PropTypes.objectOf(PropTypes.bool),
};

export default MDDatePicker;
