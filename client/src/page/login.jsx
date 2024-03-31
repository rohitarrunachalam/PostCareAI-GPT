import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GptIcon } from "../assets";
import { LoginComponent } from "../components";
import { setLoading } from "../redux/loading";
import "./style.scss";

const Login = () => {
  const location = useLocation();

  const [auth, setAuth] = useState(false);

  const { user } = useSelector((state) => state);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      if (location?.pathname === "/login/auth") {
        setAuth(true);
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      } else {
        setAuth(false);
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      }
    }
  }, [location]);

  return (
    <div className="">
      <div className="">
        {auth ? (
          <LoginComponent />
        ) : (
          <div className="flex items-center justify-center flex-col h-screen">
            <div>
              <GptIcon />
            </div>

            <div className="text-center mt-4">
              <p className="inter-500 text-[20px]">Welcome to PostCare.AI</p>
              <p className="inter-400">Log in with your OpenAI account to continue</p>
            </div>

            <div className="mt-8 inter-400">
              <button className="bg-black px-4 py-2 text-white rounded-md mx-2"
                onClick={() => {
                  navigate("/login/auth");
                }}
              >
                Log in
              </button>
              <button className="bg-black px-4 py-2 text-white rounded-md mx-2"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign up
              </button>
            </div>
          </div>
        )}

  
      </div>
    </div>
  );
};

export default Login;
