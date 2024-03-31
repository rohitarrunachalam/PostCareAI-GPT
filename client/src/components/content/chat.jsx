import React, {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { GptIcon } from "../../assets";
import { insertNew } from "../../redux/messages";
import "./style.scss";
import { useState, useEffect } from "react";
import FormFeild from "../auth/FormFeild";
import instance from "../../config/instance";
import Plus from "../../assets/plus";
const Chat = forwardRef(({ error }, ref) => {
  const dispatch = useDispatch();

  const contentRef = useRef();
  const [hidden, sethidden] = useState(true);
  const { user, messages } = useSelector((state) => state);
  const { latest, content, all } = messages;
  const [folderNames, setFolderNames] = useState([]);
  const [folderAdded, setFolderAdded] = useState();
  const { history } = useSelector((state) => state);

  useEffect(() => {
    fetchFolderNames();
  }, [folderAdded]);

  const fetchFolderNames = async () => {
    try {
      const response = await instance.get("/api/folder/getFolders");
      setFolderNames(response.data);
    } catch (error) {
      console.log("Error fetching folder names:", error);
    }
  };

  const addtoFolder = async (folderId) => {
    try {
      const response = await instance.put("/api/folder/addExisting", {
        folderId,
        chatId: messages._id,
        chatName: history[0]?.prompt,
      });
      setFolderAdded(response.data);
      sethidden(!hidden);
    } catch (error) {
      console.log("Error fetching folder names:", error);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    chatID: "",
    chatName: "",
  });
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formHandle = async (e) => {
    e.preventDefault();
    formData.chatID = messages._id;
    formData.chatName = history[0]?.prompt;

    if (formData) {
      try {
        res = await instance.post("/api/folder/addFolder", formData);
        sethidden(true);
        console.log(hidden);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const loadResponse = (
    stateAction,
    response = content,
    chatsId = latest?.id
  ) => {
    clearInterval(window.interval);

    stateAction({ type: "resume", status: true });

    contentRef?.current?.classList?.add("blink");

    let index = 0;

    window.interval = setInterval(() => {
      if (index < response.length && contentRef?.current) {
        if (index === 0) {
          dispatch(insertNew({ chatsId, content: response.charAt(index) }));
          contentRef.current.innerHTML = response.charAt(index);
        } else {
          dispatch(
            insertNew({
              chatsId,
              content: response.charAt(index),
              resume: true,
            })
          );
          contentRef.current.innerHTML += response.charAt(index);
        }
        index++;
      } else {
        stopResponse(stateAction);
      }
    }, 20);
  };

  const stopResponse = (stateAction) => {
    if (contentRef?.current) {
      contentRef.current.classList.remove("blink");
    }
    stateAction({ type: "resume", status: false });
    clearInterval(window.interval);
  };

  useImperativeHandle(ref, () => ({
    stopResponse,
    loadResponse,
    clearResponse: () => {
      if (contentRef?.current) {
        contentRef.current.innerHTML = "";
        contentRef?.current?.classList.add("blink");
      }
    },
  }));

  const dropDown = () => {
    if (hidden) {
      sethidden(!hidden);
    } else {
      sethidden(!hidden);
    }
  };

  // const handleInChange = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  return (
    <div>
      <div className="flex items-center justify-between mx-10 my-8 mt-16">
        <h1 className="text-[24px] inter-500">Hey {user.fName}!</h1>
        {/* <div className="  bg-black rounded-md text-white w-fit px-4 py-2">
          Add to Folder
        </div> */}

        <div className={` text-[#00875A]`}>
          <button
            type="button"
            className={`flex w-full transition inter-500 duration-75 rounded-lg  px-[32px]`}
            onClick={dropDown}
          >
            <span className={``}>Add to Folder</span>
            <svg
              className={`w-3 h-3 whitespace-nowrap ms-3 mt-2  transform 
          transition duration-500 ease-in-out ${
            !hidden ? "rotate-180" : "rotate-0"
          }  `}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <ul
            className={`${
              hidden
                ? "hidden"
                : "absolute mt-3 mx-4 py-2 inter-400 text-left  pb-2  bg-[#0D1A1A] text-[#A3BFBA] shadow-md rounded-md"
            }   `}
          >
            <div className=" flex flex-col overflow-y-scroll max-h-[150px] ">
              {folderNames &&
                folderNames.map((folder, index) => (
                  <button
                    className="hover:bg-[#0D1A1A] py-1 duration-300 hover:text-white"
                    onClick={() => addtoFolder(folder.folderId)}
                    key={index}
                  >
                    {folder.name}
                  </button>
                ))}
            </div>

            <div className="flex mt-2  gap-2 px-2">
              <input
                type="text"
                className="appearance-none  rounded-md border border-[#2D3838] rounded w-full py-2 px-3 bg-[#0D1A1A] text-[#A3BFBA] leading-tight focus:outline-none focus:shadow-outline"
                placeholder="New Folder"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <button
                type="button"
                onClick={formHandle}
                className="rounded-md flex items-center justify-center hover:bg-[#2D3838]  bg-[#0D1A1A] text-[#A3BFBA]  px-1"
              >
                <Plus />
              </button>
            </div>
          </ul>
        </div>
      </div>

      <div className="Chat inter-400">
        {all
          ?.filter((obj) => {
            return !obj.id ? true : obj?.id !== latest?.id;
          })
          ?.map((obj, key) => {
            return (
              <Fragment key={key}>
                <div className="qs">
                  <div className="acc">{user?.fName?.charAt(0)}</div>
                  <div className="txt">{obj?.prompt}</div>
                </div>

                <div className="res">
                  <div className="icon">
                    <GptIcon />
                  </div>
                  <div className="txt">
                    <span>{obj?.content}</span>
                  </div>
                </div>
              </Fragment>
            );
          })}

        {latest?.prompt?.length > 0 && (
          <Fragment>
            <div className="qs">
              <div className="acc">{user?.fName?.charAt(0)}</div>
              <div className="txt">{latest?.prompt}</div>
            </div>

            <div className="res">
              <div className="icon">
                <GptIcon />
                {error && <span>!</span>}
              </div>
              <div className="txt">
                {error ? (
                  <div className="error">
                    Something went wrong. If this issue persists please contact
                    us through our help center at help.openai.com.
                  </div>
                ) : (
                  <span ref={contentRef} className="blink" />
                )}
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
});
export default Chat;
