import express from "express";
import { addUser } from "../Controllers/UserController.js";
var UserRouter = express.Router();

UserRouter.post("/register", addUser);

export default UserRouter;
