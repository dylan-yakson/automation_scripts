/* eslint-disable no-unused-vars */
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

const formatCustomerRevenueData = (customerOrderData) => {
  // const data = analyticsData.customerData;
  // data.sort((a, b) => a.TotalAmountPurchased < b.TotalAmountPurchased);
  const Year1PriorDate = new Date(Date.now());
  Year1PriorDate.setFullYear(Year1PriorDate.getFullYear() - 1);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const tmpDateObj = new Date();
  tmpDateObj.setDate(1);
  const responseLabels = [];
  const responseValues = [];
  for (const month in monthNames) {
    const currentMonthLabel = `${monthNames[tmpDateObj.getMonth()]} ${tmpDateObj.getFullYear()}`;
    console.log(currentMonthLabel);
    const MonthToSearch = tmpDateObj;
    const MonthOrdersArray = [];
    let MonthlyOrderTotal = 0;

    customerOrderData.map((order) => {
      const orderMonth = new Date(order.createdDate).getMonth();
      if (new Date(order.createdDate) > MonthToSearch && orderMonth === tmpDateObj.getMonth()) {
        MonthOrdersArray.push(order);
        const tmpOrder = order;
        // console.log("TEMP ORDER");
        // console.log(tmpOrder);
        // eslint-disable-next-line no-restricted-syntax
        tmpOrder.order.items.items.map((OrderItem) => {
          try {
            const RealPriceAmount = Number(OrderItem.PricePerGal) * Number(OrderItem.Quantity);
            MonthlyOrderTotal += RealPriceAmount;
          } catch (Error) {
            // console.log(Error);
          }
          return OrderItem;
        });
      }
      return order;
    });
    responseLabels.push(currentMonthLabel);
    responseValues.push(MonthlyOrderTotal);
    tmpDateObj.setMonth(tmpDateObj.getMonth() - 1);
  }

  console.log(responseLabels);
  console.log(responseValues);
  // Turn 2 arrays into a single object
  const combineArrays = (first, second) =>
    first.reduce((acc, val, ind) => {
      acc[val] = second[ind];
      return acc;
    }, {});
  console.log(combineArrays(responseLabels, responseValues));
  return {
    responseLabels,
    datasets: [
      { label: "Montly Order Totals", data: combineArrays(responseLabels, responseValues) },
    ],
  };

  // for (const customerDataIndex in top6Customers) {
  //   const customer = top6Customers[customerDataIndex];
  //   if (customer.Customer && customer.Customer.length > 0) {
  //     labels.push(customer.Customer.slice(0, 25));
  //     customerOrderTotalData.push(customer.TotalAmountPurchased);
  //   }
  // }

  // const tmpResponseObj = {
  //   labels,
  //   datasets: {
  //     label: "Projects",
  //     backgroundColors: ["info", "error", "dark", "secondary", "primary", "green", "yellow"],
  //     data: customerOrderTotalData,
  //   },
  // };
  // return tmpResponseObj;
};

export default formatCustomerRevenueData;
