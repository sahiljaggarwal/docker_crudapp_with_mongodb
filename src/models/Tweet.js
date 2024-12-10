const { Schema, model } = require("mongoose");

const tweetSchema = Schema(
  {
    title: {
      type: String,
    },
    tweetBy: {
      type: String,
    },
  },
  { timestamps: true }
);

const Tweet = model("Tweet", tweetSchema);
module.exports = Tweet;
