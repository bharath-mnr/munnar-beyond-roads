//src/App.jsx
import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import Home from "@/pages/Home";
import Seo from "@/seo/Seo";

const Safari = lazy(() => import("@/pages/Safari"));
const Photography = lazy(() => import("@/pages/Photography"));
const Services = lazy(() => import("@/pages/Services"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo />
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:font-semibold focus:text-accent-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<div className="min-h-[70vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="safari" element={<Safari />} />
        <Route path="photography" element={<Photography />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        {/* the old Explore page was replaced by More Services */}
        <Route path="explore" element={<Navigate to="/services" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
