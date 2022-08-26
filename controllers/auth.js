import User from "../models/User";
import jwt from "jsonwebtoken";
import { validateLoginValues, validateRegisterValues } from "../services/auth";

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  const errorMessage = await validateRegisterValues(username, password, email);
  if (errorMessage.length > 0) {
    return res.status(400).send(errorMessage);
  }

  const user = new User(req.body);
  try {
    await user.save();
    console.log("User saved");
    return res.send({ success: true });
  } catch (err) {
    return res.status(400).send("Error in user creation");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const errorMessage = await validateLoginValues(email, password);
  if (errorMessage.length > 0) {
    return res.status(400).send(errorMessage);
  }

  try {
    let user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).send("Email or password is incorrect");
    }
    user.comparePassword(password, (err, match) => {
      if (!match || err) {
        return res.status(400).send("Email or password is incorrect");
      }

      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({
        token,
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Unable to sign in");
  }
};
