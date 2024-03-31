import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import instance from "../../config/instance";
import { useNavigate } from "react-router-dom";
import FolderPic from "../../assets/Folder.png"
import chatIcon from "../../assets/chat.png"
import binIcon from "../../assets/bin.png"
import { useDispatch, useSelector } from "react-redux";
const FolderPage = () => {
  const { id } = useParams(); // Get the folderId from the URL params
  const [folderContent, setFolderContent] = useState([]);
  const [chatDeleted, setChatDeleted] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    fetchFolderContent();
  }, [id, chatDeleted]);

 


  
  const fetchFolderContent = async () => {
    try {
      const response = await instance.get(
        `/api/folder/getFolderContents/${id}`
      ); // Fetch folder contents by folderId
      setFolderContent(response.data);
      console.log(folderContent.data);
    } catch (error) {
      console.log("Error fetching folder content:", error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const response = await instance.delete(
        `/api/folder/deleteChat/${id}/${chatId}`
      ); // Assuming you have access to folderId
      setChatDeleted(response.data);
    } catch (error) {
      console.log("Error deleting chat:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col mx-10 mt-16 my-8">
      <div className="flex items-center">
        <img src={FolderPic}  className="w-8"/>
        <h1 className="text-[24px] ml-4 inter-500">Folder Contents</h1>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 mt-8 gap-8 inter-400">
        {folderContent.map((item, index) => (
          <div className="flex items-center">
            <img src={chatIcon} className="w-6"/>
            <button
              onClick={() => navigate(`/chat/${item.chatId}`)}
              key={index}
              className="ml-2"
            >
              {item.chatName}
            </button>

            <button className="ml-2" onClick={() => deleteChat(item.chatId)}>
              <img src={binIcon} className="w-4"/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderPage;
