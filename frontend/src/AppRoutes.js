import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FoodPage from './pages/Food/FoodPage';
import CartPage from './pages/Cart/CartPage'
import LoginPage from './pages/Login/LoginPage';

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
        <Route path='/login' 
        element={<LoginPage></LoginPage>}>
        </Route>
    </Routes>
  )
}
