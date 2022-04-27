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
function getMonthName(monthIndex) {
  // An array containing the name of each month.
  const months = [
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
  return months[monthIndex];
}
const formatRevenueChartData = (warehouseOrders) => {
  console.log(warehouseOrders);
  const monthlyData = warehouseOrders; // analyticsData.monthlySummary.currentYear.orders;
  const CurrentDate = new Date(Date.now());
  CurrentDate.setDate(1);
  const LastMonthPriorDate = new Date(Date.now());
  LastMonthPriorDate.setMonth(LastMonthPriorDate.getMonth() - 1);

  const TwoMonthPriorDate = new Date(Date.now());
  TwoMonthPriorDate.setMonth(TwoMonthPriorDate.getMonth() - 2);
  TwoMonthPriorDate.setDate(1);

  const ThreeMonthPriorDate = new Date(Date.now());
  // Year1PriorDate.setFullYear(Year1PriorDate.getFullYear() - 1);
  ThreeMonthPriorDate.setMonth(ThreeMonthPriorDate.getMonth() - 3);
  const monthDates = [CurrentDate, LastMonthPriorDate, TwoMonthPriorDate];
  console.log(monthDates);
  const monthNames = [
    getMonthName(CurrentDate.getMonth()),
    getMonthName(LastMonthPriorDate.getMonth()),
    getMonthName(TwoMonthPriorDate.getMonth()),
  ];

  console.log(monthNames);

  const responseLabels = [];
  const responseValues = [];
  monthDates.map((date) => {
    const currentMonthLabel = `${getMonthName(date.getMonth())} ${date.getFullYear()}`;
    console.log(currentMonthLabel);
    const MonthOrdersArray = [];
    let MonthlyOrderTotal = 0;
    monthlyData.map((order) => {
      const orderMonth = new Date(order.createdDate).getMonth();
      console.log(`Checking ${getMonthName(orderMonth)} - ${getMonthName(date.getMonth())}`);
      if (
        new Date(order.createdDate).getFullYear() === date.getFullYear() &&
        getMonthName(orderMonth) === getMonthName(date.getMonth())
      ) {
        console.log("FOUND MATCHING ORDER");
        MonthOrdersArray.push(order);
        const tmpOrder = order;
        console.log(tmpOrder);
        // console.log("TEMP ORDER");
        // console.log(tmpOrder);
        // eslint-disable-next-line no-restricted-syntax
        tmpOrder.requestPayload.items.items.map((OrderItem) => {
          try {
            const RealPriceAmount = Number(OrderItem.PricePerGal) * Number(OrderItem.Quantity);
            MonthlyOrderTotal += RealPriceAmount;
          } catch (Error) {
            console.log(Error);
          }
          return OrderItem;
        });
        return order;
      }
      return order;
    });
    responseLabels.push(currentMonthLabel);
    responseValues.push(MonthlyOrderTotal);
    return date;
  });
  // Object.keys(monthNames).map((month) => {
  //   console.log(month);
  //   const currentMonthLabel = `${monthNames[month]} ${monthDates[month].getFullYear()}`;
  //   console.log(currentMonthLabel);
  //   const MonthOrdersArray = [];
  //   let MonthlyOrderTotal = 0;

  //   // eslint-disable-next-line array-callback-return
  //   monthlyData.map((order) => {
  //     const orderMonth = new Date(order.createdDate).getMonth();
  //     console.log(`Checking ${getMonthName(orderMonth)} - ${monthDates[month]}`);
  //     if (
  //       new Date(order.createdDate) >= ThreeMonthPriorDate &&
  //       getMonthName(orderMonth) === monthNames[month]
  //     ) {
  //       console.log("FOUND MATCHING ORDER");
  //       MonthOrdersArray.push(order);
  //       const tmpOrder = order;
  //       console.log(tmpOrder);
  //       // console.log("TEMP ORDER");
  //       // console.log(tmpOrder);
  //       // eslint-disable-next-line no-restricted-syntax
  //       tmpOrder.requestPayload.items.items.map((OrderItem) => {
  //         try {
  //           const RealPriceAmount = Number(OrderItem.PricePerGal) * Number(OrderItem.Quantity);
  //           MonthlyOrderTotal += RealPriceAmount;
  //         } catch (Error) {
  //           console.log(Error);
  //         }
  //         return OrderItem;
  //       });
  //       return order;
  //     }
  //     responseLabels.push(currentMonthLabel);
  //     responseValues.push(MonthlyOrderTotal);
  //     return order;
  //   });
  //   return month;
  // });

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
