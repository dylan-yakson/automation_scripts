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
// import ProductCell from "layouts/pages/dashboards/sales/components/ProductCell";
import TopSellingProductCell from "layouts/pages/dashboards/sales/components/TopSellingProductCell";
// import RefundsCell from "layouts/pages/dashboards/sales/components/RefundsCell";
import DefaultCell from "layouts/pages/dashboards/sales/components/DefaultCell";
// Images
import nikeV22 from "assets/images/ecommerce/blue-shoe.jpeg";
// import businessKit from "assets/images/ecommerce/black-mug.jpeg";
// import blackChair from "assets/images/ecommerce/black-chair.jpeg";
// import wirelessCharger from "assets/images/ecommerce/bang-sound.jpeg";
// import tripKit from "assets/images/ecommerce/photo-tools.jpeg";

const formatTopProductsData = (analyticsData) => {
  const productSalesData = analyticsData.productData;

  const tmpResponseObj = {
    columns: [
      { Header: "Product", accessor: "product", width: "55%" },
      // { Header: "Total $ Sold", accessor: "TotalAmountPurchased" },
      { Header: "Purchased Most By", accessor: "bestCustomer", align: "center" },
    ],
    rows: [
      // {
      //   product: <ProductCell image={nikeV22} name="Nike v22 Running" orders={8.232} />,
      //   value: <DefaultCell>$130.992</DefaultCell>,
      //   adsSpent: <DefaultCell>$9.500</DefaultCell>,
      //   refunds: <RefundsCell value={13} icon={{ color: "success", name: "keyboard_arrow_up" }} />,
      // },
    ],
  };

  productSalesData.sort((a, b) => {
    if (a.TotalAmountPurchased < b.TotalAmountPurchased) {
      return 1;
    }
    return -1;
  });
  const top6Products = productSalesData.slice(0, 10);
  for (const orderIndex in top6Products) {
    const currentProduct = productSalesData[orderIndex];

    // Get most occuring customer in product orders
    const customerCountArr = [];
    for (const productOrderIndex in currentProduct.orders) {
      const currentOrder = currentProduct.orders[productOrderIndex];
      const filteredCustomer = customerCountArr.filter(
        (customer) => customer.customer === currentOrder.customer
      );
      if (filteredCustomer && filteredCustomer[0]) {
        customerCountArr.map((customer) => {
          const tmpCust = customer;
          if (customer.customer === currentOrder.customer) {
            tmpCust.orderCount += 1;
          }
          return tmpCust;
        });
      } else {
        customerCountArr.push({ customer: currentOrder.customer, orderCount: 1 });
      }
    }
    // customerCountArr.sort((a, b) => a.orderCount < b.orderCount);
    customerCountArr.sort((a, b) => a.TotalAmountPurchased < b.TotalAmountPurchased);
    console.log(customerCountArr);
    const [customer1] = customerCountArr;
    const tmpRow = {
      product: (
        <TopSellingProductCell
          image={nikeV22}
          name={currentProduct.ProdDescription}
          orders={currentProduct.TotalAmountPurchased}
        />
      ),
      // TotalAmountPurchased: (
      //   <DefaultCell>${Number(currentProduct.TotalAmountPurchased).toFixed(2)}</DefaultCell>
      // ),
      bestCustomer: <DefaultCell>{customer1.customer}</DefaultCell>,
    };
    tmpResponseObj.rows.push(tmpRow);
  }
  return tmpResponseObj;
};

export default formatTopProductsData;
