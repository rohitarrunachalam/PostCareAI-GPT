import React, { useEffect, useReducer, useRef } from "react";
import { Reload, Rocket, Stop } from "../assets";
import { Chat, New } from "../components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../redux/loading";
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";
import { emptyUser } from "../redux/user";
import instance from "../config/instance";
import "./style.scss";

const reducer = (state, { type, status }) => {
  switch (type) {
    case "chat":
      return {
        chat: status,
        loading: status,
        resume: status,
        actionBtns: false,
      };
    case "error":
      return {
        chat: true,
        error: status,
        resume: state.resume,
        loading: state.loading,
        actionBtns: state.actionBtns,
      };
    case "resume":
      return {
        chat: true,
        resume: status,
        loading: status,
        actionBtns: true,
      };
    default:
      return state;
  }
};

const Main = () => {
  let location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const chatRef = useRef();

  const { user } = useSelector((state) => state);

  const { id = null } = useParams();

  const [status, stateAction] = useReducer(reducer, {
    chat: false,
    error: false,
    actionBtns: false,
  });

  useEffect(() => {
    if (user) {
      dispatch(emptyAllRes());
      setTimeout(() => {
        if (id) {
          const getSaved = async () => {
            let res = null;
            try {
              res = await instance.get("/api/chat/saved", {
                params: {
                  chatId: id,
                },
              });
            } catch (err) {
              console.log(err);
              if (err?.response?.data?.status === 404) {
                navigate("/404");
              } else {
                alert(err);
                dispatch(setLoading(false));
              }
            } finally {
              if (res?.data) {
                dispatch(addList({ _id: id, items: res?.data?.data }));
                stateAction({ type: "resume", status: false });
                dispatch(setLoading(false));
              }
            }
          };

          getSaved();
        } else {
          stateAction({ type: "chat", status: false });
          dispatch(setLoading(false));
        }
      }, 1000);
    }
  }, [location]);

  return (
    <div className="">
      <div className="contentArea">
        {status.chat ? <Chat ref={chatRef} error={status.error} /> : <New />}
      </div>

      <InputArea status={status} chatRef={chatRef} stateAction={stateAction} />
    </div>
  );
};

export default Main;

//Input Area
const InputArea = ({ status, chatRef, stateAction }) => {
  let textAreaRef = useRef();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { prompt, content, _id } = useSelector((state) => state.messages);

  useEffect(() => {
    textAreaRef.current?.addEventListener("input", (e) => {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    });
  });


  

  const FormHandle = async () => {
    if (prompt?.length > 0) {
      stateAction({ type: "chat", status: true });

      let chatsId = Date.now();

      dispatch(insertNew({ id: chatsId, content: "", prompt }));
      chatRef?.current?.clearResponse();

      let res = null;

      try {
        if (_id) {
          res = await instance.put("/api/chat", {
            chatId: _id,
            prompt,
          });
        } else {
          res = await instance.post("/api/chat", {
            prompt,
          });
        }
      } catch (err) {
        console.log(err);
        if (err?.response?.data?.status === 405) {
          dispatch(emptyUser());
          dispatch(emptyAllRes());
          navigate("/login");
        } else {
          stateAction({ type: "error", status: true });
        }
      } finally {
        if (res?.data) {
          const { _id, content } = res?.data?.data;

          dispatch(insertNew({ _id, fullContent: content, chatsId }));

          chatRef?.current?.loadResponse(stateAction, content, chatsId);

          stateAction({ type: "error", status: false });
        }
      }
    }
  };

  return (
    <div className="">
      {!status.error ? (
        <>
          <div className="inter-500">
             {status.chat && content?.length > 0 && status.actionBtns && ( 
            <>
                {!status?.resume ? ( 
            <div className="flex items-center fixed justify-center px-4 py-2 rounded-md mx-auto border-2 bottom-24 left-1/4 md:left-1/2  border-[#00875A] w-fit">
              <div className="">
                <Reload />
              </div>
              <button
                className="ml-2"
                onClick={() => {
                  chatRef.current.loadResponse(stateAction);
                }}
              >
                Regenerate response
              </button>
            </div>
             ) : ( 
            <div className="flex items-center fixed justify-center px-4 py-2 rounded-md mx-auto border-2 bottom-24 left-1/4 md:left-1/2  border-[#00875A] w-fit">
              <div>
                <Stop />
              </div>
              <button
               className="ml-2"
                onClick={() => {
                  chatRef.current.stopResponse(stateAction);
                }}
              >
                Stop generating
              </button>
            </div>

             )}
              </> 
           )}
          </div>

          <div className="w-screen  fixed bottom-4 inter-400">
            <div className="flex items-center gap-2 mx-8">
              <div className="w-[100%] md:w-[75%]">
                <input
                  type="text"
                  className="w-full px-2 py-4 focus:outline-none border-2 border-[#D7E5DE] rounded-md "
                  placeholder="What's is in your mind..."
                  ref={textAreaRef}
                  value={prompt}
                  onChange={(e) => {
                    dispatch(livePrompt(e.target.value));
                  }}
                />
              </div>
              <button onClick={FormHandle} className="bg-[#00875A] p-2.5 rounded-md text-white">
                <div >{<Rocket />}</div>
              </button>
            </div>

            {/* {status.chat && content?.length > 0 && status.actionBtns && (
              <>
                {!status?.resume ? (
                  <div className="">
                    <button
                      onClick={() => {
                        chatRef.current.loadResponse(stateAction);
                      }}
                    >
                      <Reload />
                    </button> 
                  </div>
                ) : (
                  <div className="">
                    <button
                      onClick={() => {
                        chatRef.current.stopResponse(stateAction);
                      }}
                    >
                      <Stop />
                    </button>
                  </div>
                )}
              </>
            )} */}
          </div>
        </>
      ) : (
        <div className="error">
          <p>There was an error generating a response</p>
          <button onClick={FormHandle}>
            <Reload />
            Regenerate response
          </button>
        </div>
      )}
    </div>
  );
};
