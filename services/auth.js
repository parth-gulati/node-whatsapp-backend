import validator from "validator";
import User from "../models/User";

export const validateRegisterValues = async (username, password, email) => {
  if (!username) {
    return "Username cannot be empty";
  } else if (
    !validator.matches(
      username,
      "^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"
    )
  ) {
    return "Username is not valid";
  } else {
    let userExists = await User.findOne({ username }).exec();
    if (userExists) {
      return "Username already taken";
    }
  }

  if (!password) {
    return "Password is required";
  } else if (!validator.isStrongPassword(password))
    return "Password is too weak";

  if (!email) return "Email cannot be empty";
  else if (!validator.isEmail(email)) return "Email is not valid";
  else {
    let userExists = await User.findOne({ email }).exec();
    if (userExists) {
      return "Email already taken";
    }
  }

  return "";
};
