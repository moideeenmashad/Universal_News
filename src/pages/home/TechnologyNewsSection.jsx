import React from "react";
import { Link } from "react-router-dom";
import { BsArrowRightCircle } from "react-icons/bs";

const TechnologyNewsSection = ({ title, articleUrlName }) => {
  return (
    <div className="mx-auto max-w-screen-xl mb-[100px]">
      {/* Section Header */}
      <div className="mb-[30px] flex items-center justify-between border-b border-primary pb-[12px] mb-[100px]">
        <h2 className="text-4xl font-medium text-primary uppercase">{title}</h2>
        {/* <hr className="border-t-2 border-gray-300 mx-4" /> */}
        <div className="flex items-start justify-end">
          <Link className="flex items-center text-sm link" to="/technology">
            View All
            <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TechnologyNewsSection;
