import { styler } from "@styler";
import Sidebar from "./_components/sidebar";
import { Outlet } from "react-router-dom";

const ExampleLayout = () => {
  styler();

  return (
    <>
      <Sidebar />
      <article className="h-mn-100vh pn-relative p-2rem">
        <Outlet />
      </article>
    </>
  );
};

export default ExampleLayout;
