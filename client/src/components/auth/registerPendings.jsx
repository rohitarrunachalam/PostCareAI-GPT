import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GptIcon } from "../../assets";
import instance from "../../config/instance";
import "./style.scss";

const RegisterPendings = ({ _id }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
  });

  const formHandle = async (e) => {
    e.preventDefault();
    if (formData?.fName && formData?.lName) {
      let res = null;
      try {
        res = await instance.put("/api/user/signup-finish", {
          fName: formData.fName,
          lName: formData.lName,
          _id,
        });
      } catch (err) {
        console.log(err);
        if (err?.response?.data?.status === 422) {
          alert("Already Registered");
          navigate("/login");
        } else {
          alert(err);
        }
      } finally {
        if (res?.data?.status === 208) {
          navigate("/");
        } else if (res) {
          navigate("/login");
        }
      }
    } else {
      alert("Enter full name");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="">
        <GptIcon />
      </div>

      <h1 className="my-2 inter-500 text-[20px]">Tell us about you</h1>

      <form className="my-2" onSubmit={formHandle}>
        <div className="flex gap-4">
          <input
            type="text"
            className="shadow mt-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.fName}
            placeholder="First name"
            onInput={(e) => {
              setFormData({ ...formData, fName: e.target.value });
            }}
          />
          <input
            type="text"
            className="shadow mt-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.lName}
            placeholder="Last name"
            onInput={(e) => {
              setFormData({ ...formData, lName: e.target.value });
            }}
          />
        </div>

        <button type="submit" className="bg-black inter-500 text-white w-full py-2 rounded-md my-4">Continue</button>

        <div className="text-[14px] text-center inter-400">
          <p>
            By clicking "Continue", you agree to our <span>Terms</span>, <br />
            <span>Privacy policy</span> and confirm you're 18 years or older.
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPendings;
