import "./Header.css";
import React from "react";


import Typewriter from "typewriter-effect";

function Header() {
  return (
    <div className="border-b-2 ">
      <div className="flex justify-center p-5 bg-[#303134] text-white">
        <div className="text-2xl hidden lg:flex">
          <Typewriter
            options={{
              strings: [
                "Welcome to AI-Enabled FinTech B2B Invoice Management Application",
              ],
              autoStart: true,
              loop: true,
              pauseFor: 10000,
            }}
          />
        </div>
        <div className="text-2xl flex text-center lg:hidden">
          <p>"Welcome to AI-Enabled FinTech B2B Invoice Management Application"</p>
        </div>
      </div>


      <div className="lg:flex mt-2 ">
        <div className="flex items-center justify-center lg:justify-between flex-col lg:flex-row">
          <div className="flex items-center ">
            <img src="https://svgshare.com/i/u__.svg" alt="logo1" className="w-40" />
          </div>
          <div className="flex items-center    lg:w-[80vw] lg:justify-center">
            <img src="https://svgshare.com/i/u8i.svg" alt="logo2" />
          </div>
        </div>
      </div>




      <p style={{ color: 'red', margin: "5px" }} className="text-center py-2 font-bold text-xl lg:text-left">INVOICE LIST</p>

    </div>
  );
}

export default Header;
