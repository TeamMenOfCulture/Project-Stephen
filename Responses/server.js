const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

app.set("trust proxy", true);

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const initialText =
  "Suppose I am a paralysed person, and I can not communicate properly through voice, all i can do is moving my eyes and i communicate through that. People ask me questions and You are gonna provide me array of 3 possible answers(For some questions, make one reply positive, one negative and one neutral)\nFor example: ['reply1', 'reply2', 'reply3']\nI will choose one of the answers as my reply, SAY ONLY THOSE THINGS, WHAT A PARALYSED PERSON CAN DO\nTheir question: ";
async function run(prompt) {
  try {
    const result = await model.generateContent(initialText + prompt);
    const response = await result.response;
    const text = await response.text(); // Await here
    return text;
  } catch (error) {
    return "404 Not Found";
  }
}
// const regex = /'([^']*)'/g;

app.post("/generate", async (req, res) => {
  try {
    let ans = await run(req.body.prompt);
    console.log(ans);
    // const replies = ans.match(regex);

    // Find positions of apostrophes

    // const reply1 = replies[0];
    // const reply2 = replies[1];
    // const reply3 = replies[2];
    // console.log(reply1); // Output: reply1
    // console.log(reply2); // Output: reply2
    // console.log(reply3);
    res.send(ans);
  } catch (error) {
    res.send(error);
  }
});

app.get("/", (req, res) => {
  res.send("GET request to the homepage");
});

app.get("/generate", (req, res) => {
  res.send("GET request to the generate page");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
