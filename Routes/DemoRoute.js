import express from "express";

const DemoRouter = express.Router();

DemoRouter.get("/", async (req, res) => {
  res.send({ message: "Welcome" });
});

export default DemoRouter;
