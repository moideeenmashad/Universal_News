// import Page404 from "@/Pages/Page404";
// import { lazy, Suspense } from "react";
// import Loader from "@/Components/Loader/Loader";
// const Main = lazy(() => import("@/Pages/Main"));
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "@/pages/home/Hero";
import Navbar from "@/components/layouts/Navbar/Navbar";
import LiveArticleReadMore from "@/pages/home/LiveArticleReadMore";
import Test from "@/components/layouts/NewsLayout/Test";
// import NewsList from "@/components/layouts/NewsLayout/NewsList";
import Business from "@/pages/business/Business";
import Entertainment from "@/pages/entertainment/Entertainment";
import General from "@/pages/general/General";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      {/* <Suspense fallback={<Loader />}> */}
      <Navbar />
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Hero />} />
        <Route path="/test" exact element={<Test />} />
        <Route path="/world_news/:id" element={<LiveArticleReadMore />} />
        <Route path="/business" element={<Business />} />
        {/* <Route path="/business/:id" element={<NewsList />} /> */}
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/general" element={<General/>}/>
        {/* 404 Page Route */}
        {/* <Route path="*" element={<Page404 />} /> */}
      </Routes>
      {/* </Suspense> */}
    </BrowserRouter>
  );
};

export default RoutesApp;
