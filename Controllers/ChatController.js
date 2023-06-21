import Chat from "../Models/ChatModel.js";

export const lockChat = async (req, res) => {
  const { chatId, userId } = req.params;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(500).json({ message: "Chat not found" });
    }

    if (chat?.lockedBy) {
      return res.status(500).json({ message: "Chat is already locked" });
    }

    chat.lockedBy = userId;
    try {
      await chat.save();
    } catch (error) {
      return res.status(500).json({ message: "Something Went Wrong" });
    }

    return res.status(200).json({ message: "Chat locked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const unlockChat = async (req, res) => {
  const { chatId, userId } = req.params;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(500).json({ message: "Chat not found" });
    }

    if (!chat?.lockedBy) {
      return res.status(500).json({ message: "Chat is already unlocked" });
    }
    if (chat?.lockedBy == userId) {
      chat.lockedBy = null;
      try {
        await chat.save();
      } catch (error) {
        return res.status(500).send({ message: "Something went Wrong" });
      }
    } else {
      return res.status(500).send({ message: "You can't unlocked this chat" });
    }

    return res.status(200).json({ message: "Chat unlocked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
