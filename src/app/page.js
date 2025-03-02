import MainBanner from "./components/mainBanner";
import RandomCollection from "./components/randomCollection";
import ShopByCollections from "./components/shopByCollections";

export default function Home() {
  return (
    <>
      <main>
        <MainBanner />
        <ShopByCollections />
        <RandomCollection />
      </main>
    </>
  );
}
