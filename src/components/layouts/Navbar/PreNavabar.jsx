// import React from "react";

const PreNavabar = () => {
  const Today = new Date().toDateString();
  return (
    <div>
      <h5>{Today}</h5>
    </div>
  );
};

export default PreNavabar;
