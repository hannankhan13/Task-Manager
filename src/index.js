require("dotenv").config();
const express = require("express");
const app = express();
require("./db/mongoose");
const userRouter = require("./routers/user.router");
const taskRouter = require("./routers/task.router");

const PORT = process.env.PORT;
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Whenever JSON.stringify is call on an object if it contains toJSON it will get called first and whatever it returns the JSON.stringify wil print only that
// const pet = {
//   age: 21,
//   password: "abc",
//   tokens: [{ token: "token" }],
// };

// pet.toJSON = function () {
//   console.log("I get called first if you stringify the object I am on");
//   return []; // JSON.stringify wall print [] now
// };

// console.log(JSON.stringify(pet));

// const Task = require("./models/task.model");
// const User = require("./models/user.model");

// const main = async () => {
// const task = await Task.findById("6868355e3c89bf132aa5157c");
// await task.populate("userId");
// console.log(task);

//   const user = await User.findById("686835423c89bf132aa51576");
//   await user.populate("tasks");
//   console.log(user.tasks);
// };

// main();

// *** FILE UPLOADS ***

const multer = require("multer");

const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000, // 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error("Please upload a word document"));
    }
    return cb(undefined, true);
  },
});

app.post(
  "/upload",
  upload.single("upload"),
  (req, res) => {
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({
      status: 400,
      message: err.message,
    });
  }
);

// Add error handler either in a route after handler or here
// app.use((err, req, res, next) => {
//   res.status(err.status || 500).send({
//     status: err.status || 500,
//     message: err.message,
//   });
// });
app.listen(PORT, () => {
  console.log("Server is up and running on port " + PORT);
});
