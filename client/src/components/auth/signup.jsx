import React, { Fragment, useCallback, useReducer, useState } from "react";
import { GptIcon, Tick, Google, Microsoft, Mail } from "../../assets";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import FormFeild from "./FormFeild";
import axios from "axios";
import instance from "../../config/instance";
import "./style.scss";

const reducer = (state, { type, status }) => {
  switch (type) {
    case "filled":
      return { filled: status };
    case "error":
      return { error: status, filled: state.filled };
    case "mail":
      return { mail: status, error: !status };
    default:
      return state;
  }
};

const SignupComponent = () => {
  const navigate = useNavigate();

  const [state, stateAction] = useReducer(reducer, {
    filled: false,
    error: false,
  });

  const [formData, setFormData] = useState({
    email: "",
    pass: "",
    manual: false,
  });

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formHandle = async (e) => {
    e?.preventDefault();
    if (formData?.pass.length >= 8) {
      let res = null;
      try {
        res = await instance.post("/api/user/signup", formData);
      } catch (err) {
        console.log(err);
        if (err?.response?.data.message?.exists) {
          stateAction({ type: "error", status: true });
        } else {
          stateAction({ type: "error", status: false });
        }
      } finally {
        if (res?.data?.status === 208) {
          navigate("/");
        } else if (res?.["data"]?.data?.manual) {
          stateAction({ type: "mail", status: true });
        } else if (res) {
          stateAction({ type: "error", status: false });
          if (res["data"]?.data?._id)
            navigate(`/signup/pending/${res?.["data"]?.data._id}`);
        }
      }
    }
  };



  const passwordClass = useCallback((remove, add) => {
    document.querySelector(remove).classList?.remove("active");
    document.querySelector(add).classList?.add("active");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="">
        <GptIcon />
      </div>

      {!state.mail ? (
        <Fragment>
          <div className="text-center my-4">
            <h1 className="text-[20px] inter-500">Create your account</h1>

            <p className="text-[14px] mt-4 inter-400">
              Please enter the following to continue
            </p>
          </div>

          {!state.filled ? (
            <div className="options">
              <form
                className="manual"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormData({ ...formData, manual: true });
                  stateAction({ type: "filled", status: true });
                }}
              >
                <div>
                  <FormFeild
                    value={formData.email}
                    name={"email"}
                    label={"Email address"}
                    type={"email"}
                    handleInput={handleInput}
                  />
                </div>
                <div>
                  <button type="submit"  className="bg-black inter-500 text-white w-full py-2 rounded-md my-4">Continue</button>
                </div>
              </form>

              <div  className="text-[14px] text-center inter-400">
                <span className="mr-2">Already have an account?</span>
                <Link to={"/login/auth"}>Log in</Link>
              </div>

     
            </div>
          ) : (
            <form className="Form" onSubmit={formHandle}>
              <div>
                <div className="email inter-500">
                  <button
                    type="button"
                    onClick={() => {
                      stateAction({ type: "filled", status: false });
                    }}
                  >
                    Edit
                  </button>

                  <FormFeild
                    value={formData.email}
                    name={"email"}
                    type={"email"}
                    isDisabled
                    error={state?.error}
                  />
                </div>

                <div>
                  {state?.error && (
                    <div className="error">
                      <div>!</div> The user already exists.
                    </div>
                  )}
                </div>

                <div className="my-2">
                  <FormFeild
                    value={formData.pass}
                    name={"pass"}
                    label={"Password"}
                    type={"password"}
                    passwordClass={passwordClass}
                    handleInput={handleInput}
                  />
                </div>

                <div id="alertBox" className="text-[14px] inter-400">
                  Your password must contain:
                  <p id="passAlertError" className="">
                    <span>&#x2022;</span>
                    &nbsp; At least 8 characters
                  </p>
           
                </div>

                <button type="submit" className="bg-black text-white w-full py-2 rounded-md my-2">Continue</button>
              </div>
              <div data-for="acc-sign-up-login" className="text-center text-[14px]">
                <span className="mr-2">Already have an account?</span>
                <Link to={"/login/auth"}>Log in</Link>
              </div>
            </form>
          )}
        </Fragment>
      ) : (
        <div className="text-center">
          {/* <div className="w-[50px] h-[50px]">
            <Mail />
          </div> */}

          <div className="my-2">
            <h3 className="text-[20px] inter-500">Check Your Email</h3>
          </div>

          <div className="my-2">
            <p className="inter-400">
              Please check the email address {formData.email} for instructions
              to signup.
            </p>
          </div>

          <button onClick={() => formHandle(null)} className="bg-black text-white w-full py-2 rounded-md my-4">Resend Mail</button>
        </div>
      )}
    </div>
  );
};

export default SignupComponent;
