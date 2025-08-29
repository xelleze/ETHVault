const express = require("express");
const {
  newNote,
  getAllNotes,
  getSingleNoteDetails,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");
/* add back when using db isAuthenticatedUser
const {
  isAuthenticatedUser,
} = require("../middlewares/user_actions/auth");*/

const router = express.Router();

/*
  Test solution with postman:
    POST  : http://localhost:4001/api/notes      BODY  : { "title": "Test Note", "content": "Hello World" }
    GET   : http://localhost:4001/api/notes 
    GET   : http://localhost:4001/api/notes/ID 
    PUT   : http://localhost:4001/api/notes/ID   BODY  : { "title": "Updated title", "content": "Updated content" }
    DELTE : http://localhost:4001/api/ID
*/

router.route("/notes")
  .post(newNote)
  .get(getAllNotes);

router.route("/notes/:id")
  .get(getSingleNoteDetails)
  .put(updateNote)
  .delete(deleteNote);


module.exports = router;
