import express from "express";
import { lockChat, unlockChat } from "../Controllers/ChatController.js";

var ChatRouter = express.Router();

ChatRouter.get("/lockChat/:chatId/:userId", lockChat);
ChatRouter.get("/unlockChat/:chatId/:userId", unlockChat);

export default ChatRouter;
