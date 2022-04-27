import axios from "axios";

const pullProducts = () => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/getProducts",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const products = response.data;
      return products;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const pullProductPackages = (productId) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/getProductPackages",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      id: productId,
    },
  };

  return axios(config)
    .then((response) => {
      console.log(JSON.stringify(response));
      const products = response.data;
      return products;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const pullPreviousPrices = (userEmail, productId, productPackage = "") => {
  const config = {
    method: "post",
    url: "https://kp01-01.com:1880/api/getProductPreviousPrices",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
      id: productId,
      package: productPackage,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const products = response.data;
      return products;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const sendCustomerAddressRequestEmail = (userEmail, Address) => {
  console.log(Address);
  const config = {
    method: "post",
    url: "https://kp01-01.com:1880/api/sendCustomerAddressCreationEmail",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
    data: JSON.stringify(Address),
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const sendQuoteConfirmationEmail = (userEmail, externalEmail, orderType, orderNumber) => {
  const config = {
    method: "post",
    url: "https://kp01-01.com:1880/api/resendQuoteEmail",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
      externalEmail,
      orderType,
      ordernumber: orderNumber,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const sendOrderConfirmationEmail = (userEmail, externalEmail, orderType, orderNumber) => {
  const config = {
    method: "post",
    url: "https://kp01-01.com:1880/api/resendOrderEmail",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
      externalEmail,
      orderType,
      ordernumber: orderNumber,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const pullAllOrders = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/pullAllOrders",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const setViewedAnnouncements = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/viewedAnnouncements",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const pullAnnouncements = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/pullAnnouncements",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const pullWarehouseOrders = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/pullOrders",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const pullSiteToSiteOrders = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/pullSiteToSiteOrders",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const pullWarehouseQuotes = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/pullQuotes",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const pullFuelOrders = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/pullFuelOrders",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const pullFuelQuotes = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/pullFuelQuotes",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const pullMonthlySalesAnalytics = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/orderapp/salesCustomersAnalytics",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      console.log(response);
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const pullMonthlySalesAnalyticsFuel = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/orderapp/salesCustomersAnalyticsFuel",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      console.log(response);
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const pullWarehouseDispatchOrders = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/orderapp/pullWarehouseOrdersBySalesman",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      console.log(response);
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const pullOrderStatus = (userEmail) => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/pullOrdersStatusByEmail",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      email: userEmail,
    },
  };

  return axios(config)
    .then((response) => {
      console.log(response);
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const pullCustomerAddresses = () => {
  const config = {
    method: "get",
    url: "https://kp01-01.com:1880/api/getCustomerAddresses",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
    },
  };

  return axios(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      const orders = response.data;
      return orders;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const pullOriginWarehouses = () => {
  const originAddresses = [
    {
      id: 0,
      address: `1558 N Lasalle ST\nNavasota TX, 77868
    `,
      name: "Navasota Warehouse",
    },
    {
      id: 1,
      address: `4 Plaza Loreto Esquina\nNoreste antiguo Edificio AID\nSAN Jose, Costa Rica
    `,
      name: "Costa Rica Warehouse",
    },
    { id: 2, address: `5002 E Harrison Ave.\nHarlingen, TX 78550`, name: "Harlingen Warehouse" },
  ];
  return originAddresses;
};
const submitOrder = (order, orderType) => {
  const orderSubmitConfig = {
    method: "post",
    url: "https://kp01-01.com:1880/api/submitOrder",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      orderType: orderType || "warehouse",
      "Content-Type": "application/json",
    },
    data: JSON.stringify(order),
  };

  return axios(orderSubmitConfig)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const submitSiteToSiteOrder = (order, orderType) => {
  const orderSubmitConfig = {
    method: "post",
    url: "https://kp01-01.com:1880/api/submitSiteToSiteOrder",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      orderType: orderType || "warehouse",
      "Content-Type": "application/json",
    },
    data: JSON.stringify(order),
  };

  return axios(orderSubmitConfig)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const submitQuote = (order, orderType) => {
  const orderSubmitConfig = {
    method: "post",
    url: "https://kp01-01.com:1880/api/submitQuote",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      orderType: orderType || "warehouse",
      "Content-Type": "application/json",
    },
    data: JSON.stringify(order),
  };

  return axios(orderSubmitConfig)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const updateOrder = (order, orderType, orderNumber) => {
  const orderSubmitConfig = {
    method: "post",
    url: "https://kp01-01.com:1880/api/editOrder",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      ordertype: orderType || "warehouse",
      ordernumber: orderNumber,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(order),
  };

  return axios(orderSubmitConfig)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const updateQuote = (order, orderType, orderNumber) => {
  const orderSubmitConfig = {
    method: "post",
    url: "https://kp01-01.com:1880/api/editQuote",
    headers: {
      apikey: process.env.REACT_APP_NODE_KEY,
      ordertype: orderType || "warehouse",
      ordernumber: orderNumber,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(order),
  };

  return axios(orderSubmitConfig)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
const convertOrderFormat = (initialOrder) => {
  console.log("CONVERTING ORDER FORMAT");
  console.log(initialOrder);
  const orderTemplate = {
    sales: {
      firstname: initialOrder.salesName.split(" ")[0] || initialOrder.salesName,
      lastname: initialOrder.salesName.split(" ")[1] || initialOrder.salesName,
      email: initialOrder.salesEmail,
      quotenum: initialOrder.quoteNum,
      quoteType: initialOrder.isQuoteOrOrder,
      deliveryDate: initialOrder.deliveryByDate[0] || initialOrder.deliveryByDate,
      phoneNumber: "",
      salesmanID: 0,
      customerType: initialOrder.customerType,
      custTypeID: initialOrder.customerTypeId,
    },
    origin: {
      OriginAddress: initialOrder.originAddress,
    },
    destination: {
      Address1: initialOrder.destinationAddress1,
      State: initialOrder.destinationState || "",
      City: initialOrder.destinationCity,
      ZipCode: initialOrder.destinationZip,
      Customer: initialOrder.customerName,
      CustomerID: initialOrder.customerId,
      LocationID: initialOrder.customerLocationID,
    },
    items: {
      PurchaseOrderNumber: initialOrder.quoteNum,
      customerEmail: "", // TODO
      items: initialOrder.orderItems.map((item) => {
        const tmpObj = {
          Description: item.Description,
          ID: item.ID,
          Package: item.Package,
          PackageID: 1,
          Quantity: item.Quantity,
          PricePerGal: item.Price,
        };
        return tmpObj;
      }),
      lineItemTotal: 0,
      containerShipment: initialOrder.containerShipment || false,
      containerNumber: initialOrder.containerNumber || "",
      notes: initialOrder.orderNotes || "",
    },
  };
  return orderTemplate;
};
const convertToSchemaFormat = (order) => {
  const formattedOrder = order.requestPayload;
  console.log("CONVERTING ORDER FORMAT");
  console.log(formattedOrder);
  const orderTemplate1 = {
    salesName: `${formattedOrder.sales.firstname} ${formattedOrder.sales.lastname}`,
    salesEmail: formattedOrder.sales.email,
    quoteNum: formattedOrder.sales.quotenum,
    isQuoteOrOrder: formattedOrder.sales.quoteType,
    deliveryByDate: formattedOrder.sales.deliveryDate,
    customerType: formattedOrder.sales.customerType,
    customerTypeId: formattedOrder.sales.custTypeID,
    originAddress: formattedOrder.origin.OriginAddress,
    destinationAddress1: formattedOrder.destination.Address1,
    destinationState: formattedOrder.destination.State,
    destinationCity: formattedOrder.destination.City,
    destinationZip: formattedOrder.destination.ZipCode,
    customerName: formattedOrder.destination.Customer,
    customerId: formattedOrder.destination.CustomerID,
    customerLocationID: formattedOrder.destination.LocationID,
    orderItems: formattedOrder.items.items.map((item) => {
      // Check if item.Package is a string or object
      let tmpObj;
      try {
        if (item.Package && item.Package.charAt && item.Package.charAt(0)) {
          tmpObj = {
            Description: item.Description,
            ID: item.ID,
            Package: item.Package,
            Quantity: item.Quantity,
            Price: item.PricePerGal,
          };
          return tmpObj;
        }
      } catch (error) {
        tmpObj = {
          Description: item.Description,
          ID: item.ID,
          Package: item.Package.packName,
          Quantity: item.Quantity,
          Price: item.PricePerGal,
        };
      }
      return tmpObj;
    }),
    containerNumber: formattedOrder.items.containerNumber,
    containerShipment: formattedOrder.items.containerShipment,
    orderNotes: formattedOrder.items.notes,
  };
  return orderTemplate1;
};

const pullFuelProducts = () => {
  const fuelLookupItems = [
    { ID: "LSD", Description: "LSD" },
    { ID: "LED DYED LSD *", Description: "DLSD" },
    { ID: "CONV SUP 93", Description: "Super Unleaded Gas" },
    { ID: "CONV UNL 87", Description: "Regular Unleaded Gas" },
    { ID: "Jet A Fuel", Description: "Jet Fuel" },
    { ID: "Conv PLU  Bld89", Description: "Mid Grade Gas" },
  ];
  return fuelLookupItems;
};
export {
  pullMonthlySalesAnalytics,
  pullCustomerAddresses,
  pullFuelOrders,
  pullWarehouseOrders,
  pullWarehouseQuotes,
  pullAllOrders,
  pullPreviousPrices,
  pullProductPackages,
  pullProducts,
  pullOriginWarehouses,
  convertOrderFormat,
  submitOrder,
  submitQuote,
  convertToSchemaFormat,
  updateOrder,
  pullFuelProducts,
  pullFuelQuotes,
  pullWarehouseDispatchOrders,
  pullOrderStatus,
  pullMonthlySalesAnalyticsFuel,
  sendOrderConfirmationEmail,
  sendQuoteConfirmationEmail,
  pullSiteToSiteOrders,
  submitSiteToSiteOrder,
  sendCustomerAddressRequestEmail,
  updateQuote,
  pullAnnouncements,
  setViewedAnnouncements,
};
