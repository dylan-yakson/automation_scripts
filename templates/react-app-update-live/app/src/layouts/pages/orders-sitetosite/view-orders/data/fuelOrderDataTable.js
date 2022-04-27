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

/* eslint-disable react/prop-types */
// ProductsList page components
// import IdCell from "layouts/pages/orders-sitetosite/view-orders/components/IdCell";
import DefaultCell from "layouts/pages/orders-sitetosite/view-orders/components/DefaultCell";
import OrderStatusCell from "layouts/pages/orders-sitetosite/view-orders/components/OrderStatusCell";
import MoneyCell from "layouts/pages/orders-sitetosite/view-orders/components/MoneyCell";
import ActionCell from "layouts/pages/orders-sitetosite/view-orders/components/ActionCell";
// import StatusCell from "layouts/ecommerce/orders/order-list/components/StatusCell";
// import CustomerCell from "layouts/ecommerce/orders/order-list/components/CustomerCell";

const generateDataTableFromOrders = (
  orders,
  updateFunction,
  reviewOrderFunction,
  emailFunction,
  dispatchOrders
) => {
  orders.sort((a, b) => {
    if (a.createdDate < b.createdDate) {
      return 1;
    }
    return -1;
  });
  const FormattedOrders = orders.map((order) => {
    const AlternativePO = `DJ0${order.PO}${new Date(order.createdDate)
      .getFullYear()
      .toString()
      .substr(-2)}`;
    const DispatchedOrder = dispatchOrders
      ? dispatchOrders.filter(
          (dispatchedOrder) =>
            dispatchedOrder.PO === order.PO || dispatchedOrder.PO === AlternativePO
        )
      : [];
    console.log("DISPATCH ORDERS SENT TO WH TABLE");
    console.log(dispatchOrders);
    if (DispatchedOrder[0]) {
      const OrderStatus = DispatchedOrder[0].status
        ? `${DispatchedOrder[0].status}`
        : "Order Awaiting Status Update";
      const tmpObj = {
        PO: order.PO,
        createdDate: order.createdDate,
        customer: order.requestPayload.destination.Customer,
        total: order.TotalAmount || 0,
        orderStatus: OrderStatus,
        // eslint-disable-next-line no-underscore-dangle
        editButton: order._id,
      };
      return tmpObj;
    }
    const tmpObj = {
      PO: order.PO,
      createdDate: order.createdDate,
      customer: order.requestPayload.destination.Customer,
      total: order.TotalAmount || 0,
      orderStatus: "Awaiting Status Update",
      // eslint-disable-next-line no-underscore-dangle
      editButton: order._id,
    };
    return tmpObj;
  });
  const globalUpdateFunction = updateFunction;
  const globalEmailFunction = emailFunction;
  const globalReviewFunction = reviewOrderFunction;
  console.log(FormattedOrders);
  const ReturnedTableData = {
    columns: [
      {
        Header: "edit",
        accessor: "editButton",
        Cell: ({ value }) => (
          <ActionCell
            value={value}
            updateFunction={globalUpdateFunction}
            emailFunction={globalEmailFunction}
            reviewFunction={globalReviewFunction}
            ordersList={orders}
          />
        ),
      },
      // { Header: "id", accessor: "id", Cell: ({ value }) => <IdCell id={value} /> },
      {
        Header: "PO",
        accessor: "PO",
        Cell: ({ value }) => <DefaultCell value={value} />,
      },

      {
        Header: "customer",
        accessor: "customer",
        Cell: ({ value }) => <DefaultCell value={value} />,

        // Cell: ({ value: [name, data] }) => (
        //   <CustomerCell image={data.image} color={data.color || "dark"} name={name} />
        // ),
      },
      {
        Header: "createdDate",
        accessor: "createdDate",
        Cell: ({ value }) => <DefaultCell value={value} />,
      },
      // {
      //   Header: "product",
      //   accessor: "product",
      //   Cell: ({ value }) => {
      //     const [name, data] = value;

      //     return (
      //       <DefaultCell
      //         value={typeof value === "string" ? value : name}
      //         suffix={data.suffix || false}
      //       />
      //     );
      //   },
      // },
      {
        Header: "total",
        accessor: "total",
        Cell: ({ value }) => <MoneyCell value={Number(value).toFixed(2)} />,
      },
      {
        Header: "status",
        accessor: "orderStatus",
        Cell: ({ value }) => <OrderStatusCell value={value} />,
      },
    ],

    rows: FormattedOrders,
  };

  return ReturnedTableData;
};

export default generateDataTableFromOrders;
