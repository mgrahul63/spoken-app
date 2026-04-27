import QuoteBar from "../components/QuoteBar";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[rgb(26_24_41/var(--tw-bg-opacity,1))]">
      <QuoteBar />
      <Navbar />
      <main className="py-2">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
