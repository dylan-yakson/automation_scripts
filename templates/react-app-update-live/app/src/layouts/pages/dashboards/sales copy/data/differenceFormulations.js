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
function getPercentageChange(newNumber, oldNumber) {
  const decreaseValue = oldNumber - newNumber;
  return Number((decreaseValue / oldNumber) * 100 * -1).toFixed(2);
  // return Number((newNumber / oldNumber) * 100).toFixed(2);
}
const getOrderQuantityDifferences = (analyticsData) => {
  // get Order Quantity Difference
  let orderQuantityString = "";
  let orderQuantityColor = "";
  const yearlyOrderQuantityDifference = getPercentageChange(
    analyticsData.monthlySummary.currentYear.totalOrders,
    analyticsData.monthlySummary.oneYearPrior.totalOrders
  );
  console.log(yearlyOrderQuantityDifference);
  if (yearlyOrderQuantityDifference > 0) {
    orderQuantityString = `+${yearlyOrderQuantityDifference}%`; // `-${yearlyOrderQuantityDifference}`;
    orderQuantityColor = "success";
  } else if (yearlyOrderQuantityDifference < 0) {
    orderQuantityString = `${yearlyOrderQuantityDifference}%`; // `-${yearlyOrderQuantityDifference}`;
    orderQuantityColor = "error";
  } else {
    orderQuantityString = `${yearlyOrderQuantityDifference}%`; // `${yearlyOrderQuantityDifference}`;
    orderQuantityColor = "secondary";
  }
  return { label: orderQuantityString, color: orderQuantityColor };
};
const getYearlyRevenue = (yearlySummaryData) => {
  console.log("YEARLY SUMMARY DATA");
  console.log(yearlySummaryData);
  const monthlyData = yearlySummaryData;
  const labels = Object.keys(monthlyData);
  const revenueTotalsArray = [];
  let yearlyRevenueTotal = 0;
  labels.map((label) => {
    const monthlySalesData = monthlyData[label];
    const MonthlyOrderTotal = 0;
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
          yearlyRevenueTotal += RealPriceAmount;
        } catch (Error) {
          // console.log(Error);
        }
      }
    }
    revenueTotalsArray.push(MonthlyOrderTotal);
    return label;
  });
  return yearlyRevenueTotal;
};

const getCustomerCountDifferences = (analyticsData) => {
  const currentCustomerCount = analyticsData.customerData.length;
  const priorCustomerCount = analyticsData.priorCustomerData.length;

  let CustomerCountDifferencesString = "";
  let CustomerCountDifferencesColor = "";
  const yearlyOrderQuantityDifference = getPercentageChange(
    currentCustomerCount,
    priorCustomerCount
  );

  // ) Number(
  //   (currentCustomerCount - priorCustomerCount) / currentCustomerCount * 100 - 100
  // ).toFixed(2);
  if (yearlyOrderQuantityDifference > 0) {
    CustomerCountDifferencesString = `+${yearlyOrderQuantityDifference}%`; // `-${yearlyOrderQuantityDifference}`;
    CustomerCountDifferencesColor = "success";
  } else if (yearlyOrderQuantityDifference < 0) {
    CustomerCountDifferencesString = `${yearlyOrderQuantityDifference}%`; // `-${yearlyOrderQuantityDifference}`;
    CustomerCountDifferencesColor = "error";
  } else {
    CustomerCountDifferencesString = `${yearlyOrderQuantityDifference}%`; // `${yearlyOrderQuantityDifference}`;
    CustomerCountDifferencesColor = "secondary";
  }
  return {
    label: CustomerCountDifferencesString,
    color: CustomerCountDifferencesColor,
    currentData: analyticsData.customerData.length,
    priorData: priorCustomerCount,
  };
};
const getRevenueDifferences = (analyticsData) => {
  const currentYear = getYearlyRevenue(analyticsData.monthlySummary.currentYear.orders);
  const priorYear = getYearlyRevenue(analyticsData.monthlySummary.oneYearPrior.orders);

  let RevenueDifferencesString = "";
  let RevenueDifferencesColor = "";
  const yearlyOrderQuantityDifference = getPercentageChange(currentYear, priorYear);

  if (yearlyOrderQuantityDifference > 0) {
    RevenueDifferencesString = `+${yearlyOrderQuantityDifference}%`; // `-${yearlyOrderQuantityDifference}`;
    RevenueDifferencesColor = "success";
  } else if (yearlyOrderQuantityDifference < 0) {
    RevenueDifferencesString = `${yearlyOrderQuantityDifference}%`; // `-${yearlyOrderQuantityDifference}`;
    RevenueDifferencesColor = "error";
  } else {
    RevenueDifferencesString = `${yearlyOrderQuantityDifference}%`; // `${yearlyOrderQuantityDifference}`;
    RevenueDifferencesColor = "secondary";
  }
  return {
    label: RevenueDifferencesString,
    color: RevenueDifferencesColor,
    currentRevenue: currentYear,
    lastYearsRevenue: priorYear,
  };
};

export { getOrderQuantityDifferences, getCustomerCountDifferences, getRevenueDifferences };
