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

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React contexts
import Autocomplete from "@mui/material/Autocomplete";
import MDInput from "components/MDInput";
import CircularProgress from "@mui/material/CircularProgress";

function DefaultStatisticsCard({ title, dropdown, CustomerList }) {
  console.log(CustomerList);
  const customerListArray = CustomerList;
  if (!CustomerList) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="flex-start" mb={2}>
        <CircularProgress center />
      </MDBox>
    );
  }
  return (
    <Card>
      <MDBox p={2}>
        <Grid container>
          <Grid item xs={7}>
            <MDBox mb={0.5} lineHeight={1}>
              <MDTypography
                variant="button"
                fontWeight="medium"
                color="text"
                textTransform="capitalize"
              >
                {title}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              // placeholder={customerName.placeholder}
              options={customerListArray.map((addy) => addy.Customer)}
              renderInput={(params) => <MDInput {...params} variant="standard" />}
              onSelect={dropdown.action}
              value={dropdown.value}
            />
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

// Typechecking props for the DefaultStatisticsCard
DefaultStatisticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  CustomerList: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  dropdown: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      action: PropTypes.func,
      menu: PropTypes.node,
      value: PropTypes.string,
    }),
  ]).isRequired,
};

export default DefaultStatisticsCard;
