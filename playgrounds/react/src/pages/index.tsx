import { styler } from "@styler";

function App() {
  styler({
    property: {
      opacity: "opacity",
      blur: {
        property: "filter",
        value: "blur({value})",
      },
    },
  });
  return (
    <main className="h-mn-100vh w-100% w-mx-1440px mx-auto p-2rem center fx-d-column pn-relative">
      <header className="tw-balance ta-center">
        <h1 className="fs-2rem lh-1 ls--0.025em">Welcome to tenoxui workspace!</h1>
        <p className="mt-12px fs-14px">
          Ready to get lorem ipsumed? Start edit{" "}
          <code className="code fw-500 [--bg-opa]-0.1 bg-neutral-800">App.tsx</code>
        </p>
        <div className="box-100px bg-secondary-500 blur-40px opacity-0.4 pn-absolute t-50% r-20% z--9"></div>
      </header>
    </main>
  );
}

export default App;
