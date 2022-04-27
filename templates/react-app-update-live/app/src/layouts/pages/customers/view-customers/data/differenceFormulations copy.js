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
  // const decreaseValue = oldNumber - newNumber;
  // return Number((decreaseValue / oldNumber) * 100 * -1).toFixed(2);
  return Number((newNumber / oldNumber) * 100).toFixed(2);
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
const getRevenueDifferences = (customerOrderData) => {
  // const data = analyticsData.customerData;
  // data.sort((a, b) => a.TotalAmountPurchased < b.TotalAmountPurchased);
  const currentMonthsOrders = [];
  let currentMonthOrderTotal = 0;
  const lastMonthsOrders = [];
  let lastMonthOrderTotal = 0;
  const currentDate = new Date(Date.now());
  const currentMonth = currentDate.getMonth();
  customerOrderData.map((order) => {
    const orderMonth = new Date(order.createdDate).getMonth();
    if (orderMonth === currentMonth) {
      currentMonthsOrders.push(order);
      order.order.items.items.map((item) => {
        // console.log(OrderItem);
        try {
          const RealPriceAmount = Number(item.PricePerGal) * Number(item.Quantity);
          currentMonthOrderTotal += RealPriceAmount;
        } catch (Error) {
          currentMonthOrderTotal += 0;
          // console.log(Error);
        }
        return item;
      });
    } else if (orderMonth === currentMonth - 1) {
      lastMonthsOrders.push(order);
      order.order.items.items.map((item) => {
        // console.log(OrderItem);
        try {
          const RealPriceAmount = Number(item.PricePerGal) * Number(item.Quantity);
          lastMonthOrderTotal += RealPriceAmount;
        } catch (Error) {
          currentMonthOrderTotal += 0;
          // console.log(Error);
        }
        return item;
      });
    }
    return order;
  });

  const currentYear = currentMonthOrderTotal; // getYearlyRevenue(analyticsData.monthlySummary.currentYear.orders);
  const priorYear = lastMonthOrderTotal; // getYearlyRevenue(analyticsData.monthlySummary.oneYearPrior.orders);

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
    count: currentYear,
    lastYearsRevenue: priorYear,
  };
};

export { getOrderQuantityDifferences, getCustomerCountDifferences, getRevenueDifferences };
