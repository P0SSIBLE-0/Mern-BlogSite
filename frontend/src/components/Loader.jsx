import React from "react";
import '../App.css';

export default function SketetonLoader() {
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
  <div>
    <div className="loader">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
  </div>
</div>
  );
}
