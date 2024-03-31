import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import { ObjectId } from "mongodb";

export default {
  // newFolder: (name, chatId, userId,chatName) => {
  //   console.log("inga"+chatName)
  //   return new Promise(async (resolve, reject) => {
  //     let folderId = new ObjectId().toHexString();
  //     let res = null;
  //     let chatnameee = ""

  //     try {

  //       chatnameee = await db.collection(collections.CHAT).aggregate([
  //         {
  //           $match: {
  //             "user": "66087010343327c30f6b50e3" // Match documents with the given user ID
  //           }
  //         },
  //         {
  //           $unwind: "$data" // Unwind the data array
  //         },
  //         {
  //           $match: {
  //             "data.chatId": "660875cc5de22e0318100273" // Match documents with the given chatId within the unwound data array
  //           }
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             prompt: "$data.chats.prompt" // Project the prompt field from the matched document
  //           }
  //         }
  //       ]);
  //       console.log("ummm"+chatnameee)

  //       await db
  //         .collection(collections.FOLDER)
  //         .createIndex({ user: 1 }, { unique: true });
  //       res = await db.collection(collections.FOLDER).insertOne({
  //         user: userId.toString(),
  //         data: [
  //           {
  //             folderId,
  //             name: name,
  //             chats: [
  //               {
  //                 chatId,
  //                 chatName: chatnameee
  //               },
  //             ],
  //           },
  //         ],
  //       });
  //     } catch (err) {
  //       if (err?.code === 11000) {

  //         chatnameee = await db.collection(collections.CHAT).aggregate([
  //           {
  //             $match: {
  //               "user": "66087010343327c30f6b50e3" // Match documents with the given user ID
  //             }
  //           },
  //           {
  //             $unwind: "$data" // Unwind the data array
  //           },
  //           {
  //             $match: {
  //               "data.chatId": "660875cc5de22e0318100273" // Match documents with the given chatId within the unwound data array
  //             }
  //           },
  //           {
  //             $project: {
  //               _id: 0,
  //               prompt: "$data.chats.prompt" // Project the prompt field from the matched document
  //             }
  //           }
  //         ]);

  //         console.log("ymmmm"+chatnameee)

  //         res = await db
  //           .collection(collections.FOLDER)
  //           .updateOne(
  //             {
  //               user: userId.toString(),
  //             },
  //             {
  //               $push: {
  //                 data: {
  //                   folderId,
  //                   name: name,
  //                   chats: [
  //                     {
  //                       chatId,
  //                       chatName: chatnameee
  //                     },
  //                   ],
  //                 },
  //               },
  //             }
  //           )
  //           .catch((err) => {
  //             reject(err);
  //           });
  //       } else {
  //         reject(err);
  //       }
  //     } finally {
  //       if (res) {
  //         res.folderId = folderId;
  //         res.name = name;
  //         resolve(res);
  //       } else {
  //         reject({ text: "DB gets something wrong" });
  //       }
  //     }
  //   });
  // },

  newFolder: (name, chatId, userId, chatName) => {
    console.log("inga" + chatName);
    return new Promise(async (resolve, reject) => {
      let folderId = new ObjectId().toHexString();
      let res = null;
      let chatnameee = "";

      try {
        let res = await db
          .collection(collections.CHAT)
          .aggregate([
            {
              $match: {
                user: userId.toString(),
              },
            },
            {
              $unwind: "$data",
            },
            {
              $match: {
                "data.chatId": chatId,
              },
            },
            {
              $project: {
                _id: 0,
                chat: "$data.chats",
              },
            },
          ])
          .toArray()
          .catch((err) => [reject(err)]);

        const firstPrompt = res[0].chat[0].prompt
     
        await db
          .collection(collections.FOLDER)
          .createIndex({ user: 1 }, { unique: true });
        res = await db.collection(collections.FOLDER).insertOne({
          user: userId.toString(),
          data: [
            {
              folderId,
              name: name,
              chats: [
                {
                  chatId,
                  chatName: firstPrompt,
                },
              ],
            },
          ],
        });
      } catch (err) {
        if (err?.code === 11000) {

          let res = await db
          .collection(collections.CHAT)
          .aggregate([
            {
              $match: {
                user: userId.toString(),
              },
            },
            {
              $unwind: "$data",
            },
            {
              $match: {
                "data.chatId": chatId,
              },
            },
            {
              $project: {
                _id: 0,
                chat: "$data.chats",
              },
            },
          ])
          .toArray()
          .catch((err) => [reject(err)]);

        const firstPrompt = res[0].chat[0].prompt
     

       
          res = await db
            .collection(collections.FOLDER)
            .updateOne(
              {
                user: userId.toString(),
              },
              {
                $push: {
                  data: {
                    folderId,
                    name: name,
                    chats: [
                      {
                        chatId,
                        chatName: firstPrompt,
                      },
                    ],
                  },
                },
              }
            )
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(err);
        }
      } finally {
        if (res) {
          res.folderId = folderId;
          res.name = name;
          resolve(res);
        } else {
          reject({ text: "DB gets something wrong" });
        }
      }
    });
  },

  getAllFolders: (userId) => {
    console.log(userId);
    return new Promise(async (resolve, reject) => {
      try {
        // const folders = await db.collection(collections.FOLDER).find({ user: userId })
        //     .project({ _id: 0, data: { folderId: 1, name: 1 } })
        //     .toArray();

        let res = await db
          .collection(collections.FOLDER)
          .aggregate([
            {
              $match: {
                user: userId.toString(),
              },
            },
          ])
          .toArray()
          .catch((err) => [reject(err)]);

        resolve(res[0]?.data);
      } catch (err) {
        reject(err);
      }
    });
  },

  addExisting: (folderId, chatId, userId, chatName) => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await db
        .collection(collections.CHAT)
        .aggregate([
          {
            $match: {
              user: userId.toString(),
            },
          },
          {
            $unwind: "$data",
          },
          {
            $match: {
              "data.chatId": chatId,
            },
          },
          {
            $project: {
              _id: 0,
              chat: "$data.chats",
            },
          },
        ])
        .toArray()
        .catch((err) => [reject(err)]);

      const firstPrompt = res[0].chat[0].prompt
   
        const result = await db.collection(collections.FOLDER).updateOne(
          {
            user: userId.toString(),
            "data.folderId": folderId,
          },
          {
            $push: {
              "data.$.chats": { chatId, chatName: firstPrompt },
            },
          }
        );
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
  getFolderContents: (userId, folderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const folder = await db.collection(collections.FOLDER).findOne({
          user: userId.toString(),
          "data.folderId": folderId,
        });

        if (!folder) {
          reject({ message: "Folder not found" });
          return;
        }

        const folderData = folder.data.find(
          (folderItem) => folderItem.folderId === folderId
        );
        const contents = folderData ? folderData.chats : [];

        console.log(contents);
        resolve(contents);
      } catch (err) {
        reject(err);
      }
    });
  },

  deleteChatFromFolder: (userId, folderId, chatId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.collection(collections.FOLDER).updateOne(
          {
            user: userId.toString(),
            "data.folderId": folderId,
          },
          {
            $pull: {
              "data.$.chats": { chatId },
            },
          }
        );

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
};
