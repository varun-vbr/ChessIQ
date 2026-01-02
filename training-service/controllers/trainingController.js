const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const axios = require("axios");
const mongoose = require("mongoose");
const OpenAI = require("openai");
const TrainingPlan = require("../models/trainingPlanModel");

exports.protect = catchAsync(async (req, res, next) => {
  debugger;
  const cookie = req.cookies.jwt;
  if (cookie) {
    try {
      const response = await axios.get(
        "http://localhost:3002/api/v1/user/protect",
        {
          headers: {
            Cookie: "jwt=" + cookie + ";",
          },
        }
      );
      if (response.status != 200) {
        return next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401
          )
        );
      }
      res.locals.userId = response.data.currentUser._id;
      return next();
    } catch (e) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
  } else {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
});

exports.explainMove = catchAsync(async (req, res, next) => {
  console.log(req.body);
  try {
    const client = new OpenAI({
      baseURL: "http://localhost:11434/v1", // Ollama endpoint
      apiKey: "ollama", // required but ignored
    });
    const response = await client.chat.completions.create({
      model: "myaniu/qwen2.5-1m:latest", // must exist in `ollama list`
      messages: [
        {
          role: "system",
          content:
            "You are a chess coach. Explain moves clearly to a club-level player.Be concrete, not verbose. Focus on one mistake at a time.",
        },
        {
          role: "user",
          content:
            "Explain why the move " +
            req.body.move +
            " is a " +
            req.body.classification +
            ". What was the main tactical problem? Why is " +
            req.body.bestMove +
            " better? Give one improvement tip." +
            req.body,
        },
      ],
    });
    console.log(response.choices[0].message.content);
    res.status(200).json({
      status: "success",
      data: {
        explaination: response.choices[0].message.content,
      },
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(e.message, 500));
  }
});

exports.trainMove = catchAsync(async (req, res, next) => {
  console.log(req.body);
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await client.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content:
            "You are a chess improvement coach. Create practical training plans. Avoid generic advice. Focus on drills and measurable goals.",
        },
        {
          role: "user",
          content:
            "Based on the data, create a 2-week training plan.\nInclude:\n- Daily focus\n- Concrete drills\n- Time split (tactics / openings / endgame)\n- One measurable goal per weakness" +
            JSON.stringify(req.body),
        },
      ],
    });

    const plan = await TrainingPlan.create({
      userId: new mongoose.Types.ObjectId(res.locals.userId),
      plan: response.choices[0].message.content,
    });
    console.log(response.choices[0].message.content);
    res.status(200).json({
      status: "success",
      data: {
        trainingPlan: plan,
      },
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(e.message, 500));
  }
});
