import { Router } from "express";
import dotnet from "dotenv";

import user from "../helpers/user.js";
import jwt from "jsonwebtoken";
import chat from "../helpers/chat.js";
import OpenAI from "openai";
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

// const configuration = new Configuration({
//     organization: process.env.OPENAI_ORGANIZATION,
//     apiKey: process.env.OPENAI_API_KEY
// })

// const openai = new OpenAIApi(configuration)
// const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get("/", (req, res) => {
  res.send("Welcome to chatGPT api v1");
});

router.post("/", CheckUser, async (req, res) => {
  const { prompt, userId } = req.body;

  let response = {};

  try {
    // response.openai = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: prompt,
    //     temperature: 0,
    //     max_tokens: 100,
    //     top_p: 1,
    //     frequency_penalty: 0.2,
    //     presence_penalty: 0,
    // });

    // console.log("btw")

    if (prompt.includes("#Appointment")) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a Healthcare assistant who schedules Appointment. Based on the prompt provided schedule the appointment. Also give me 3 follow-up questions related to the prompt asked.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;

      response.openai = res;
    } else if (prompt.includes("#Symptoms")) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a Healthcare (Symptom Checker) assistant. Based on the symptoms provided in the prompt message, give me a list of potential causes (disclaimer: emphasizing it's not a diagnosis) and suggest reliable medical resources.  Also give me 3 follow-up questions related to the prompt asked.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;

      response.openai = res;
    } else if (prompt.includes("#Emergency")) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a Telehealth assistant. Give the nearest hospital locations around city specified in prompt. Also give me 3 follow-up questions related to the prompt asked.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;

      response.openai = res;
    } else if (prompt.includes("#Remainder")) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a healthcare assistant. Act as a Pill Remainder Setter for the given prompt message. Also give me 3 follow-up questions related to the prompt asked.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;

      response.openai = res;
    } else {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a healthcare assistant. Only reply to prompts related to healthcare. Else send a message saying you are only restricted to healthcare related prompts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;

      response.openai = res;
    }
    if (response?.openai) {
      let index = 0;
      for (let c of response["openai"]) {
        if (index <= 1) {
          if (c == "\n") {
            response.openai = response.openai.slice(1, response.openai.length);
          }
        } else {
          break;
        }
        index++;
      }
      response.db = await chat.newResponse(prompt, response, userId);
    }
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    res.status(500).json({
      status: 500,
      message: "Error in OpenAI API call:",
      error,
    });
    // res.status(500).json({
    //     status: 500,
    //     message: err
    // })
  } finally {
    if (response?.db && response?.openai) {
      res.status(200).json({
        status: 200,
        message: "Success",
        data: {
          _id: response.db["chatId"],
          content: response.openai,
        },
      });
    }
  }
});

router.put("/", CheckUser, async (req, res) => {
  const { prompt, userId, chatId } = req.body;

  let response = {};

  try {
    // response.openai = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: prompt,
    //     temperature: 0.7,
    //     max_tokens: 100,
    //     top_p: 1,
    //     frequency_penalty: 0.2,
    //     presence_penalty: 0,
    // });

    if (prompt.includes("#Appointment")) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a Healthcare assistant who schedules Appointment. Based on the prompt provided schedule the appointment.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;

      response.openai = res;
    } else if (prompt.includes("#Symptoms")) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a Healthcare (Symptom Checker) assistant. Based on the symptoms provided in the prompt message, give me a list of potential causes (disclaimer: emphasizing it's not a diagnosis) and suggest reliable medical resources",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;

      response.openai = res;
    } else if (prompt.includes("#Emergency")) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a Telehealth assistant. Give the nearest hospital locations around city specified in prompt.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;

      response.openai = res;
    } else if (prompt.includes("#Remainder")) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a healthcare assistant. Act as a Pill Remainder Setter for the given prompt message. Also give me 3 follow-up questions related to the prompt asked.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;

      response.openai = res;
    } else {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a healthcare assistant. Only reply to prompts related to healthcare. Else send a message saying you are only restricted to healthcare related prompts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;

      response.openai = res;
    }

    if (response?.openai) {
      let index = 0;
      for (let c of response["openai"]) {
        if (index <= 1) {
          if (c == "\n") {
            response.openai = response.openai.slice(1, response.openai.length);
          }
        } else {
          break;
        }
        index++;
      }
      response.db = await chat.updateChat(chatId, prompt, response, userId);
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  } finally {
    if (response?.db && response?.openai) {
      res.status(200).json({
        status: 200,
        message: "Success",
        data: {
          content: response.openai,
        },
      });
    }
  }
});

router.get("/saved", CheckUser, async (req, res) => {
  const { userId } = req.body;
  const { chatId = null } = req.query;

  let response = null;

  try {
    response = await chat.getChat(userId, chatId);
  } catch (err) {
    if (err?.status === 404) {
      res.status(404).json({
        status: 404,
        message: "Not found",
      });
    } else {
      res.status(500).json({
        status: 500,
        message: err,
      });
    }
  } finally {
    if (response) {
      res.status(200).json({
        status: 200,
        message: "Success",
        data: response,
      });
    }
  }
});

router.get("/history", CheckUser, async (req, res) => {
  const { userId } = req.body;

  let response = null;

  try {
    response = await chat.getHistory(userId);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  } finally {
    if (response) {
      res.status(200).json({
        status: 200,
        message: "Success",
        data: response,
      });
    }
  }
});

router.delete("/all", CheckUser, async (req, res) => {
  const { userId } = req.body;

  let response = null;

  try {
    response = await chat.deleteAllChat(userId);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  } finally {
    if (response) {
      res.status(200).json({
        status: 200,
        message: "Success",
      });
    }
  }
});

export default router;
