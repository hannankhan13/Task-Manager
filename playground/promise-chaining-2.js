require("../src/db/mongoose");
const Task = require("../src/models/task.model");

// Task.findByIdAndDelete("686655fd5836559dc5b72403")
//   .exec()
//   .then((result) => {
//     console.log(result);
//     return Task.countDocuments({ completed: false }).exec();
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id).exec();
  const count = await Task.countDocuments({ completed: false }).exec();
  return count;
};

deleteTaskAndCount("686656135836559dc5b72407")
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
