import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./style.scss";
import { useState, useEffect } from "react";
import instance from "../config/instance";
import FolderPic from "../assets/Folder.png";
const Folder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const { user, messages } = useSelector((state) => state);
  const { latest, content, all } = messages;
  const [folderNames, setFolderNames] = useState([]);

  useEffect(() => {
    fetchFolderNames();
  }, []);

  const fetchFolderNames = async () => {
    try {
      const response = await instance.get("/api/folder/getFolders");
      setFolderNames(response.data);
      console.log(folderNames);
    } catch (error) {
      console.log("Error fetching folder names:", error);
    }
  };

  const navigateToFolder = (folderId) => {
    navigate(`/folders/${folderId}`); // Navigate to the folder page
  };

  return (
    <>
      <div className="flex flex-col mx-10 mt-16 my-8">
        <div>
          <h1 className="text-[24px] inter-500">Group your chats into Folders.</h1>
        </div>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-16 inter-400 mt-16">
          {folderNames &&
            folderNames.map((folder, index) => (
              <>
                <button
                  onClick={() => navigateToFolder(folder.folderId)}
                  key={index}
                  className="flex items-center justify-center gap-4"
                >
                  <img src={FolderPic} className="w-16" />
                  <div>{folder.name}</div>
                </button>
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default Folder;
