/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-multi-assign */
const pullOrderAnalyticsWithinTwoDates = (ordersJson, orderSearchStartDate, orderSearchEndDate) => {
  const ordersArrayToReturn = [];
  const customersArrayToReturn = [];
  const productsArrayToReturn = [];
  let totalSales = 0;
  ordersJson.map((order) => {
    const orderDate = new Date(order.createdDate);
    const orderCustomerID = order.requestPayload.destination.CustomerID;
    // Check if Order is within the 2 provided Dates
    if (orderDate >= orderSearchStartDate && orderDate <= orderSearchEndDate) {
      ordersArrayToReturn.push(order);
      // START CUSTOMERS
      const filteredCustomerOrders = customersArrayToReturn.filter(
        (customer) => customer.CustomerID === orderCustomerID
      );
      const customerObj = filteredCustomerOrders[0];

      if (filteredCustomerOrders[0]) {
        const customerProductsList = customerObj.products;
        // START CUSTOMER SNIPPET
        let TotalOrderAmount = 0;

        for (const orderItemIndex in order.requestPayload.items.items) {
          const OrderItem = order.requestPayload.items.items[orderItemIndex];
          try {
            if (Number(OrderItem.PricePerGal) < 0.5) {
              OrderItem.PricePerGal = 1;
            }
            if (Number(OrderItem.Quantity) < 1) {
              OrderItem.PricePerGal = 1;
            }
            const RealPriceAmount = Number(OrderItem.PricePerGal) * Number(OrderItem.Quantity);
            TotalOrderAmount += RealPriceAmount;

            const filteredcustomerProductsList = customerProductsList.filter(
              (productSummaryItem) => productSummaryItem.itemDesc === OrderItem.Description
            );
            if (filteredcustomerProductsList[0]) {
              const tmpProduct = filteredcustomerProductsList[0];
              tmpProduct.orderCount += 1;
              tmpProduct.totalAmountSpent += RealPriceAmount;
              customerObj.products.map((product) => {
                if (product.itemDesc === OrderItem.Description) {
                  return tmpProduct;
                }
                return product;
              });
            } else {
              const customerOrderItemTmp = {
                orderCount: 1,
                totalAmountSpent: RealPriceAmount,
                itemDesc: OrderItem.Description,
              };
              customerObj.products.push(customerOrderItemTmp);
            }
          } catch (Error) {
            console.log("Trouble calculating real price of order");
            console.log(Error);
          }
        }
        try {
          customerObj.TotalAmountPurchased += Number(TotalOrderAmount);
        } catch (error) {
          console.log(error);
          customerObj.TotalAmountPurchased += 0;
        }
        customerObj.orderCount = customerObj.orderCount += 1;
        customerObj.orders.push(order);
        customersArrayToReturn.map((customer) => {
          if (customer.CustomerID === customerObj.CustomerID) {
            return customerObj;
          }
          return customer;
        });
      } else {
        const customerOrderItemProducts = [];
        let TotalOrderAmount = 0;
        for (const orderItemIndex in order.requestPayload.items.items) {
          const OrderItem = order.requestPayload.items.items[orderItemIndex];

          try {
            if (Number(OrderItem.PricePerGal) < 0.5) {
              OrderItem.PricePerGal = 1;
            }
            if (Number(OrderItem.Quantity) < 1) {
              OrderItem.PricePerGal = 1;
            }
            const RealPriceAmount = Number(OrderItem.PricePerGal) * Number(OrderItem.Quantity);
            TotalOrderAmount += RealPriceAmount;
            const customerOrderItemTmp = {
              orderCount: 1,
              totalAmountSpent: RealPriceAmount,
              itemDesc: OrderItem.Description,
            };
            customerOrderItemProducts.push(customerOrderItemTmp);
          } catch (Error) {
            console.log("Trouble calculating real price of order");
            console.log(Error);
          }
        }
        const tmpObj = {
          CustomerID: order.requestPayload.destination.CustomerID,
          Customer: order.requestPayload.destination.Customer,
          TotalAmountPurchased: TotalOrderAmount, // order.TotalAmount,
          orderCount: 1,
          orders: [
            {
              PO: order.PO,
              createdDate: order.createdDate,
              deliveryDate: order.requestPayload.sales.deliveryDate,
              requestPayload: order.requestPayload || order.order,
            },
          ],
          products: customerOrderItemProducts,
        };
        try {
          tmpObj.TotalAmountPurchased = tmpObj.TotalAmountPurchased += Number(order.TotalAmount);
        } catch (error) {
          tmpObj.TotalAmountPurchased = tmpObj.TotalAmountPurchased += 0;
        }
        customersArrayToReturn.push(tmpObj);
      }
      // END CUSTOMERS
      // START PRODUCTS
      for (const orderItemIndex in order.requestPayload.items.items) {
        const OrderItem = order.requestPayload.items.items[orderItemIndex];
        if (Number(OrderItem.PricePerGal) < 0.5) {
          OrderItem.PricePerGal = 1;
        }
        if (Number(OrderItem.Quantity) < 1) {
          OrderItem.PricePerGal = 1;
        }
        const RealPriceAmount = Number(OrderItem.PricePerGal) * Number(OrderItem.Quantity);
        totalSales += RealPriceAmount;
        try {
          const filteredProductDataList = productsArrayToReturn.filter(
            (productSummaryItem) => productSummaryItem.itemDesc === OrderItem.Description
          );
          if (filteredProductDataList[0]) {
            const tmpProduct = filteredProductDataList[0];
            tmpProduct.orderCount += 1;
            tmpProduct.totalAmountSpent += RealPriceAmount;
          } else {
            const customerOrderItemTmp = {
              orderCount: 1,
              totalAmountSpent: RealPriceAmount,
              itemDesc: OrderItem.Description,
            };
            productsArrayToReturn.push(customerOrderItemTmp);
          }
        } catch (Error) {
          console.log("Trouble calculating real price of order");
          console.log(Error);
        }
      }
      // END PRODUCTS
    }
    return order;
  });
  return {
    orders: ordersArrayToReturn,
    customers: customersArrayToReturn,
    products: productsArrayToReturn,
    totalSales,
  };
};

export default pullOrderAnalyticsWithinTwoDates;
