import "./Footer.css";
import React from "react";

function Footer() {
  return (
    <div>
      <div className="flex justify-center p-3 bg-[#303134] text-white">
        <div className="text-md">
          Privacy Policy | &copy; {new Date().getFullYear()} HighRadius Corporation. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Footer;
