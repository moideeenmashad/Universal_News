import PreNavabar from "./PreNavabar";
import PrimaryNavbar from "./PrimaryNavbar";

const Navbar = () => {
  return (
    <>
      <div className="mb-[100px] ">
      <div className="fixed top-0 w-full bg-white z-50">
          <PreNavabar />
          <PrimaryNavbar />
        </div>
      </div>
    </>
  );
};

export default Navbar;
