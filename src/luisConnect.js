import axios from "axios";
import queryString from "query-string";
const luisUrl = process.env.LuisConnect
const headers = {
  "Ocp-Apim-Subscription-Key": process.env.LuisSubscriptionKey
};

export const getPredictionsFromLuis = async utterance => {
  try {
    const qs = {
      example: utterance,
      patternDetails: true,
      "multiple-intents": true
    };
    const response = await axios.get(luisUrl + queryString.stringify(qs), {
      headers
    });
    return response.data;
  } catch (er) {
    console.log(er);
    return er;
  }
};
