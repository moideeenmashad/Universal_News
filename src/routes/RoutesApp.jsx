// import Page404 from "@/Pages/Page404";
// import { lazy, Suspense } from "react";
// import Loader from "@/Components/Loader/Loader";
// const Main = lazy(() => import("@/Pages/Main"));
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "@/pages/home/Hero";
import Navbar from "@/components/layouts/Navbar/Navbar";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      {/* <Suspense fallback={<Loader />}> */}
      <Navbar />
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Hero />} />
        {/* 404 Page Route */}
        {/* <Route path="*" element={<Page404 />} /> */}
      </Routes>
      {/* </Suspense> */}
    </BrowserRouter>
  );
};

export default RoutesApp;
