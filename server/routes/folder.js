import { Router } from "express";
import dotnet from "dotenv";

import user from "../helpers/user.js";
import jwt from "jsonwebtoken";
import folder from "../helpers/folder.js";
dotnet.config();

let router = Router();

const CheckUser = async (req, res, next) => {
  jwt.verify(
    req.cookies?.userToken,
    process.env.JWT_PRIVATE_KEY,
    async (err, decoded) => {
      if (decoded) {
        let userData = null;

        try {
          userData = await user.checkUserFound(decoded);
        } catch (err) {
          if (err?.notExists) {
            res.clearCookie("userToken").status(405).json({
              status: 405,
              message: err?.text,
            });
          } else {
            res.status(500).json({
              status: 500,
              message: err,
            });
          }
        } finally {
          if (userData) {
            req.body.userId = userData._id;
            next();
          }
        }
      } else {
        res.status(405).json({
          status: 405,
          message: "Not Logged",
        });
      }
    }
  );
};

router.post("/addFolder", CheckUser, async (req, res) => {
  const { name, chatID ,userId, chatName } = req.body;
  console.log(chatName)
  let response = {};

  try {
    response = await folder.newFolder(name, chatID, userId,chatName);
  } catch (err) {
    console.log(err);
  }
});



router.put("/addExisting", CheckUser, async (req, res) => {
  const { folderId, chatId, userId, chatName } = req.body;
  let response = {};

  try {
    // Call the addExisting helper function from the folderController
    const result = await folder.addExisting(folderId, chatId, userId,chatName);
    console.log("DONEEE")
    // Check if the result is successful
    if (result.modifiedCount > 0) {
      response.success = true;
      response.message = "Chat added to folder successfully";
      res.status(200).json(response);
    } else {
      response.success = false;
      response.message = "Failed to add chat to folder";
      res.status(400).json(response);
    }
  } catch (err) {
    console.log(err);
    response.success = false;
    response.message = "Internal server error";
    res.status(500).json(response);
  }
});

router.get("/getFolderContents/:folderId", CheckUser, async (req, res) => {
  const { userId } = req.body;
  const { folderId } = req.params;
  console.log(userId+folderId)

  try {
    const contents = await folder.getFolderContents(userId, folderId);
    res.json(contents);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.delete("/deleteChat/:folderId/:chatId", CheckUser, async (req, res) => {
  const { userId } = req.body;
  const { folderId, chatId } = req.params;

  try {
    // Call the deleteChatFromFolder helper function from the folderController
    const result = await folder.deleteChatFromFolder(userId, folderId, chatId);

    if (result.modifiedCount > 0) {
      res.status(200).json({ success: true, message: "Chat deleted from folder successfully" });
    } else {
      res.status(400).json({ success: false, message: "Failed to delete chat from folder" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


router.get("/getFolders", CheckUser, async (req, res) => {
    console.log("HIII")
    const { userId } = req.body;
    
    try {
      const folders = await folder.getAllFolders(userId);
      console.log(folders)
      res.json(folders); // Sending folders back to the client

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" }); // Sending error response
    }
});

export default router;
