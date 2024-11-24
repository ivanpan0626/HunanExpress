import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FoodPage from './pages/Food/FoodPage';
import CartPage from './pages/Cart/CartPage'
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import CheckoutSuccessPage from './pages/Checkout/CheckoutSuccessPage';

export default function AppRoutes() {
  return (
    <Routes>
        <Route path='/' 
        element={<HomePage></HomePage>}>
        </Route>
        <Route path='/search/:searchTerm' 
        element={<HomePage></HomePage>}>
        </Route>
        <Route path='/tag/:tag' 
        element={<HomePage></HomePage>}>
        </Route>
        <Route path='/food/:id' 
        element={<FoodPage></FoodPage>}>
        </Route>
        <Route path='/cart' 
        element={<CartPage></CartPage>}>
        </Route>


        <Route path='/checkout' 
        element={<CheckoutPage></CheckoutPage>}>
        </Route>
        <Route path='/checkout/success' 
        element={<CheckoutSuccessPage></CheckoutSuccessPage>}>
        </Route>
    </Routes>
  )
}
//        <Route path='/register' 
//element={<RegisterPage></RegisterPage>}>
//</Route>
//        <Route path='/login' 
//element={<LoginPage></LoginPage>}>
//</Route>
