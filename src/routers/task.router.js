const express = require("express");
const router = new express.Router();
const Task = require("../models/task.model");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, userId: req.payload._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    const match = {};
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    // const tasks = await Task.find({ userId: req.payload._id }).exec();
    // OR
    await req.payload.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
      },
    });

    res.send(req.payload.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, userId: req.payload._id }).exec();
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // }).exec();
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.payload._id,
    }).exec();

    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.payload._id,
    }).exec();
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
