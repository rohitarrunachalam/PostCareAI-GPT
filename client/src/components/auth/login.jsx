import React, { useReducer, useState } from "react";
import { GptIcon, Google, Microsoft } from "../../assets";
import { Link, useNavigate } from "react-router-dom";
import FormFeild from "./FormFeild";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { insertUser } from "../../redux/user";
import instance from "../../config/instance";
import "./style.scss";

const reducer = (state, { type, status }) => {
  switch (type) {
    case "filled":
      return { filled: status };
    case "error":
      return { error: status, filled: state.filled };
    default:
      return state;
  }
};

const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [state, stateAction] = useReducer(reducer, {
    filled: false,
    error: false,
  });

  const [formData, setFormData] = useState({
    email: "",
    pass: "",
    manual: true,
  });

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formHandle = async (e, googleData) => {
    e?.preventDefault();
    let res = null;
    try {
      res = await instance.get("/api/user/login", {
        params: googleData || formData,
      });
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.status === 422) {
        stateAction({ type: "error", status: true });
      }
    } finally {
      if (res?.data) {
        stateAction({ type: "error", status: false });
        dispatch(insertUser(res.data.data));
        navigate("/");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="">
        <GptIcon />
      </div>

      <div className="mt-4 inter-500 text-[20px]">
        {!state.filled ? <h1>Welcome back</h1> : <h1>Enter your password</h1>}
      </div>

      {!state.filled ? (
        <div className="mt-4">
          <form
            className="manual"
            onSubmit={(e) => {
              e.preventDefault();
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
              <button type="submit" className="bg-black text-white w-full py-2 rounded-md my-4 inter-500">Continue</button>
            </div>
          </form>

          <div className="text-[14px] text-center inter-400 ">
            <span className="mr-2">Don't have an account?</span>
            <Link to={"/signup"}>Sign up</Link>
          </div>
        </div>
      ) : (
        <form className="mt-4" onSubmit={formHandle}>
          <div>
            <div className="inter-500">
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
              />
            </div>

            <div className="mt-4">
              <FormFeild
                value={formData.pass}
                name={"pass"}
                label={"Password"}
                type={"password"}
                handleInput={handleInput}
                error={state?.error}
              />
            </div>

            <div>
              {state?.error && (
                <div className="inter-400">
                  <div>!</div> Email or password wrong.
                </div>
              )}
            </div>

            <button type="submit" className="bg-black text-white inter-500 w-full py-2 rounded-md my-4">Continue</button>

            <div className="text-[14px] inter-400">
              <Link to={"/forgot"}>Forgot password?</Link>
            </div>
          </div>
          <div data-for="acc-sign-up-login" className="inter-400 text-center mt-4 text-[14px]">
            <span className="mr-2">Don't have an account?</span>
            <Link to={"/signup"}>Sign up</Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginComponent;
