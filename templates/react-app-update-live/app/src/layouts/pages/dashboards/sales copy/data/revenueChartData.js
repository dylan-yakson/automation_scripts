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
const formatRevenueChartData = (analyticsData) => {
  console.log(analyticsData);
  const monthlyData = analyticsData; // analyticsData.monthlySummary.currentYear.orders;
  console.log(monthlyData);
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
  Object.keys(monthNames).map((month) => {
    const currentMonthLabel = `${monthNames[tmpDateObj.getMonth()]} ${tmpDateObj.getFullYear()}`;
    console.log(currentMonthLabel);
    const MonthToSearch = tmpDateObj;
    const MonthOrdersArray = [];
    let MonthlyOrderTotal = 0;

    monthlyData.map((order) => {
      const orderMonth = new Date(order.createdDate).getMonth();
      if (new Date(order.createdDate) >= MonthToSearch && orderMonth === tmpDateObj.getMonth()) {
        MonthOrdersArray.push(order);
        const tmpOrder = order;
        // console.log("TEMP ORDER");
        // console.log(tmpOrder);
        // eslint-disable-next-line no-restricted-syntax
        tmpOrder.requestPayload.items.items.map((OrderItem) => {
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
    return month;
  });

  console.log(responseLabels);
  console.log(responseValues);
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
};
export default formatRevenueChartData;
