import { Playfair_Display, Jost, Poppins } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from './lib/CartContext';
import { AuthProvider } from './lib/AuthContext';
import { ThemeProvider } from './lib/ThemeContext';
import CartDrawer from './Components/CartDrawer';
import WhatsAppWidget from './Components/WhatsAppWidget';
import AIStylistWidget from './Components/AIStylistWidget';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['300', '400', '500', '600', '700'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'Taleo — Demi fine Jewellery',
  description: 'Exquisite fine jewellery, made with rare stones and exceptional craftsmanship.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable} ${poppins.variable}`}>
      <head>
        {/* runs before paint, sets dark class so there's no flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-[#f5efe8] dark:bg-[#1a0c06] text-[#2a1a0e] dark:text-[#e8d5b0] antialiased transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <WhatsAppWidget />
              <AIStylistWidget />

              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
