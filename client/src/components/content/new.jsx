import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { Sun, Thunder, Warning } from "../../assets";
import { livePrompt } from "../../redux/messages";
import "./style.scss";
import GPTIcon from "../../assets/gptIcon.jsx";
const New = memo(() => {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center justify-center flex-col">
        <GPTIcon />
        <h1 className="mt-2 text-[24px] font-semibold inter-500">How can i help you today :)</h1>
      </div>

      <div className="flex inter-400 mx-10">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mt-12">
         
          <div
            className="border-2 text-center duration-300 border-[#00875A]  hover:bg-[#00875A] hover:text-white  px-2 py-4 rounded-md cursor-pointer"
            onClick={() => {
              dispatch(
                livePrompt(
                  "Schedule me an #Appointment with Dr.Rohit at 3:00 pm"
                )
              );
            }}
          >
            <p className="">
              Schedule me an #Appointment with Dr.Rohit at 3:00 pm</p>
          </div>
          <div
            className="border-2 text-center duration-300 border-[#00875A]  hover:bg-[#00875A] hover:text-white  px-2 py-4 rounded-md cursor-pointer"
            onClick={() => {
              dispatch(
                livePrompt("Set up my Pill #Remainder for 6:00 pm")
              );
            }}
          >
            <p className="">Set up my Pill #Remainder for 6:00 pm</p>
          </div>
          <div
            className="border-2 text-center duration-300 border-[#00875A]  hover:bg-[#00875A] hover:text-white  px-2 py-4 rounded-md cursor-pointer"
            onClick={() => {
              dispatch(
                livePrompt(
                  "I'm at an #Emergency suggest me some good hospital nearest to Chennai Thiruporur"
                )
              );
            }}
          >
            <p className="">
              I'm at an #Emergency suggest me some good hospital nearest to Chennai Thiruporur</p>
          </div>

          <div
            className="border-2 text-center duration-300 border-[#00875A]  hover:bg-[#00875A] hover:text-white  px-2 py-4 rounded-md cursor-pointer"
            onClick={() => {
              dispatch(
                livePrompt(
                  "These are my #Symptoms - Shortness of breath,Chest tightness or pain,Wheezing when exhaling, What could be the cause"
                )
              );
            }}
          >
            <p className="">These are my #Symptoms - Shortness of breath,Chest tightness or pain,Wheezing when exhaling, What could be the cause</p>
          </div>

      
        </div>
      </div>
    </div>
  );
});

export default New;
