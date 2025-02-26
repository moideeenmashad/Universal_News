import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "@/pages/home/Hero";
import Navbar from "@/components/layouts/Navbar/Navbar";
import LiveArticleReadMore from "@/pages/home/LiveArticleReadMore";
import Business from "@/pages/news/Business";
import Entertainment from "@/pages/news/Entertainment";
import General from "@/pages/news/General";
import Health from "@/pages/news/Health";
import Science from "@/pages/news/Science";
import Sports from "@/pages/news/Sports";
import Technology from "@/pages/news/Technology";
import NewsDetails from "@/components/layouts/NewsLayout/NewsDetails";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Hero />} />
        <Route path="/world-news/:id" element={<LiveArticleReadMore />} />

        {/* Category Routes */}
        <Route path="/business" element={<Business />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/general" element={<General />} />
        <Route path="/health" element={<Health />} />
        <Route path="/science" element={<Science />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/technology" element={<Technology />} />

        {/* Dynamic Article Detail Route */}
        <Route path="/:category/:title" element={<NewsDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
