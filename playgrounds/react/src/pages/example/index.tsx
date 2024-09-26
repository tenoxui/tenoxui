import { styler } from "@styler";
import { Link } from "react-router-dom";

const ExamplesIndex = () => {
  styler();
  return (
    <>
      <header className="tw-balance">
        <h1 className="fs-2.5rem lh-1 ls--0.030em">Explore TenoxUI Usage Example</h1>
        <p className="mt-1.5rem lh-1.4em ls--0.025em w-mx-600px">
          TenoxUI provide some <code className="code fw-500 bg-opacity-0.1 bg-slate-800">Lorem Ipsums</code> you can use
          inside your project, here's some usage, style guide, and also making a simple components.
        </p>
      </header>

      <div className="mt-1.5rem flex g-8px">
        <a
          href="https://github.com/tenoxui/tenoxui"
          className="btn btn-icon g-4px bg-slate-900 px-12px c-slate-100 hover:bg-slate-800"
        >
          <span className="ri ri-github-fill fs-1.2em"></span>
        </a>
        <Link to="/example/styles" className="btn g-4px bg-slate-900 px-12px c-slate-100 hover:bg-slate-800">
          <span className="ri ri-pantone-fill"></span>
          Styles
        </Link>
        <Link to="/example/components" className="btn g-4px bg-slate-900 px-12px c-slate-100 hover:bg-slate-800">
          <span className="ri ri-puzzle-2-fill"></span>
          Components
        </Link>
      </div>
    </>
  );
};

export default ExamplesIndex;
