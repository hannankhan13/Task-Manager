const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task.model");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please provide a valid email address!");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error(
            "The password should not contain the string password"
          );
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "userId",
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  return new Promise((resolve, reject) => {
    const payload = {
      _id: this._id.toString(), // Here we can directly use id instead of_id.toString() because this._id.toString() === this.id, though first is safer version
    };

    const secret = "topSecret";
    const options = {
      expiresIn: "10h",
    };

    jwt.sign(payload, secret, options, (err, token) => {
      // Here this inherits from the surrounding lexical scope. i.e generateAuthToken
      if (err) {
        return reject({ error: "Something went wrong" });
      }
      this.tokens = [...this.tokens, { token }];
      this.save();
      resolve(token);
    });
  });
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }).exec();

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Delete user tasks when user is removed
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await Task.deleteMany({ userId: this._id });
    next();
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
