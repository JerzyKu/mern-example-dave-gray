const express = require("express");
const usersController = require("../controllers/notesController");
const router = express.Router();

router.route("/")
    .get(usersController.getAllNotes)
    .post(usersController.createNewNote)
    .patch(usersController.updateNote)
    .delete(usersController.deleteNote);

module.exports = router;
