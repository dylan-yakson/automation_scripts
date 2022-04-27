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
const getOrderQuantityDifferences = (currentSalesAnalytics, priorSalesAnalytics) => {
  // get Order Quantity Difference
  let orderQuantityString = "";
  let orderQuantityColor = "";
  const yearlyOrderQuantityDifference = getPercentageChange(
    currentSalesAnalytics.orders.length,
    priorSalesAnalytics.orders.length
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
const getCustomerCountDifferences = (currentSalesAnalytics, priorSalesAnalytics) => {
  const currentCustomerLength = currentSalesAnalytics.customers.length;
  const priorCustomerLength = priorSalesAnalytics.customers.length;

  let CustomerCountDifferencesString = "";
  let CustomerCountDifferencesColor = "";
  const yearlyOrderQuantityDifference = getPercentageChange(
    currentCustomerLength,
    priorCustomerLength
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
    currentData: currentCustomerLength,
    priorData: priorCustomerLength,
  };
};
const getRevenueDifferences = (currentSalesAnalytics, priorSalesAnalytics) => {
  const currentSalesTotal = currentSalesAnalytics.totalSales;
  const priorSalesTotal = priorSalesAnalytics.totalSales;
  let RevenueDifferencesString = "";
  let RevenueDifferencesColor = "";
  const yearlyOrderQuantityDifference = getPercentageChange(currentSalesTotal, priorSalesTotal);

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
    currentRevenue: currentSalesTotal,
    lastYearsRevenue: priorSalesTotal,
  };
};

export { getOrderQuantityDifferences, getCustomerCountDifferences, getRevenueDifferences };
