import React from "react";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div>
        <Sidebar />
          </div>
          
      {/* Main Content */}
      <div className="flex align-center justify-center flex-col text-center max-w-[500px] mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to IBER</h1>
        <p className="text-[15px]">
          IBER is a real-time video conferencing platform that allows users to
          connect with each other in a secure and private environment. With IBER,
          you can easily create and join video calls, share your screen, and
          collaborate with others from anywhere in the world.
        </p>
      </div>

    </div>
  );
};

export default Home;
