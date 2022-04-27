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
// import IdCell from "layouts/pages/orders-fuel/view-quotes/components/IdCell";
import DefaultCell from "layouts/pages/orders-fuel/view-quotes/components/DefaultCell";
import MoneyCell from "layouts/pages/orders-fuel/view-quotes/components/MoneyCell";
import ActionCell from "layouts/pages/orders-fuel/view-quotes/components/ActionCell";
// import StatusCell from "layouts/ecommerce/orders/order-list/components/StatusCell";
// import CustomerCell from "layouts/ecommerce/orders/order-list/components/CustomerCell";

const generateDataTableFromOrders = (
  orders,
  updateFunction,
  reviewOrderFunction,
  emailFunction,
  convertToOrderFunction
) => {
  orders.sort((a, b) => {
    if (a.createdDate < b.createdDate) {
      return 1;
    }
    return -1;
  });
  const FormattedOrders = orders.map((order) => {
    console.log("DISPATCH ORDERS SENT TO WH TABLE");
    const tmpObj = {
      PO: order.PO,
      createdDate: order.createdDate,
      customer: order.requestPayload.destination.Customer,
      total: order.TotalAmount || 0,
      // eslint-disable-next-line no-underscore-dangle
      editButton: order._id,
    };
    return tmpObj;
  });
  const globalUpdateFunction = updateFunction;
  const globalEmailFunction = emailFunction;
  const globalReviewFunction = reviewOrderFunction;
  const globalConvertToOrderFunction = convertToOrderFunction;

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
            convertFunction={globalConvertToOrderFunction}
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
      // {
      //   Header: "status",
      //   accessor: "orderStatus",
      //   Cell: ({ value }) => <OrderStatusCell value={value} />,
      // },
    ],

    rows: FormattedOrders,
  };

  return ReturnedTableData;
};

export default generateDataTableFromOrders;
