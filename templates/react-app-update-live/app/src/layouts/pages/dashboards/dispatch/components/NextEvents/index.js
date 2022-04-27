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

import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";
import Icon from "@mui/material/Icon";

import defaultItemIconBox from "layouts/pages/dashboards/dispatch/components/NextEvents/styles";

// Material Dashboard 2 PRO React example components
// import DefaultItem from "examples/Items/DefaultItem";

// eslint-disable-next-line no-unused-vars
function NextEvents({ orders, onClickFunction }) {
  const [top5Events, setTop5Events] = useState(null);

  useEffect(() => {
    orders.sort((a, b) => {
      if (a.deliveryDate < b.deliveryDate) {
        return 1;
      }
      return -1;
    });
    const tmpOrders = orders.splice(0, 5);
    setTop5Events(tmpOrders);
    console.log("NEXT EVENTS ORDERS");
    console.log(tmpOrders);
  }, []);
  const eventClickFunction = (event) => {
    console.log(event);
    const eventTitle = event.title;
    const eventStartDate = event.start;
    onClickFunction(
      <MDAlert color="dark">
        Delivery for {eventTitle} @ {new Date(eventStartDate).toDateString()}
        <MDAlertCloseIcon
          onClick={() => {
            onClickFunction(null);
          }}
        >
          &times;
        </MDAlertCloseIcon>
      </MDAlert>
    );
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Upcoming Deliveries
        </MDTypography>
      </MDBox>
      {top5Events ? (
        <MDBox p={2}>
          {top5Events.map((event) => (
            <MDBox mt={3.5}>
              <MDBox
                display="flex"
                alignItems="center"
                onClick={() => {
                  eventClickFunction(event);
                }}
              >
                <MDBox sx={(theme) => defaultItemIconBox(theme, { color: "info" })}>
                  <Icon>menu_book</Icon>
                </MDBox>
                <MDBox ml={2} mt={0.5} lineHeight={1.4}>
                  <MDTypography display="block" variant="button" fontWeight="medium">
                    {event.title}
                  </MDTypography>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    {new Date(event.start).toDateString()}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          ))}
        </MDBox>
      ) : (
        <></>
      )}
    </Card>
  );
}
// Typechecking props for the DefaultCell
NextEvents.propTypes = {
  orders: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  onClickFunction: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default NextEvents;
