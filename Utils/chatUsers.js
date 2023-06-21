import Chat from "../Models/ChatModel.js";

const users = [];

const findUser = async ({ id, chatData }) => {
  let { user1, user2 } = chatData;
  if (!user1.id || !user2.id)
    return { user: {}, error: "sender and receiver ID are required." };

  let existingUser = await Chat.findOne({
    roomID: `${user1.id}_${user2.id}`,
  }).exec();
  if (existingUser) {
    return { user: existingUser, error: "" };
  }

  let existingUser0 = await Chat.findOne({
    roomID: `${user2.id}_${user1.id}`,
  }).exec();

  if (existingUser0) {
    return { user: existingUser0, error: "" };
  } else {
    return {
      user: {},
      error: "",
    };
  }
};

const addUser = async ({ id, chatData }) => {
  let { user1, user2 } = chatData;
  try {
    let data = await Chat.create({
      user1: {
        id: user1.id,
        name: user1.name,
        contact: user1.contact,
      },
      user2: {
        id: user2.id,
        name: user2.name,
        contact: user2.contact,
      },
      chat: [],
      roomID: `${user1.id}_${user2.id}`,
    });

    return { success: true, error: "" };
  } catch (error) {
    return { success: false, error: "Something Went Wrong" };
  }
};

const saveMessage = async (id, user) => {
  let data0 = {};

  try {
    let data1 = await Chat.updateOne(
      { roomID: user.roomID },
      {
        $push: { chat: { text: id.text, sender: id.name } },
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
