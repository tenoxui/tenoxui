import { styler } from "@styler";
import  { buttonStyles } from "./_components/ui/Button";
import { Link } from "react-router-dom";

function App() {
  styler({
    property: {
      opacity: "opacity",
      blur: {
        property: "filter",
        value: "blur({value})",
      },
    },
    classes: buttonStyles,
  });
  return (
    <section className="h-100vh center fx-d-column pn-relative p-2rem xc">
      <header className="tw-balance ta-center">
        <h1 className="fs-2rem lh-1 ls--0.025em">Welcome to tenoxui workspace!</h1>
        <p className="mt-12px fs-14px">
          Ready to get lorem ipsumed? Start edit{" "}
          <code className="code fw-500 bg-opacity-0.1 bg-slate-800">
            <span className="ri ri-reactjs-line mr-1px"></span>/pages/index.tsx
          </code>
        </p>
        <div className="center g-8px mt-1.5rem">
          <Link to="/example" className="btn g-4px bg-slate-900 px-12px c-slate-100 hover:bg-slate-800">
            <span className="ri ri-book-marked-fill"></span>
            Example
          </Link>
        </div>
        <div className="box-100px bg-secondary-500 blur-40px opacity-0.4 pn-absolute t-50% r-20% z--9"></div>
      </header>
    </section>
  );
}

export default App;
