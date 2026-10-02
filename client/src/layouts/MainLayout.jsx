import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AIAssistant from '../components/common/AIAssistant';
import CompareBar from '../components/common/CompareBar';
import ScrollToTop from '../components/common/ScrollToTop';

const MainLayout = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  const hideFooter = ['/checkout', '/login', '/register'].some((p) => pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <AIAssistant />
      <CompareBar />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
