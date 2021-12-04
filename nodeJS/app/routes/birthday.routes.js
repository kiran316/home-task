module.exports = app => {
  const birthday = require("../controllers/birthday.controller.js");

  var router = require("express").Router();

  // Create a new Birthday
  router.put("/:username", birthday.saveOrUpdate);

  // Retrieve 1 Birthday depending on username
  router.get("/:username", birthday.findOne);

  app.use("/hello", router);
};
