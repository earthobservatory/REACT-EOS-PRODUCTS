import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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", //process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const OpenAIAPI = async (prompt) => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 150,
    });

    return completion.data.choices[0].text;
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
};

export default OpenAIAPI;
