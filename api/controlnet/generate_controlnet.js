const axios = require("axios");
const message = require("../config/Message");
const statusCode = require("../config/statusCode.js");
const errorCode = require("../config/errorCode");
const utils = require("../utils/utils");

module.exports.handler = async (event) => {
  try {
    if (!event.body) {
      return utils.sendResponse(statusCode.BAD_REQUEST, {
        errorCode: errorCode.BAD_REQUEST,
        message: message.BAD_REQUEST,
      });
    }
    const reqData = JSON.parse(event.body);
    reqData.a_prompt =
      "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning";
    reqData.structure = "seg";

    console.log(reqData);

    const body = {
      version: process.env.CONTROLNET_AI_MODEL_VERSION,
      input: reqData,
    };

    const headers = {
      Authorization: `Token ${process.env.TOKEN_API_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": `scribble-node/1.0.0`,
    };

    const response = await axios.post(process.env.BASE_REPLICATE_URL, body, {
      headers: headers,
    });
    if (response.status !== 201) {
      let error = response;
      return utils.sendResponse(500, {
        message: "Error occur ha",
        data: error.detail,
      });
    }
    return utils.sendResponse(200, response.data.id);
  } catch (err) {
    console.log("Error occured", err);
    return utils.sendResponse(500, { message: "Couldn't create this player!" });
  }
};
