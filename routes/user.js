const router = require("express").Router();

router.get("/usertest", (req, res) => {
  res.send("Success");
});

module.exports = router;
