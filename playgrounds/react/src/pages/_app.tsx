import { styler } from "@styler";
import { Outlet } from "react-router-dom";
import Nav from "./_components/nav.tsx";
import Footer from "./_components/footer.tsx";

const AppLayout = () => {
  styler();
  return (
    <>
      <Nav />
      <main className="h-mn-100vh w-100% w-mx-1440px mx-auto">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;
