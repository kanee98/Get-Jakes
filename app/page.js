import Hero from '@/components/Hero';
import ShopCatalog from '@/components/ShopCatalog';
import Gallery from '@/components/Gallery';
import CustomQuote from '@/components/CustomQuote';
import ChatWidget from '@/components/ChatWidget';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShopCatalog />
      <Gallery />
      <CustomQuote />
      <ChatWidget />
    </>
  );
}
