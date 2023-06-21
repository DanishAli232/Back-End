import User from "../Models/UserModel.js";

export const addUser = async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      return res.status(401).json({
        errors: { message: "A user with that email address already exists" },
      });
    }

    const newUser = await User.create({ ...req.body });
    res.json({ user: { ...newUser._doc } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Not Register" });
  }
};
