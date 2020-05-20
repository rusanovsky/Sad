const router = require("express").Router();
let Document = require("../models/document.model");

router.route("/").get((req, res) => {
  Document.find()
    .then((documents) => res.json(documents))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const text = req.body.text;

  const newDocument = new Document({
    name,
    text
  });

  newDocument
    .save()
    .then(() => res.json("Document added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Document.findByIdAndDelete(req.params.id)
    .then(() => res.json("Document deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
