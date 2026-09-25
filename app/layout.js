import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ModalProvider } from '@/context/ModalContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import ChatWidget from '@/components/ChatWidget';
import LoaderScreen from '@/components/LoaderScreen';

export const metadata = {
  title: 'Get Jakes Cake Props & Toppers | Handcrafted Studio Props',
  description: 'Premium multi-tier wedding dummy cakes, food photography props, and architectural display pedestals handcrafted for ballrooms and studios.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LoaderScreen />
        <AuthProvider>
          <CartProvider>
            <ModalProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
              <CheckoutModal />
              <ChatWidget />
            </ModalProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
