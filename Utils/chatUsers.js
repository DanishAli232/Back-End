import Chat from "../Models/ChatModel.js";

const users = [];

const findUser = async ({ id, chatData }) => {
  let { user1Id, user2Id } = chatData;
  if (!user1Id || !user2Id)
    return { user: {}, error: "sender and receiver ID are required." };

  let existingUser = await Chat.findOne({
    roomID: `${user1Id}_${user2Id}`,
  });

  if (existingUser) {
    return { user: existingUser, error: "" };
  }

  let existingUser0 = await Chat.findOne({
    roomID: `${user2Id}_${user1Id}`,
  });

  if (existingUser0) {
    return { user: existingUser0, error: "" };
  } else {
    return {
      user: {},
      error: "No User Found",
    };
  }
};

const addUser = async ({ id, chatData }) => {
  let { user1Id, user2Id, user1name, user1contact, user2name, user2contact } =
    chatData;
  try {
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
      roomID: `${user2Id}_${user1Id}`,
    });

    return { success: true, error: "" };
  } catch (error) {
    return { success: false, error: "Something Went Wrong" };
  }
};

const saveMessage = async (id, user) => {
  let data0 = {};

  try {
    let query1 = {
      user1: id.user1,
      user2: id.user2,
    };
    let data1 = await Chat.updateOne(
      { roomID: user.roomID },
      {
        $push: { chat: { text: id.message, sender: id.name } },
      }
    );

    if (data1.nModified === 0) {
      data0 = { user0: undefined, error0: true };
    } else {
      data0 = { user0: data1, error0: false };
    }
  } catch (error) {
    data0 = { user0: undefined, error0: true };
  }

  return data0;
};

export { addUser, saveMessage, findUser };
