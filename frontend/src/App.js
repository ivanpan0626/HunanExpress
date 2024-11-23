import AppRoutes from './AppRoutes.js';
import Header from './components/Header/Header.js'
import Loading from './components/Loading/Loading.js';
import { useLoading } from './hooks/useLoading.js';
import { setLoadingInterceptor } from './interceptors/loadingInterceptor.js'
import { useEffect } from 'react';

function App() {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading});
  }, []);

  return (
    <>
    <Loading></Loading>
    <Header></Header>
    <AppRoutes></AppRoutes>
    </>
  )
}

export default App;
