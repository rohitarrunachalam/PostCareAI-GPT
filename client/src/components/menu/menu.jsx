// const Menu = () => {
//   let path = window.location.pathname;

//   const menuRef = useRef(null);
//   const btnRef = useRef(null);
//   const settingRef = useRef(null);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { history } = useSelector((state) => state);
//   const [confirm, setConfim] = useState(false);

//   const logOut = async () => {
//     if (window.confirm("Do you want log out")) {
//       let res = null;
//       try {
//         res = await instance.get("/api/user/logout");
//       } catch (err) {
//         alert(err);
//       } finally {
//         if (res?.data?.status === 200) {
//           alert("Done");
//           dispatch(emptyUser());
//           navigate("/login");
//         }
//       }
//     }
//   };

//   const clearHistory = async (del) => {
//     if (del) {
//       let res = null;

//       try {
//         res = instance.delete("/api/chat/all");
//       } catch (err) {
//         alert("Error");
//         console.log(err);
//       } finally {
//         if (res) {
//           navigate("/chat");
//           dispatch(addHistory([]));
//         }

//         setConfim(false);
//       }
//     } else {
//       setConfim(true);
//     }
//   };

//   const showMenuMd = () => {
//     menuRef.current.classList.add("showMd");
//     document.body.style.overflowY = "hidden";
//   };

//   //Menu

//   useEffect(() => {
//     window.addEventListener("click", (e) => {
//       if (
//         !menuRef?.current?.contains(e.target) &&
//         !btnRef?.current?.contains(e.target)
//       ) {
//         menuRef?.current?.classList?.remove("showMd");
//         document.body.style.overflowY = "auto";
//       }
//     });

//     window.addEventListener("resize", () => {
//       if (!window.matchMedia("(max-width:767px)").matches) {
//         document.body.style.overflowY = "auto";
//       } else {
//         if (menuRef?.current?.classList?.contains("showMd")) {
//           document.body.style.overflowY = "hidden";
//         } else {
//           document.body.style.overflowY = "auto";
//         }
//       }
//     });
//   });

//   // History Get
//   useEffect(() => {
//     const getHistory = async () => {
//       let res = null;
//       try {
//         res = await instance.get("/api/chat/history");
//       } catch (err) {
//         console.log(err);
//       } finally {
//         if (res?.data) {
//           dispatch(addHistory(res?.data?.data));
//         }
//       }
//     };

//     getHistory();
//   }, [path]);

//   // History active
//   useEffect(() => {
//     setConfim(false);
//     let chatId = path.replace("/chat/", "");
//     chatId = chatId.replace("/", "");
//     dispatch(activePage(chatId));
//   }, [path, history]);

//   return (
//     <Fragment>
//       <header>
//         <div className="start">
//           <button onClick={showMenuMd} ref={btnRef}>
//             <Bar />
//           </button>
//         </div>

//         <div className="title">
//           {path.length > 6 ? history[0]?.prompt : "New chat"}
//         </div>

//         <div className="end">
//           <button
//             onClick={() => {
//               if (path.includes("/chat")) {
//                 navigate("/");
//               } else {
//                 navigate("/chat");
//               }
//             }}
//           >
//             <Plus />
//           </button>
//         </div>
//       </header>

//       <div className="menu" ref={menuRef}>
//         <div>
//           <button
//             type="button"
//             aria-label="new"
//             onClick={() => {
//               if (path.includes("/chat")) {
//                 navigate("/");
//               } else {
//                 navigate("/chat");
//               }
//             }}
//           >
//             <Plus />
//             New chat
//           </button>
//         </div>

//         <div className="history">
//           {history?.map((obj, key) => {
//             if (obj?.active) {
//               return (
//                 <button
//                   key={key}
//                   className="active"
//                   onClick={() => {
//                     navigate(`/chat/${obj?.chatId}`);
//                   }}
//                 >
//                   <Message />
//                   {obj?.prompt}
//                 </button>
//               );
//             } else {
//               return (
//                 <button
//                   key={key}
//                   onClick={() => {
//                     navigate(`/chat/${obj?.chatId}`);
//                   }}
//                 >
//                   <Message />
//                   {obj?.prompt}
//                 </button>
//               );
//             }
//           })}
//         </div>

//         <div className="actions">
//           {history?.length > 0 && (
//             <>
//               {confirm ? (
//                 <button onClick={() => clearHistory(true)}>
//                   <Tick />
//                   Confirm clear conversations
//                 </button>
//               ) : (
//                 <button onClick={() => clearHistory(false)}>
//                   <Trash />
//                   Clear conversations
//                 </button>
//               )}
//             </>
//           )}
//           <div className="text-white px-2 py-2 text-[14px]">
//             <Link to="/folders">Folders</Link>
//           </div>
//           <button onClick={logOut}>
//             <LogOut />
//             Log out
//           </button>
//         </div>
//       </div>

//       <div className="exitMenu">
//         <button>
//           <Xicon />
//         </button>
//       </div>
//     </Fragment>
//   );
// };

// export default Menu;
import FolderIcon from "../../assets/folder-icon.png";
import "../../index.css";
import { emptyUser } from "../../redux/user";
import React, { Fragment, useEffect, useRef, useState } from "react";
import instance from "../../config/instance";
import { useDispatch, useSelector } from "react-redux";
import { activePage, addHistory } from "../../redux/history";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { Bar, LogOut, Message, Plus, Tick, Trash, Xicon } from "../../assets/";

const Menu = () => {
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatHistory = useSelector((state) => state.history);
  const [hidden, sethidden] = useState(true);

  const [confirm, setConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshChat, setRefreshChat] = useState(false);
  let pathname = window.location.pathname;

  const newChat = () => {
    if (pathname.includes("/chat")) {
      navigate("/");
    } else {
      navigate("/chat");
    }
    setRefreshChat(!refreshChat)
  };

  const logOut = async () => {
    try {
      const res = await instance.get("/api/user/logout");
      if (res?.data?.status === 200) {
        dispatch(emptyUser());
        navigate("/login");
      }
    } catch (err) {
      console.log("Error logging out:", err);
    }
  };

  const clearHistory = async (del) => {
    if (del) {
      try {
        await instance.delete("/api/chat/all");
        navigate("/chat");
        dispatch(addHistory([]));
      } catch (err) {
        console.log("Error clearing conversation history:", err);
        alert("Error clearing conversation history");
      }
    } else {
      setConfirm(true);
    }
  };

  const showMenuMd = () => {
    menuRef.current.classList.add("showMd");
    document.body.style.overflowY = "hidden";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !btnRef.current.contains(event.target)
      ) {
        menuRef.current.classList.remove("showMd");
        document.body.style.overflowY = "auto";
      }
    };

    const handleResize = () => {
      if (!window.matchMedia("(max-width:767px)").matches) {
        document.body.style.overflowY = "auto";
      } else {
        if (menuRef.current.classList.contains("showMd")) {
          document.body.style.overflowY = "hidden";
        } else {
          document.body.style.overflowY = "auto";
        }
      }
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await instance.get("/api/chat/history");
        dispatch(addHistory(res?.data?.data));
      } catch (err) {
        console.log("Error fetching chat history:", err);
      }
    };

    getHistory();
  }, [refreshChat]);

  useEffect(() => {
    setConfirm(false);
    const chatId = location.pathname.replace("/chat/", "").replace("/", "");
    dispatch(activePage(chatId));
  }, [location.pathname, chatHistory]);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredChatHistory = chatHistory.filter((item) =>
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const dropDown = () => {
    if (hidden) {
      sethidden(!hidden);
    } else {
      sethidden(!hidden);
    }
  };

  return (
    <Fragment>
      <header>
        <div className="start">
          <button onClick={dropDown}>
            <Bar />
          </button>
        </div>

        <div className="title">
          {pathname.length > 6 ? history[0]?.prompt : "New chat"}
        </div>

        <div className="end">
          <button onClick={newChat}>
            <Plus />
          </button>
        </div>
      </header>
      <div className="md:hidden block">
        <div
          className={`${
            hidden
              ? "hidden"
              : "fixed w-full shadow-sm mt-2 flex  z-10 flex-col justify-between  h-[500px] text-left bg-[#1F2626] px-2 py-4"
          }   `}
        >
          <div className="">
            <input
              type="text"
              className=" mt-8 appearance-none inter-400  rounded-md border border-[#2D3838] rounded w-full py-2 px-3 bg-[#0D1A1A] text-[#A3BFBA] leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Search History..."
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <div
              className={`flex inter-400 flex-col gap-4 mt-4 overflow-y-scroll  max-h-[500px] `}
            >
              {filteredChatHistory.map((obj, key) => (
                <div className="flex items-center gap-2 text-white">
                  <Message />
                  <button
                    key={key}
                    className={obj.active ? "active" : ""}
                    onClick={() => {
                      navigate(`/chat/${obj.chatId}`);
                    }}
                  >
                    {obj.prompt}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex  flex-col gap-2 inter-500 text-white text-[14px] ">
            {chatHistory.length > 0 && (
              <>
                {confirm ? (
                  <div className="flex items-center  gap-2 inter-400">
                    <Tick />
                    <button onClick={() => clearHistory(true)}>
                      Please Confirm
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center  gap-2">
                    <Trash />
                    <button onClick={() => clearHistory(false)}>
                      Clear conversations
                    </button>
                  </div>
                )}
              </>
            )}
            <div className="flex items-center gap-2 text-white">
              <img src={FolderIcon} className="w-4" />
              <Link to="/folders">Folders</Link>
            </div>
            <div className="flex items-center gap-2 text-[#FF5555] ">
              <LogOut />
              <button onClick={logOut}>Log out</button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed hidden  p-4  w-[260px] md:flex md:flex-col bg-[#1F2626]  h-screen text-white justify-between"
        ref={menuRef}
      >
        <div>
          <div className="flex items-center  justify-between">
            <Link to="/chat" className="inter-600 text-[20px]">PostCare.AI</Link>
            <button
              type="button"
              onClick={newChat}
              className="border-2 rounded-md flex items-center justify-center hover:bg-[#2D3838] bg-[#0D1A1A] border-[#2D3838] text-[#A3BFBA]  p-2"
            >
              <Plus />
            </button>
          </div>

          <div className="mt-2 ">
            <input
              type="text"
              className=" mt-2 appearance-none inter-400  rounded-md border border-[#2D3838] rounded w-full py-2 px-3 bg-[#0D1A1A] text-[#A3BFBA] leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Search ..."
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <div
              className={`flex inter-400 flex-col gap-4 mt-4 overflow-y-scroll  md:max-h-[300px]  2xl:max-h-[600px] `}
            >
              {filteredChatHistory.map((obj, key) => (
                <>
                  <button
                    key={key}
                    onClick={() => {
                      navigate(`/chat/${obj.chatId}`);
                    }}
                    className={`flex items-center px-2 py-1 rounded-md ${
                      obj.active ? "bg-[#2D3838]" : ""
                    } hover:bg-[#2D3838]`}
                  >
                    <div className="">
                      <Message />
                    </div>
                    <div className="ml-2 text-[14px] text-left text-white">
                      {obj.prompt}
                    </div>
                  </button>
                </>
              ))}
            </div>
          </div>
        </div>

        {chatHistory.length > 4 && <hr className="" />}

        <div className="flex  flex-col gap-2 inter-400 text-[14px] text-white  ">
          {chatHistory.length > 0 && (
            <>
              {confirm ? (
                <div className="flex items-center gap-2 inter-400 hover:bg-[#2D3838] rounded-md px-2 py-1">
                  <Tick />
                  <button onClick={() => clearHistory(true)}>
                    Please Confirm
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 hover:bg-[#2D3838] rounded-md px-2 py-1">
                  <Trash />
                  <button onClick={() => clearHistory(false)}>
                    Clear conversations
                  </button>
                </div>
              )}
            </>
          )}
          <div className="flex items-center gap-2 text-white hover:bg-[#2D3838] rounded-md px-2 py-1">
            <img src={FolderIcon} className="w-4" />
            <Link to="/folders">Folders</Link>
          </div>
          <div className="flex items-center gap-2 py-1 hover:bg-[#2D3838] text-[#FF5555] rounded-md px-2">
            <LogOut />
            <button onClick={logOut}>Log out</button>
          </div>
        </div>
      </div>

      <div className="exitMenu">
        <button>
          <Xicon />
        </button>
      </div>
    </Fragment>
  );
};

export default Menu;
