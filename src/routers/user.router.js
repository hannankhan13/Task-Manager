const express = require("express");
const router = new express.Router();
const User = require("../models/user.model");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp"); // for resizing and change image upload formats
const { sendWelcomeEmail, sendGoodbyeEmail } = require("../emails/accounts");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.payload.tokens = req.payload.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.payload.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.payload.tokens = [];
    await req.payload.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.payload);
});

router.patch("/users/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "age", "password"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // }).exec();
    // const user = await User.findById(req.payload._id).exec();
    updates.forEach((update) => (req.payload[update] = req.body[update]));
    await req.payload.save();
    res.send(req.payload);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.payload._id).exec();
    // if (!user) {
    //   return res.status(404).send({ error: "User not found!" });
    // }
    // console.log(req.payload.constructor.name);
    await req.payload.deleteOne();
    sendGoodbyeEmail(req.payload.email, req.payload.name);
    res.send(req.payload);
  } catch (e) {
    res.status(500).send(e);
  }
});

const upload = multer({
  // dest: "avatars", // "avatars" is the folder name  REMOVE WHEN NEED SAVING BUFFER OF THAT IMAGE IN DB
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
      return cb(new Error("Please upload an image"));
    }

    return cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // avatar is the key name
    const buffer = await sharp(req.file.buffer)
      .resize({ height: 250, width: 250 })
      .png()
      .toBuffer();
    req.payload.avatar = buffer;
    await req.payload.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);
// <img src="data:image/jpg;base64,sdfjadshnfkjds" >

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.payload.avatar = undefined;
    await req.payload.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user?.avatar) {
      throw new Error();
    }

    res.set('Content-Type: "image/jpg');
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
