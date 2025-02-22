// import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

// import PreNavabar from "./PreNavabar";

const PrimaryNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const NavItems = [
    { id: 1, navItem: "World News", LinkTo: "/world_news" },
    { id: 2, navItem: "Politics", LinkTo: "/politics" },
    { id: 3, navItem: "Business", LinkTo: "/business" },
    { id: 4, navItem: "Technology", LinkTo: "/technology" },
    { id: 5, navItem: "Health", LinkTo: "/health" },
    { id: 6, navItem: "Sports", LinkTo: "/sports" },
    { id: 7, navItem: "Culture", LinkTo: "/culture" },
    { id: 8, navItem: "Podcast", LinkTo: "/podcast" },
  ];

  return (
    <div>
      <div>
        {/* <PreNavabar /> */}
        <div className="flex items-center justify-center py-2">
          <svg
            width="344"
            height="42"
            viewBox="0 0 344 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_3_26)">
              <path
                d="M329.822 18.477L329.748 18.253H329.6L329.526 18.477L329.674 18.626L329.822 18.477ZM330.635 18.85L334.627 22.809C335.072 23.258 335.515 23.707 335.958 24.079C336.18 24.229 336.402 24.378 336.697 24.528C336.994 24.602 337.29 24.678 337.585 24.678C337.881 24.678 338.176 24.602 338.472 24.453L338.769 24.901L336.55 30.578L336.032 31.027L329.6 19.447L327.012 24.602C326.79 25.125 326.494 25.648 326.347 26.171C326.199 26.47 326.125 26.77 326.125 27.068C326.125 27.367 326.125 27.666 326.199 27.964C326.347 28.263 326.494 28.487 326.716 28.711L326.421 29.16L320.358 28.785L319.766 28.412L328.638 18.626L323.093 17.804C322.502 17.73 321.911 17.58 321.319 17.58C321.023 17.58 320.727 17.58 320.432 17.655C320.136 17.73 319.915 17.879 319.618 18.029C319.396 18.253 319.175 18.477 319.027 18.776L318.51 18.626L317.031 12.65L317.252 11.978L329.156 17.506L328.195 11.903C328.121 11.305 328.047 10.707 327.9 10.11C327.752 9.81101 327.678 9.58701 327.53 9.28801C327.371 9.05401 327.17 8.85101 326.938 8.69001C326.642 8.46601 326.347 8.39201 326.051 8.31701V7.79401L331.152 4.43201H331.892L330.339 17.58L335.367 14.965C335.885 14.741 336.402 14.443 336.92 14.144C337.142 13.92 337.363 13.77 337.585 13.546C337.733 13.323 337.881 13.024 338.029 12.726C338.102 12.426 338.102 12.127 338.029 11.828L338.546 11.678L343.278 15.563L343.5 16.236L330.635 18.85ZM8.75 24.201C6.456 23.226 4.515 21.276 3.544 18.882C2.573 16.489 2.485 13.741 3.368 11.347C4.073 9.39701 5.309 7.62401 6.897 6.29401C8.485 4.96401 10.426 3.98901 12.455 3.45701C14.661 2.92501 16.955 2.83701 19.249 3.10301C21.543 3.45701 23.749 4.07801 25.955 4.78701C29.219 5.85101 32.396 7.09201 35.748 7.80101C38.307 8.42201 40.866 9.21901 43.513 9.30801C44.395 9.30801 45.366 9.21901 46.16 8.86501C46.513 8.59901 46.866 8.33301 47.13 7.97801C47.395 7.53501 47.572 7.18101 47.66 6.64901C47.66 6.20501 47.572 5.67401 47.395 5.31901C47.13 4.87601 46.777 4.43201 46.425 4.16601C45.63 3.54601 44.748 3.28001 43.778 3.01401C42.807 2.83701 41.836 2.65901 40.954 2.57101V0.886007C42.013 0.798007 43.16 0.798007 44.219 0.886007C46.248 1.15201 48.366 1.68401 50.13 2.65901C51.983 3.63501 53.571 5.14201 54.542 7.00301C55.601 8.95401 55.865 11.347 55.336 13.563C54.718 15.779 53.307 17.641 51.365 18.971C49.777 20.035 47.836 20.744 45.807 20.921C45.101 21.01 44.307 21.098 43.601 21.098V31.736L49.424 37.676L43.601 43.615V57.09C44.219 56.646 44.748 56.203 45.366 55.76C48.63 53.012 51.189 49.466 52.777 45.477H54.454C54.63 49.555 53.659 53.632 51.807 57.267C49.689 61.256 46.513 64.625 42.631 66.93C38.748 69.235 34.337 70.476 29.837 70.653C21.631 70.919 13.338 67.462 7.779 61.345C2.221 55.228 -0.426001 46.541 1.074 38.474C2.044 33.421 4.515 28.722 8.132 25.088C11.75 21.542 16.426 19.148 21.455 18.262L22.337 19.591C18.455 22.162 15.367 25.797 13.426 30.052L32.837 21.719V48.668L17.308 55.228C18.53 56.463 19.927 57.509 21.455 58.331C25.161 60.458 29.572 61.256 33.807 60.724C36.366 60.458 38.837 59.661 41.131 58.508V43.526L35.307 37.676L41.131 31.825V20.921C40.689 20.921 40.248 20.832 39.895 20.744C35.925 20.212 32.043 19.059 28.161 18.173C24.278 17.198 20.308 16.045 16.338 15.248C14.749 14.893 13.073 14.716 11.485 15.07C10.603 15.248 9.897 15.602 9.191 16.134C8.573 16.577 8.044 17.286 7.691 18.084C7.426 18.971 7.338 19.946 7.691 20.921C8.044 21.808 8.75 22.517 9.632 22.96L8.75 24.201ZM12.279 33.066C10.867 37.587 10.779 42.64 12.279 47.161C13.073 49.377 14.22 51.505 15.632 53.366L21.455 50.884V29.165L12.279 33.066ZM76.875 60.37L79.699 63.206L82.434 61.345L84.022 63.295L73.081 71.008L63.994 63.206L60.641 65.334L59.141 63.295L65.052 59.483V19.148C65.052 18.705 65.052 18.262 64.876 17.818C64.788 17.375 64.611 16.932 64.435 16.577C63.994 16.045 63.464 15.602 62.847 15.336C62.141 14.982 61.523 14.716 60.817 14.45V13.209L75.199 3.01401H76.875V35.903L87.816 25.531L97.169 33.332L100.698 30.495L102.198 32.445L98.404 35.548V58.685C98.404 61.079 98.404 63.472 97.963 65.866C97.61 68.259 96.727 70.564 95.492 72.603C93.643 75.532 90.972 77.845 87.816 79.252C84.534 80.761 80.888 81.285 77.317 80.759V78.631C79.169 78.188 81.022 77.213 82.434 75.883C84.022 74.288 85.081 72.337 85.787 70.21C86.934 66.752 87.022 63.118 87.022 59.483V38.296L81.728 33.864L76.875 38.474V60.37ZM103.635 65.245L102.135 63.295L106.282 59.926V36.523L127.37 25.531L136.282 39.094V39.537L117.224 51.416V55.228L127.811 62.497L137.604 54.874L138.84 57.001L120.664 71.805L107.517 62.054L103.635 65.245ZM117.224 49.289L126.575 43.349L118.988 32.268L117.224 33.243V49.289ZM148.2 68.703C147.73 68.703 147.494 68.495 147.494 68.082L147.405 7.71201C147.405 7.23901 147.641 7.00301 148.111 7.00301H156.052L170.963 41.931L170.522 7.71201C170.522 7.23901 170.787 7.00301 171.316 7.00301H180.051C180.404 7.00301 180.581 7.23901 180.581 7.71201L180.669 68.171C180.669 68.525 180.522 68.703 180.228 68.703H172.463L157.199 36.08L157.817 67.994C157.817 68.467 157.552 68.703 157.023 68.703H148.2ZM188.687 68.703C188.451 68.703 188.334 68.555 188.334 68.259L188.422 7.35801C188.422 7.12201 188.539 7.00301 188.775 7.00301H217.097C217.332 7.00301 217.45 7.15101 217.45 7.44601V17.375C217.45 17.611 217.332 17.73 217.097 17.73H199.01V31.559H217.097C217.332 31.559 217.45 31.677 217.45 31.914L217.538 41.931C217.538 42.167 217.42 42.285 217.186 42.285H199.01V57.799H217.186C217.42 57.799 217.538 57.946 217.538 58.242V68.348C217.538 68.584 217.42 68.703 217.186 68.703H188.687ZM233.502 68.703C233.266 68.703 233.119 68.555 233.06 68.259L222.649 7.35801C222.59 7.12201 222.678 7.00301 222.913 7.00301H232.796C233.031 7.00301 233.178 7.12201 233.236 7.35801L238.883 47.427L244.707 7.35801C244.766 7.12201 244.942 7.00301 245.237 7.00301H253.177C253.412 7.00301 253.559 7.12201 253.617 7.35801L259.354 47.427L265.089 7.35801C265.147 7.12201 265.294 7.00301 265.529 7.00301H275.324C275.617 7.00301 275.735 7.12201 275.675 7.35801L265.177 68.259C265.108 68.391 265.018 68.511 264.911 68.614L264.735 68.703H254.06C253.883 68.703 253.735 68.555 253.617 68.259L249.119 36.435L244.619 68.259C244.559 68.555 244.413 68.703 244.177 68.703H233.502ZM294.752 69.589C291.576 69.589 288.664 68.791 286.017 67.196C283.451 65.564 281.305 63.347 279.753 60.724C278.224 58.006 277.459 55.021 277.459 51.771V47.693C277.459 47.397 277.607 47.25 277.9 47.25H287.782C288.018 47.25 288.135 47.397 288.135 47.693V51.771C288.135 53.721 288.782 55.405 290.076 56.824C291.371 58.183 292.929 58.863 294.752 58.863C296.576 58.863 298.135 58.154 299.428 56.735C300.723 55.317 301.369 53.662 301.369 51.771C301.369 49.585 299.958 47.693 297.134 46.097C296.194 45.565 294.723 44.738 292.723 43.615C290.837 42.557 288.955 41.493 287.076 40.424C283.841 38.532 281.429 36.169 279.841 33.332C278.312 30.436 277.547 27.185 277.547 23.581C277.547 20.271 278.341 17.316 279.929 14.716C281.517 12.056 283.606 9.95901 286.194 8.42201C288.79 6.89901 291.746 6.10301 294.752 6.11701C297.87 6.11701 300.723 6.91501 303.311 8.51001C305.92 10.009 308.083 12.182 309.575 14.804C311.163 17.405 311.957 20.33 311.957 23.581V30.85C311.957 31.086 311.84 31.204 311.604 31.204H301.722C301.487 31.204 301.369 31.086 301.369 30.85L301.281 23.581C301.281 21.512 300.635 19.827 299.34 18.528C298.046 17.228 296.517 16.577 294.752 16.577C292.929 16.577 291.371 17.286 290.076 18.705C288.782 20.065 288.135 21.689 288.135 23.581C288.135 25.531 288.547 27.156 289.37 28.456C290.194 29.756 291.694 30.997 293.87 32.179C294.164 32.357 294.723 32.681 295.546 33.155C296.429 33.568 297.37 34.071 298.37 34.662C299.37 35.194 300.252 35.667 301.017 36.08C301.84 36.493 302.34 36.759 302.516 36.878C305.458 38.532 307.782 40.571 309.487 42.995C311.193 45.358 312.045 48.284 312.045 51.771C312.045 55.139 311.251 58.183 309.663 60.902C308.135 63.561 306.046 65.689 303.399 67.284C300.811 68.821 297.928 69.589 294.752 69.589Z"
                fill="#000000"
              />
            </g>
            <defs>
              <clipPath id="clip0_3_26">
                <rect
                  width="343"
                  height="82"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <nav className="bg-white w-full z-20">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto my-2 border-primary border-y-2 py-2 md:py-0">
            <a
              href="https://flowbite.com/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            ></a>
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                onClick={toggleNavbar}
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 "
                aria-controls="navbar-sticky"
                aria-expanded={isOpen ? "true" : "false"}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
            <div
              className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
                isOpen ? "" : "hidden"
              }`}
              id="navbar-sticky"
            >
              <ul className="flex flex-col md:p-0 mt-4  md:flex-row md:mt-0 md:border-0">
                {/* Loop li */}
                {NavItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.LinkTo}
                    className={({ isActive }) =>
                      `font-family-BG block py-2 px-3 text-primary rounded-sm md:bg-transparent hover:text-primary px-[20px]
                    ${isActive ? "active" : ""}`
                    }
                  >
                    {item.navItem}
                  </NavLink>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default PrimaryNavbar;
