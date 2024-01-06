import React from "react";

export default function NotFound() {
  return (
    <div className="w-full h-full bg-black">
      <div className=" flex items-center justify-center h-screen bg-[#000212] text-white">
        <div className="text-center">
          {/* <h1 className="text-6xl font-bold text-gray-800">404</h1> */}
          <img
            className="bg-cover"
            src="https://cdnl.iconscout.com/lottie/premium/thumb/404-error-page-3959253-3299952.gif"
            alt=""
          />
          <p className="mt-2 text-xl">Page Not Found</p>
          <p className="mt-4 text-gray-500">
            The page you are looking for might be in another universe.
          </p>
          <button
            className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
