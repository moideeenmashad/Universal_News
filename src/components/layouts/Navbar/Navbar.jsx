import PreNavabar from "./PreNavabar";
import PrimaryNavbar from "./PrimaryNavbar";

const Navbar = () => {
  return (
    <>
      <div className="mb-[100px]">
        <PreNavabar />
        <PrimaryNavbar />
      </div>
    </>
  );
};

export default Navbar;
