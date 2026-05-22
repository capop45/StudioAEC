import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="site-main">
        {children}
      </main>
      <Footer />
    </>
  );
}
