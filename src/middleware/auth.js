const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  // console.log(req.header("Authorization"))
  // console.log(req.headers["authorization"])
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const payload = jwt.verify(token, "topSecret");
    const user = await User.findOne({
      _id: payload._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    req.payload = user;
    next();
  } catch (e) {
    res.status(401).send("Please authenticate.");
  }
};

module.exports = auth;
