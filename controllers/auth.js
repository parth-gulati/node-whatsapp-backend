import User from "../models/User";
import jwt from "jsonwebtoken";
import { validateRegisterValues } from "../services/auth";

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  console.log({ username, password, email });
  const errorMessage = await validateRegisterValues(username, password, email);
  if (errorMessage.length > 0) {
    return res.status(400).send(errorMessage);
  }

  const user = new User(req.body);
  try {
    await user.save();
    console.log("User saved");
    return res.send({success: true});
  } catch (err) {
    return res.status(400).send("Error in user creation");
  }
};
