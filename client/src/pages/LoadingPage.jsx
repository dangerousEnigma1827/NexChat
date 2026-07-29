import React from "react";
// import NexChatIcon from "./NexChatIcon";

function LoadingPage() {
  return (
    <div className="w-full h-screen bg-[#141720] flex items-center justify-center">

      <div className="flex flex-col items-center gap-5">

        {/* Logo */}
        <div className="animate-pulse">
          {/* <NexChatIcon /> */}
        </div>


        {/* Spinner */}
        <div className="w-10 h-10 border-[3px] border-[#2a3142] border-t-[#4c7dff] rounded-full animate-spin"/>


        {/* Text */}
        <div className="text-center">
          <p className="text-gray-200 text-[15px] font-medium">
            Loading NexChat
          </p>

          <p className="text-gray-500 text-[13px] mt-1">
            Setting up your conversations...
          </p>
        </div>

      </div>

    </div>
  );
}

export default LoadingPage;