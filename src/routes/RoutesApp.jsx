// import Page404 from "@/Pages/Page404";
// import { lazy, Suspense } from "react";
// import Loader from "@/Components/Loader/Loader";
// const Main = lazy(() => import("@/Pages/Main"));
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "@/pages/home/Hero";
import Navbar from "@/components/layouts/Navbar/Navbar";
import LiveArticleReadMore from "@/pages/home/LiveArticleReadMore";
// import NewsList from "@/components/layouts/NewsLayout/NewsList";
import Business from "@/pages/news/Business";
import Entertainment from "@/pages/news/Entertainment";
import General from "@/pages/news/General";
import Health from "@/pages/news/Health";
import Science from "@/pages/news/Science";
import Sports from "@/pages/news/Sports";
import Technology from "@/pages/news/Technology";
// import WorldNews from "@/pages/news/WorldNews";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      {/* <Suspense fallback={<Loader />}> */}
      <Navbar />
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Hero />} />
        {/* <Route path="/world-news" element={<WorldNews />} /> */}
        <Route path="/world-news/:id" element={<LiveArticleReadMore />} />
        <Route path="/business" element={<Business />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/general" element={<General />} />
        <Route path="/health" element={<Health />} />
        <Route path="/science" element={<Science />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/technology" element={<Technology />} />
        {/* 404 Page Route */}
        {/* <Route path="*" element={<Page404 />} /> */}
      </Routes>
      {/* </Suspense> */}
    </BrowserRouter>
  );
};

export default RoutesApp;
