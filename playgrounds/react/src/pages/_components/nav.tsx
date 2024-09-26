import { styler } from "@styler";

const Nav = () => {
  styler();
  return (
    <header className="bg-slate-100 px-2rem py-1rem w-100% w-mx-1440px mx-auto fixed bg-opacity-0.3 hidden">
      <h1 className="fs-1rem fw-500 ls--0.025em">TenoxUI</h1>
    </header>
  );
};

export default Nav;
