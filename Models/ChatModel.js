import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    user1: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: { type: String },
      contact: { type: String },
    },

    user2: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: { type: String },
      contact: { type: String },
    },

    chat: [{ text: { type: String }, sender: { type: String } }],

    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    roomID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
