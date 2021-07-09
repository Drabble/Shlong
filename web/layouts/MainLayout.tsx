import React from "react";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />
      {children}
      <footer className="flex items-center justify-center w-full h-24 border-t mt-4">
        <p className="flex items-center justify-center">
          Powered by{" "}
          <a
            className="text-blue-600 hover:font-bold ml-1"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          >
            Tony
          </a>
        </p>
      </footer>
    </div>
  );
}
