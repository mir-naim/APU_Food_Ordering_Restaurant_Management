import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Note the addition of "Routes".
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

//Main page imports
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Profile from "./components/user/Profile";
import Home from "./components/Home";

//List of Cart and payment imports
import ProductDetails from "./components/product/ProductDetails";
import Register from "./components/user/Register";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import Payment from "./components/cart/Payment";

//List of orders import
import ListOrders from "./components/order/ListOrders";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import OrderSuccess from "./components/cart/OrderSuccess";
import OrderDetails from "./components/order/OrderDetails";

import { loadUser } from "./actions/userActions";
import store from "./store";

//Auth or User imports
import Login from "./components/user/Login";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";

//Admin/Staff imports
import Dashboard from "./components/admin/Dashboard";
import ProductsList from "./components/admin/ProductsList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrdersList from "./components/admin/OrdersList";
import ProcessOrder from "./components/admin/ProcessOrder";
import ProductReviews from "./components/admin/ProductReviews";

//Only Admin imports
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      try {
        const { data } = await axios.get("/api/v1/stripeapi");
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Use the navigate function to redirect to the home page
        }
      }
    }

    getStripeApiKey();
  }, []);

  const { user, loading } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>
            <Route path="/" Component={Home} exact />
            <Route path="/search/:keyword" Component={Home} />
            <Route path="/product/:id" Component={ProductDetails} exact />
            <Route path="/cart" Component={Cart} exact />
            <Route path="/shipping" Component={Shipping} />
            <Route path="/order/confirm" Component={ConfirmOrder} />
            <Route path="/orders/me" Component={ListOrders} exact />
            <Route path="/success" Component={OrderSuccess} exact />
            <Route path="/order/:id" Component={OrderDetails} exact />

            {stripeApiKey && (
              <Route
                path="/payment"
                element={
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <Payment />
                  </Elements>
                }
              />
            )}

            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />
            <Route path="/password/forgot" Component={ForgotPassword} exact />
            <Route
              path="/password/reset/:token"
              Component={NewPassword}
              exact
            />
            <Route path="/me" Component={Profile} exact />

            <Route path="/me/update" Component={UpdateProfile} exact />
            <Route path="/password/update" Component={UpdatePassword} exact />
          </Routes>
        </div>
        <Routes>
          <Route path="/dashboard" Component={Dashboard} exact />
          <Route path="/admin/products" Component={ProductsList} exact />
          <Route path="/admin/product" Component={NewProduct} exact />
          <Route path="/admin/product/:id" Component={UpdateProduct} exact />
          <Route path="/admin/orders" Component={OrdersList} exact />
          <Route path="/admin/order/:id" Component={ProcessOrder} exact />
          <Route path="/admin/users" Component={UsersList} exact />
          <Route path="/admin/user/:id" Component={UpdateUser} exact />
          <Route path="/admin/reviews" Component={ProductReviews} exact />
        </Routes>

        {!loading && user && user.role !== "admin" && user.role !== "staff" && (
          <Footer />
        )}
      </div>
    </Router>
  );
}

export default App;
