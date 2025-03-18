import React, { useState } from "react";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-300 rounded-lg mb-4">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex justify-between items-center bg-blue-200 hover:bg-blue-300 rounded-lg focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg">
          <i className="fa fa-search"></i> &nbsp; {title}
        </span>
        <span
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
