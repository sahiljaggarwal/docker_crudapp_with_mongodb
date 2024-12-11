require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Tweet = require("./models/Tweet");
const { default: mongoose } = require("mongoose");
const app = express();
const port = process.env.PORT ?? 3000;
const host = process.env.HOST ?? "localhost";
const dbUrl = process.env.DB_URL;

app.use(express.json());
app.use(cors());

app.route("/api/users/").get(async (req, res) => {
  try {
    const tweets = await Tweet.find();
    if (!tweets) {
      return res.status(404).json({ msg: "Tweets not found" });
    }
    return res.status(200).json({ data: tweets });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
app.route("/api/user/").post(async (req, res) => {
  try {
    const { title, tweetBy } = req.body;
    if (!title || !tweetBy) {
      return res.status(404).json({ msg: "title and tweetby are required" });
    }
    const tweet = await new Tweet({ title, tweetBy }).save();
    return res.status(200).json({ data: tweet });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app
  .route("/api/user/:id")
  .get(async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) {
        return res.status(404).json({ msg: "User not found" });
      }
      return res.status(200).json({ data: tweet });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  })
  .patch(async (req, res) => {
    try {
      const { title, tweetBy } = req.body;
      if (!title || !tweetBy) {
        return res.status(400).json({ msg: "Title and tweetBy are required" });
      }

      const updatedTweet = await Tweet.findByIdAndUpdate(
        req.params.id,
        { title, tweetBy },
        { new: true }
      );

      if (!updatedTweet) {
        return res.status(404).json({ msg: "User not found" });
      }

      return res.status(200).json({ data: updatedTweet });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  })
  .delete(async (req, res) => {
    try {
      const deletedTweet = await Tweet.findByIdAndDelete(req.params.id);
      if (!deletedTweet) {
        return res.status(404).json({ msg: "User not found" });
      }
      return res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

async function connectDB() {
  await mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("updated db is connected");
    })
    .catch((error) => {
      console.log("error on db connection , ", error);
    });
}
connectDB();
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
