import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import insBg from "../assets/images/ins1.jpg";

export default function MainLayout() {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${insBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="min-h-screen flex flex-col backdrop-blur-sm bg-black/85">
        
        <Navbar />

        <main className="flex-1 container mx-auto mb-10 md:mb-25 px-4 py-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}