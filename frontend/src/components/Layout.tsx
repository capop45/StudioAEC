import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { TopBar } from './TopBar';

export function Layout() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
