import Chat from "../Models/ChatModel.js";

const users = [];

const addUser = async ({ id, chatData }) => {
  let { user1Id, user2Id, user1name, user1contact, user2name, user2contact } =
    chatData;
  if (!user1Id || !user2Id)
    return { error: "sender and receiver ID are required." };

  let existingUser = await Chat.findOne({
    "user1.userid": user1Id,
    "user2.userId": user2Id,
  });
  if (existingUser) {
    return { user: existingUser, error: "" };
  }
  let existingUser0 = await Chat.findOne({
    "user2.userid": user1Id,
    "user1.userId": user2Id,
  });
  if (existingUser0) {
    return { user: existingUser0, error: "" };
  }

  let data = await Chat.create({
    user1: {
      userId: user1Id,
      name: user1name,
      contact: user1contact,
    },
    user2: {
      userId: user2Id,
      name: user2name,
      contact: user2contact,
    },
    chat: [],
  });
  return { user: data, error: "" };
};

const saveMessage = async (id) => {
  let data0 = {};

  try {
    let query1 = {
      user1: id.user1,
      user2: id.user2,
    };
    let data1 = await Chat.updateOne(query1, {
      $push: { chat: { text: id.message, sender: id.name } },
    });

    if (data1.nModified === 0) {
      let query2 = {
        user1: id.user2,
        user2: id.user1,
      };
      let data2 = await Chat.updateOne(query2, {
        $push: { chat: { text: id.message, sender: id.name } },
      });

      if (data2.nModified === 0) {
        data0 = { user: undefined, error: true };
      } else {
        data0 = { user: data2, error: false };
      }
    } else {
      data0 = { user: data1, error: false };
    }
  } catch (error) {
    data0 = { user: undefined, error: true };
  }

  return data0;
};

export const lockChat = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.lockedBy) {
      return res.status(400).json({ message: "Chat is already locked" });
    }

    chat.lockedBy = userId;
    await chat.save();

    return res.status(200).json({ message: "Chat locked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const unlockChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.lockedBy) {
      return res.status(400).json({ message: "Chat is already unlocked" });
    }

    chat.lockedBy = null;
    await chat.save();

    return res.status(200).json({ message: "Chat unlocked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addUser, saveMessage };
