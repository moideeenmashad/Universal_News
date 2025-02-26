import React, { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <div className="sm:hidden py-16 text-center">
        <button
          type="button"
          className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-gray-800 border border-gray-800 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-950 focus:outline-none focus:bg-gray-900 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200 dark:focus:bg-neutral-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close" : "Open"}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 start-0 bottom-0 w-64 bg-white border-r border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <header className="p-4 flex justify-between items-center gap-x-2">
          <a
            className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white"
            href="#"
            aria-label="Brand"
          >
            Brand
          </a>
          {/* Close Button */}
          <button
            type="button"
            className="sm:hidden flex justify-center items-center size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </header>

        {/* Navigation */}
        <nav className="h-full overflow-y-auto">
          <ul className="space-y-1 p-4">
            <li>
              <a
                className="flex items-center gap-x-3 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white"
                href="#"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                href="#"
              >
                Users
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
