// import Chat from "../Models/ChatModel.js";

// export const chatCustomer = async (req, res) => {
//   try {
//     let data = await Chat.find({ vendor: req.params.id }).populate(
//       "customer vendor"
//     );
//     res.send(data);
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const chatCustomerUsers = async (req, res) => {
//   console.log(req.params.id);
//   try {
//     let data = await Chat.find({
//       customer: req.params.id,
//       vendor: req.params.vid,
//     }).select("chat");
//     res.send(data);
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// };
