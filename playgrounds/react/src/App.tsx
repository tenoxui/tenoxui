import { styler } from "./utils/styler";

function App() {
  styler({
    opacity:"opacity",
    blur: {
      property: "filter",
      value: "blur({value})"
    }
  });
  return (
    <main className="p-2rem w-100% w-mx-1440px mx-auto">
      <header className="tw-balance">
        <h1 className="fw-2.5rem fw-500 lh-1 ls--0.025em">Welcome to tenoxui workspace!</h1>

        <div className="box-100px bg-#ccf654 blur-40px opacity-0.2"></div>
      </header>
    </main>
  );
}

export default App;
