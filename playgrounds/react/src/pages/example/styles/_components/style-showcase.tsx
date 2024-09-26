import React, { ReactNode } from "react";
import Typography, { typography } from "../../../../ui/typography";
import { styler } from "@styler";

interface ShowElementProps {
  title: string;
  desc: string;
  slug: string;
  className?: string;
  children: ReactNode;
}

const ShowElement: React.FC<ShowElementProps> = ({ title, desc, slug, children, className }) => {
  return (
    <section className="mt-2.5rem">
      <h2 className={typography.heading2}>{title}</h2>
      <p className={`mt-0.7rem ${typography.paragraph}`}>{desc}</p>
      <div className="mt-1rem bw-1px bs-solid border-slate-300 br-4px over-hidden shadow-md shadow-slate-900">
        <div className="p-8px bg-slate-200">
          <code className="code fw-500">
            <span className="ri ri-reactjs-line mr-1px"></span>
            {slug}
          </code>
        </div>
        <div className={`flex p-2rem g-1rem ${className ? className : "fx-d-column"} `}>{children}</div>
      </div>
    </section>
  );
};

export default ShowElement;
