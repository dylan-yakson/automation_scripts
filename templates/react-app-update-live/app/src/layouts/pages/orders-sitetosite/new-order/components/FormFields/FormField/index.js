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

// prop-type is a library for typechecking of props
import PropTypes from "prop-types";

// formik components
import { ErrorMessage, Field } from "formik";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
// import MDEditor from "components/MDEditor";

function FormField({ label, name, isTextArea, ...rest }) {
  // if (isTextArea) {
  //   return (
  //     <MDBox mb={1.5}>
  //       <Field {...rest} name={name} as={MDEditor} variant="standard" label={label} fullWidth />
  //       <MDBox mt={0.75}>
  //         <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
  //           <ErrorMessage name={name} />
  //         </MDTypography>
  //       </MDBox>
  //     </MDBox>
  //   );
  // }
  return (
    <MDBox mb={1.5}>
      <Field {...rest} name={name} as={MDInput} variant="standard" label={label} fullWidth />
      <MDBox mt={0.75}>
        <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
          <ErrorMessage name={name} />
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

FormField.defaultProps = {
  isTextArea: false,
};
// typechecking props for FormField
FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isTextArea: PropTypes.bool,
};

export default FormField;
