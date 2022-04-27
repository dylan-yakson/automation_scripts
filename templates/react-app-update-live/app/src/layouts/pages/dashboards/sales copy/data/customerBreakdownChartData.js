/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
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
// {
//   labels: ["Facebook", "Direct", "Organic", "Referral"],
//   datasets: {
//     label: "Projects",
//     backgroundColors: ["info", "primary", "dark", "secondary", "primary"],
//     data: [15, 20, 12, 60],
//   },
// };

const formatCustomerBreakdownData = (analyticsData) => {
  const { customerData } = analyticsData;
  const labels = [];
  const customerOrderTotalData = [];
  const data = customerData
    .sort((a, b) => {
      if (a.TotalAmountPurchased < b.TotalAmountPurchased) {
        return 1;
      }
      return -1;
    })
    .filter((item) => item.Customer !== "");

  // const data = analyticsData.customerData;
  // data.sort((a, b) => a.TotalAmountPurchased < b.TotalAmountPurchased);
  const top6Customers = data.slice(0, 5);
  for (const customerDataIndex in top6Customers) {
    const customer = top6Customers[customerDataIndex];
    if (customer.Customer && customer.Customer.length > 0) {
      labels.push(customer.Customer.slice(0, 25));
      customerOrderTotalData.push(customer.TotalAmountPurchased);
    }
  }

  const tmpResponseObj = {
    labels,
    datasets: {
      label: "Projects",
      backgroundColors: ["info", "error", "dark", "secondary", "primary", "green", "yellow"],
      data: customerOrderTotalData,
    },
  };
  return tmpResponseObj;
};

export default formatCustomerBreakdownData;
