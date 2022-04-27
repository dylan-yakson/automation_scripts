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
  const monthlyData = analyticsData.monthlySummary.currentYear.orders;
  const labels = Object.keys(monthlyData);
  const revenueTotalsArray = [];
  labels.map((label) => {
    const monthlySalesData = monthlyData[label];
    let MonthlyOrderTotal = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const orderIndex in monthlySalesData) {
      const tmpOrder = monthlySalesData[orderIndex];
      // console.log("TEMP ORDER");
      // console.log(tmpOrder);
      // eslint-disable-next-line no-restricted-syntax
      for (const orderItemIndex in tmpOrder.requestPayload.items.items) {
        const OrderItem = tmpOrder.requestPayload.items.items[orderItemIndex];
        // console.log(OrderItem);
        try {
          const RealPriceAmount = Number(OrderItem.PricePerGal) * Number(OrderItem.Quantity);
          MonthlyOrderTotal += RealPriceAmount;
        } catch (Error) {
          // console.log(Error);
        }
      }
    }
    revenueTotalsArray.push(MonthlyOrderTotal);
    return label;
  });
  return {
    labels,
    datasets: [{ label: "Montly Order Totals", data: revenueTotalsArray }],
  };
};
export default formatRevenueChartData;
