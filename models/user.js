import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const ACCOUNT_TYPES = ["admin", "customer"];

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: "Name is required",
    },
    email: {
      type: String,
      trim: true,
      required: "Email is required",
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: "Password is required",
      min: 6,
      max: 32,
    },
    accountType: {
      type: String,
      enum: ACCOUNT_TYPES,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    return bcrypt.hash(
      user.password,
      Number.parseInt(process.env.SALT),
      function (err, hash) {
        if (err) {
          console.log("bcrypt bitched out", err);
          return next(err);
        }
        user.password = hash;
        return next();
      }
    );
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, function (err, match) {
    if (err) {
      console.log("Compare password err");
      return next(err, false);
    }

    return next(null, true);
  });
};

export default mongoose.model("User", userSchema);
