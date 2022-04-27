/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-syntax */
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
// {
//   columns: [
//     { Header: "product", accessor: "product", width: "55%" },
//     { Header: "value", accessor: "value" },
//     { Header: "ads spent", accessor: "adsSpent", align: "center" },
//     { Header: "refunds", accessor: "refunds", align: "center" },
//   ],

//   rows: [
//     {
//       product: <ProductCell image={nikeV22} name="Nike v22 Running" orders={8.232} />,
//       value: <DefaultCell>$130.992</DefaultCell>,
//       adsSpent: <DefaultCell>$9.500</DefaultCell>,
//       refunds: <RefundsCell value={13} icon={{ color: "success", name: "keyboard_arrow_up" }} />,
//     },
//     {
//       product: (
//         <ProductCell image={businessKit} name="Business Kit (Mug + Notebook)" orders={12.821} />
//       ),
//       value: <DefaultCell>$80.250</DefaultCell>,
//       adsSpent: <DefaultCell>$4.200</DefaultCell>,
//       refunds: <RefundsCell value={40} icon={{ color: "error", name: "keyboard_arrow_down" }} />,
//     },
//     {
//       product: <ProductCell image={blackChair} name="Black Chair" orders={2.421} />,
//       value: <DefaultCell>$40.600</DefaultCell>,
//       adsSpent: <DefaultCell>$9.430</DefaultCell>,
//       refunds: <RefundsCell value={54} icon={{ color: "success", name: "keyboard_arrow_up" }} />,
//     },
//     {
//       product: <ProductCell image={wirelessCharger} name="Wireless Charger" orders={5.921} />,
//       value: <DefaultCell>$91.300</DefaultCell>,
//       adsSpent: <DefaultCell>$7.364</DefaultCell>,
//       refunds: <RefundsCell value={5} icon={{ color: "error", name: "keyboard_arrow_down" }} />,
//     },
//     {
//       product: (
//         <ProductCell image={tripKit} name="Mountain Trip Kit (Camera + Backpack)" orders={921} />
//       ),
//       value: <DefaultCell>$140.925</DefaultCell>,
//       adsSpent: <DefaultCell>$20.531</DefaultCell>,
//       refunds: <RefundsCell value={121} icon={{ color: "success", name: "keyboard_arrow_up" }} />,
//     },
//   ],
// };
import ProductCell from "layouts/pages/dashboards/sales/components/ProductCell";
import FavoriteProductCell from "layouts/pages/dashboards/sales/components/favoriteCell";
// import RefundsCell from "layouts/pages/dashboards/sales/components/RefundsCell";
import DefaultCell from "layouts/pages/dashboards/sales/components/DefaultCell";
// Images
import nikeV22 from "assets/images/ecommerce/blue-shoe.jpeg";
// import businessKit from "assets/images/ecommerce/black-mug.jpeg";
// import blackChair from "assets/images/ecommerce/black-chair.jpeg";
// import wirelessCharger from "assets/images/ecommerce/bang-sound.jpeg";
// import tripKit from "assets/images/ecommerce/photo-tools.jpeg";

const formatTopCustomersChartData = (orderData) => {
  const { customers } = orderData;
  console.log(customers);
  customers
    .sort((a, b) => {
      if (a.TotalAmountPurchased < b.TotalAmountPurchased) {
        return 1;
      }
      return -1;
    })
    .filter((item) => item.Customer !== "");
  const tmpResponseObj = {
    columns: [
      { Header: "Customer", accessor: "customer", width: "55%" },
      // { Header: "Total $ Sold", accessor: "TotalAmountPurchased" },
      { Header: "Favorite Product", accessor: "favoriteProduct", align: "center" },
    ],
    rows: [],
  };
  let top10Customers;
  if (customers.length > 10) {
    top10Customers = customers.slice(0, 10);
  } else {
    top10Customers = customers;
  }
  for (const bestCustomerIndex in top10Customers) {
    const customerObject = top10Customers[bestCustomerIndex];
    const customersProductData = customerObject.products;
    const [tmpCustomersFavoriteProduct] = customersProductData.sort((a, b) => {
      if (a.totalAmountSpent < b.totalAmountSpent) {
        return 1;
      }
      return -1;
    });
    // console.log("FAVORITE PRODUCT", tmpCustomersFavoriteProduct);
    const tmpRow = {
      customer: (
        <ProductCell
          image={nikeV22}
          name={customerObject.Customer}
          orders={customerObject.orders.length}
        />
      ),
      // TotalAmountPurchased: (
      //   <DefaultCell>${Number(customerObject.TotalAmountPurchased).toFixed(2)}</DefaultCell>
      // ),
      favoriteProduct: (
        <FavoriteProductCell
          image={nikeV22}
          name={tmpCustomersFavoriteProduct.itemDesc}
          orders={tmpCustomersFavoriteProduct.totalAmountSpent}
        />
      ),
      // <DefaultCell>{tmpCustomersFavoriteProduct.itemDesc}</DefaultCell>,
    };
    // console.log("TopCustomers: ", customerObject, tmpCustomersFavoriteProduct);
    tmpResponseObj.rows.push(tmpRow);
  }
  return tmpResponseObj;
};

export default formatTopCustomersChartData;
