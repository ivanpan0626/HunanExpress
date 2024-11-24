import AppRoutes from './AppRoutes.js';
import Header from './components/Header/Header.js';
import Loading from './components/Loading/Loading.js';
import { useLoading } from './hooks/useLoading.js';
import { setLoadingInterceptor } from './interceptors/loadingInterceptor.js';
import { useEffect } from 'react';

// Stripe imports
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QOU6CGMMMgbOUn4SuChOCJL0QjrikLwUBN7nZJxtOEMLdYFIFSNUt1Q6kjM9Tg1I9CsegyRWKJRJtmk5bWsGN1100XZ3NOi6D');

function App() {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });
  }, []);

  return (
    <>
      <Loading />
      <Header />
      {/* Wrap AppRoutes with Elements */}
      <Elements stripe={stripePromise}>
        <AppRoutes />
      </Elements>
    </>
  );
}

export default App;
