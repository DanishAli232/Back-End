import Chat from "../Models/ChatModel.js";

const users = [];

const addUser = async ({ id, chatData }) => {
  let { user1Id, user2Id } = chatData;
  if (!user1Id || !user2Id)
    return { error: "sender and receiver ID are required." };
  let existingUser = await Chat.findOne({
    "user1.userid": user1Id,
    "user2.userId": user2Id,
  });
  if (existingUser) {
    return existingUser;
  }
  let existingUser0 = await Chat.findOne({
    "user2.userid": user1Id,
    "user1.userId": user2Id,
  });
  if (existingUser0) {
    return existingUser0;
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
  return data;
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

export { addUser, saveMessage };
