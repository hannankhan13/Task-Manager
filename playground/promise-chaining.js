require("../src/db/mongoose");
const User = require("../src/models/user.model");

// User.findByIdAndUpdate("68664dde2796399851f15733", { age: 29 })
//   .exec()
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 29 }).exec();
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age }).exec();
  const count = await User.countDocuments({ age }).exec();
  return count;
};

updateAgeAndCount("68664dde2796399851f15733", 25)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
