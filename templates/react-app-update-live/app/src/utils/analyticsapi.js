/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-multi-assign */
const generateAnalyticsDataFromOrders = (ordersJson) => {
  const currentYearOrderData = {
    Jan: [],
    Feb: [],
    Mar: [],
    Apr: [],
    May: [],
    Jun: [],
    Jul: [],
    Aug: [],
    Sep: [],
    Oct: [],
    Nov: [],
    Dec: [],
  };
  const oneYearPriorOrderData = {
    Jan: [],
    Feb: [],
    Mar: [],
    Apr: [],
    May: [],
    Jun: [],
    Jul: [],
    Aug: [],
    Sep: [],
    Oct: [],
    Nov: [],
    Dec: [],
  };
  const twoYearsPriorOrderData = {
    Jan: [],
    Feb: [],
    Mar: [],
    Apr: [],
    May: [],
    Jun: [],
    Jul: [],
    Aug: [],
    Sep: [],
    Oct: [],
    Nov: [],
    Dec: [],
  };

  const customersOrders = [];
  let productDataList = [];

  const priorCustomersOrders = [];
  let priorProductDataList = [];
  //  console.log(ordersJson);
  for (const each in ordersJson) {
    const orderItem = ordersJson[each];
    const orderDate = new Date(ordersJson[each].createdDate);
    // Date to filter orders for Customer / Products
    const filterDate = new Date(Date.now());

    filterDate.setFullYear(filterDate.getFullYear() - 1);

    const priorFilterDate = new Date(Date.now());
    priorFilterDate.setFullYear(filterDate.getFullYear() - 2);

    //  console.log(filterDate.toDateString()); // "Fri Oct 04 2019"
    // Current Year
    if (orderDate > filterDate) {
      // Product Analytics Data
      try {
        const order = ordersJson[each];
        const { items } = order.requestPayload.items;
        for (const OrderItemListIndex in items) {
          const currentProduct = items[OrderItemListIndex];
          const filteredproductDataList = productDataList.filter(
            (productListItem) => productListItem.ProdID === currentProduct.ID
          );
          if (filteredproductDataList[0]) {
            const currentProdObj = filteredproductDataList[0];
            let TotalOrderAmount = currentProdObj.TotalAmountPurchased;
            try {
              if (Number(currentProduct.PricePerGal) < 0.5) {
                currentProduct.PricePerGal = 1;
              }
              if (Number(currentProduct.Quantity) < 1) {
                currentProduct.PricePerGal = 1;
              }
              const RealPriceAmount =
                Number(currentProduct.PricePerGal) * Number(currentProduct.Quantity);
              TotalOrderAmount += RealPriceAmount;
            } catch (Error) {
              //  console.log("Trouble calculating real price of order");
              console.error(Error);
            }
            currentProdObj.TotalAmountPurchased += TotalOrderAmount;
            currentProdObj.orderCount += 1;
            currentProdObj.orders.push({
              customer: order.requestPayload.destination.Customer,
              PO: order.PO,
              createdDate: order.createdDate,
              deliveryDate: order.requestPayload.sales.deliveryDate,
              requestPayload: order.requestPayload,
            });
            productDataList = productDataList.map((productListItem) => {
              if (productListItem.ProdID === currentProduct.ID) {
                return currentProdObj;
              }
              return productListItem;
            });
          } else {
            let TotalOrderAmount = 0;
            try {
              if (Number(currentProduct.PricePerGal) < 0.5) {
                currentProduct.PricePerGal = 1;
              }
              if (Number(currentProduct.Quantity) < 1) {
                currentProduct.PricePerGal = 1;
              }
              const RealPriceAmount =
                Number(currentProduct.PricePerGal) * Number(currentProduct.Quantity);
              TotalOrderAmount += RealPriceAmount;
            } catch (Error) {
              //  console.log("Trouble calculating real price of order");
              //  console.log(Error);
            }
            const tmpObj = {
              ProdID: currentProduct.ID,
              ProdDescription: currentProduct.Description,
              TotalAmountPurchased: TotalOrderAmount, // order.TotalAmount,
              orderCount: 1,
              orders: [
                {
                  customer: order.requestPayload.destination.Customer,
                  PO: order.PO,
                  createdDate: order.createdDate,
                  deliveryDate: order.requestPayload.sales.deliveryDate,
                  requestPayload: order.requestPayload,
                },
              ],
            };
            productDataList.push(tmpObj);
          }
        }
      } catch (error) {
        //  console.log(error);
      }

      // Customer Analytics Data
      try {
        const order = ordersJson[each];
        const filteredCustomerOrders = customersOrders.filter(
          (customer) => customer.CustomerID === order.requestPayload.destination.CustomerID
        );
        //  console.log("FilteredCustomerList");
        //  console.log(filteredCustomerOrders);
        if (filteredCustomerOrders[0]) {
          const customerObj = filteredCustomerOrders[0];
          const customerProductsList = customerObj.products;

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
              //  console.log("Trouble calculating real price of order");
              //  console.log(Error);
            }
          }
          try {
            customerObj.TotalAmountPurchased += Number(TotalOrderAmount);
          } catch (error) {
            customerObj.TotalAmountPurchased += 0;
          }
          customerObj.orderCount = customerObj.orderCount += 1;
          customerObj.orders.push({
            PO: order.PO,
            createdDate: order.createdDate,
          });
          customersOrders.map((customer) => {
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
              //  console.log("Trouble calculating real price of order");
              //  console.log(Error);
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
          customersOrders.push(tmpObj);
        }
      } catch (error) {
        //  console.log(error);
      }
    }
    // Prior Year
    if (orderDate < filterDate && orderDate > priorFilterDate) {
      if (orderDate)
        // Product Analytics Data
        try {
          const order = ordersJson[each];
          const { items } = order.requestPayload.items;
          for (const OrderItemListIndex in items) {
            const currentProduct = items[OrderItemListIndex];
            const filteredpriorProductDataList = priorProductDataList.filter(
              (productListItem) => productListItem.ProdID === currentProduct.ID
            );
            if (filteredpriorProductDataList[0]) {
              const currentProdObj = filteredpriorProductDataList[0];
              let TotalOrderAmount = currentProdObj.TotalAmountPurchased;
              try {
                if (Number(currentProduct.PricePerGal) < 0.5) {
                  currentProduct.PricePerGal = 1;
                }
                if (Number(currentProduct.Quantity) < 1) {
                  currentProduct.PricePerGal = 1;
                }
                const RealPriceAmount =
                  Number(currentProduct.PricePerGal) * Number(currentProduct.Quantity);
                TotalOrderAmount += RealPriceAmount;
              } catch (Error) {
                //  console.log("Trouble calculating real price of order");
                //  console.log(Error);
              }
              currentProdObj.TotalAmountPurchased += TotalOrderAmount;
              currentProdObj.orderCount += 1;
              currentProdObj.orders.push({
                customer: order.requestPayload.destination.Customer,
                PO: order.PO,
                createdDate: order.createdDate,
                deliveryDate: order.requestPayload.sales.deliveryDate,
              });
              priorProductDataList = priorProductDataList.map((productListItem) => {
                if (productListItem.ProdID === currentProduct.ID) {
                  return currentProdObj;
                }
                return productListItem;
              });
            } else {
              let TotalOrderAmount = 0;
              try {
                if (Number(currentProduct.PricePerGal) < 0.5) {
                  currentProduct.PricePerGal = 1;
                }
                if (Number(currentProduct.Quantity) < 1) {
                  currentProduct.PricePerGal = 1;
                }
                const RealPriceAmount =
                  Number(currentProduct.PricePerGal) * Number(currentProduct.Quantity);
                TotalOrderAmount += RealPriceAmount;
              } catch (Error) {
                //  console.log("Trouble calculating real price of order");
                //  console.log(Error);
              }
              const tmpObj = {
                ProdID: currentProduct.ID,
                ProdDescription: currentProduct.Description,
                TotalAmountPurchased: TotalOrderAmount, // order.TotalAmount,
                orderCount: 1,
                orders: [
                  {
                    customer: order.requestPayload.destination.Customer,
                    PO: order.PO,
                    createdDate: order.createdDate,
                    deliveryDate: order.requestPayload.sales.deliveryDate,
                  },
                ],
              };
              priorProductDataList.push(tmpObj);
            }
          }
        } catch (error) {
          //  console.log(error);
        }

      // Customer Analytics Data
      try {
        const order = ordersJson[each];
        const filteredCustomerOrders = priorCustomersOrders.filter(
          (customer) => customer.CustomerID === order.requestPayload.destination.CustomerID
        );
        //  console.log("FilteredCustomerList");
        //  console.log(filteredCustomerOrders);
        if (filteredCustomerOrders[0]) {
          const customerObj = filteredCustomerOrders[0];
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
            } catch (Error) {
              //  console.log("Trouble calculating real price of order");
              //  console.log(Error);
            }
          }
          try {
            customerObj.TotalAmountPurchased += Number(TotalOrderAmount);
          } catch (error) {
            customerObj.TotalAmountPurchased += 0;
          }
          customerObj.orderCount = customerObj.orderCount += 1;
          customerObj.orders.push({
            PO: order.PO,
            createdDate: order.createdDate,
            requestPayload: order.requestPayload || order.order,
          });
          priorCustomersOrders.map((customer) => {
            if (customer.CustomerID === customerObj.CustomerID) {
              return customerObj;
            }
            return customer;
          });
          //   let tmpObj = {
          //       CustomerID: order.requestPayload.destination.CustomerID,
          //       Customer: order.requestPayload.destination.Customer,
          //       TotalAmountPurchased: order.TotalAmount,
          //       orderCount: 1,
          //       orders: [{
          //           PO: order.PO,
          //           createdDate: order.createdDate
          //       }]
          //   }
          //   priorCustomersOrders.push(tmpObj);
        } else {
          let TotalOrderAmount = 0;
          // eslint-disable-next-line no-restricted-syntax
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
            } catch (Error) {
              //  console.log("Trouble calculating real price of order");
              //  console.log(Error);
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
          };
          try {
            tmpObj.TotalAmountPurchased = tmpObj.TotalAmountPurchased += Number(order.TotalAmount);
          } catch (error) {
            tmpObj.TotalAmountPurchased = tmpObj.TotalAmountPurchased += 0;
          }
          priorCustomersOrders.push(tmpObj);
        }
      } catch (error) {
        //  console.log(error);
      }
    }
    const Year1PriorDate = new Date(Date.now());
    Year1PriorDate.setFullYear(Year1PriorDate.getFullYear() - 1);

    const Year2PriorDate = new Date(Date.now());
    Year2PriorDate.setFullYear(Year2PriorDate.getFullYear() - 2);

    const Year3PriorDate = new Date(Date.now());
    Year3PriorDate.setFullYear(Year3PriorDate.getFullYear() - 3);

    const orderMonth = orderDate.getMonth();

    if (orderDate > Year1PriorDate) {
      switch (orderMonth) {
        case 0:
          currentYearOrderData.Jan.push(orderItem);
          break;
        case 1:
          currentYearOrderData.Feb.push(orderItem);
          break;
        case 2:
          currentYearOrderData.Mar.push(orderItem);
          break;
        case 3:
          currentYearOrderData.Apr.push(orderItem);
          break;
        case 4:
          currentYearOrderData.May.push(orderItem);
          break;
        case 5:
          currentYearOrderData.Jun.push(orderItem);
          break;
        case 6:
          currentYearOrderData.Jul.push(orderItem);
          break;
        case 7:
          currentYearOrderData.Aug.push(orderItem);
          break;
        case 8:
          currentYearOrderData.Sep.push(orderItem);
          break;
        case 9:
          currentYearOrderData.Oct.push(orderItem);
          break;
        case 10:
          currentYearOrderData.Nov.push(orderItem);
          break;
        case 11:
          currentYearOrderData.Dec.push(orderItem);
          break;
        default:
          break;
      }
    } else if (orderDate < Year1PriorDate && orderDate > Year2PriorDate) {
      switch (orderMonth) {
        case 0:
          oneYearPriorOrderData.Jan.push(orderItem);
          break;
        case 1:
          oneYearPriorOrderData.Feb.push(orderItem);
          break;
        case 2:
          oneYearPriorOrderData.Mar.push(orderItem);
          break;
        case 3:
          oneYearPriorOrderData.Apr.push(orderItem);
          break;
        case 4:
          oneYearPriorOrderData.May.push(orderItem);
          break;
        case 5:
          oneYearPriorOrderData.Jun.push(orderItem);
          break;
        case 6:
          oneYearPriorOrderData.Jul.push(orderItem);
          break;
        case 7:
          oneYearPriorOrderData.Aug.push(orderItem);
          break;
        case 8:
          oneYearPriorOrderData.Sep.push(orderItem);
          break;
        case 9:
          oneYearPriorOrderData.Oct.push(orderItem);
          break;
        case 10:
          oneYearPriorOrderData.Nov.push(orderItem);
          break;
        case 11:
          oneYearPriorOrderData.Dec.push(orderItem);
          break;
        default:
          break;
      }
    } else if (orderDate < Year2PriorDate && orderDate > Year3PriorDate) {
      switch (orderMonth) {
        case 0:
          twoYearsPriorOrderData.Jan.push(orderItem);
          break;
        case 1:
          twoYearsPriorOrderData.Feb.push(orderItem);
          break;
        case 2:
          twoYearsPriorOrderData.Mar.push(orderItem);
          break;
        case 3:
          twoYearsPriorOrderData.Apr.push(orderItem);
          break;
        case 4:
          twoYearsPriorOrderData.May.push(orderItem);
          break;
        case 5:
          twoYearsPriorOrderData.Jun.push(orderItem);
          break;
        case 6:
          twoYearsPriorOrderData.Jul.push(orderItem);
          break;
        case 7:
          twoYearsPriorOrderData.Aug.push(orderItem);
          break;
        case 8:
          twoYearsPriorOrderData.Sep.push(orderItem);
          break;
        case 9:
          twoYearsPriorOrderData.Oct.push(orderItem);
          break;
        case 10:
          twoYearsPriorOrderData.Nov.push(orderItem);
          break;
        case 11:
          twoYearsPriorOrderData.Dec.push(orderItem);
          break;
        default:
          break;
      }
    }
  }
  const monthlyDataTmpObject = {
    currentYear: {},
    oneYearPrior: {},
    twoYearPrior: {},
  };
  // Current Year
  // Loop Through Monthly Data
  let currentYearOrderTotal = 0;
  Object.keys(currentYearOrderData).map((month) => {
    const monthlyData = currentYearOrderData[month];
    currentYearOrderTotal += monthlyData.length;
    return monthlyData.length;
  });
  monthlyDataTmpObject.currentYear = {
    orders: currentYearOrderData,
    totalOrders: currentYearOrderTotal,
  };

  // Prior Year
  // Loop Through Monthly Data
  let priorYearOrderTotal = 0;
  Object.keys(oneYearPriorOrderData).map((month) => {
    const monthlyData = oneYearPriorOrderData[month];
    priorYearOrderTotal += monthlyData.length;
    return monthlyData.length;
  });
  monthlyDataTmpObject.oneYearPrior = {
    orders: oneYearPriorOrderData,
    totalOrders: priorYearOrderTotal,
  };

  // Two years Ago
  let secondPriorYearOrderTotal = 0;
  Object.keys(twoYearsPriorOrderData).map((month) => {
    const monthlyData = twoYearsPriorOrderData[month];
    secondPriorYearOrderTotal += monthlyData.length;
    return monthlyData.length;
  });
  monthlyDataTmpObject.twoYearPrior = {
    orders: twoYearsPriorOrderData,
    totalOrders: secondPriorYearOrderTotal,
  };
  // currentYearOrderData
  // oneYearPriorOrderData
  // twoYearsPriorOrderData

  const responseData = {
    customerData: customersOrders,
    productData: productDataList,
    priorCustomerData: priorCustomersOrders,
    priorProductData: priorProductDataList,
    monthlySummary: monthlyDataTmpObject,
  };

  return responseData;
};

export default generateAnalyticsDataFromOrders;
