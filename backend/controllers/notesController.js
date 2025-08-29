const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const Note = require("../models/Notes");

/* 
  Purpose:
    HTTP handlers for the Notes REST API. Mirrors the project's
    controller style.

  Endpoints (mounted under /api):
    api/notes = create a note                       (POST)
    api/notes = list notes for current user/public  (GET)
    api/notes/:id = fetch a single note             (GET)
    api/notes/:id = update a note                   (PUT)
    api/notes/:id = delete a note                   (DELETE)

  Auth model:
    If auth middleware is enabled, we scope by req.user._id and enforce ownership on READ/UPDATE/DELETE.
    If auth is disabled (assignment, no DB), we fall back to a "public" bucket so routes still function.

  Error handling:
    asyncErrorHandler: surfaces async errors to the global handler.
    ErrorHandler: project’s custom error with status code.
*/

//created because of issues without db
const getUserId = (req) =>
  req.user && req.user._id ? String(req.user._id) : "public";

//Create New Note
exports.newNote = asyncErrorHandler(async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return next(new ErrorHandler("Title and content are required", 400));
  }

  const note = await Note.create({
    title,
    content,
    user: getUserId(req),
  });

  res.status(201).json({ success: true, note });
});

//Get Single Note
exports.getSingleNoteDetails = asyncErrorHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  if (!note) return next(new ErrorHandler("Note Not Found", 404));

  if (req.user && String(note.user) !== String(req.user._id)) {
    return next(new ErrorHandler("Note Not Found", 404));
  }

  res.status(200).json({ success: true, note });
});

// Get All Notes 
exports.getAllNotes = asyncErrorHandler(async (req, res) => {
  const userId = getUserId(req);
  const notes = await Note.find({ user: userId });
  res.status(200).json({ success: true, notes });
});

//Update Notes by ID
exports.updateNote = asyncErrorHandler(async (req, res, next) => {
  const existing = await Note.findById(req.params.id);
  if (!existing) return next(new ErrorHandler("Note Not Found", 404));
  if (req.user && String(existing.user) !== String(req.user._id))
    return next(new ErrorHandler("Note Not Found", 404));

  const note = await Note.updateById(req.params.id, {
    title: req.body.title,
    content: req.body.content,
  });
  res.status(200).json({ success: true, note });
});

//Delete Notes by ID
exports.deleteNote = asyncErrorHandler(async (req, res, next) => {
  const existing = await Note.findById(req.params.id);
  if (!existing) return next(new ErrorHandler("Note Not Found", 404));
  if (req.user && String(existing.user) !== String(req.user._id))
    return next(new ErrorHandler("Note Not Found", 404));

  const deleted = await Note.deleteById(req.params.id);
  if (!deleted) return next(new ErrorHandler("Note Not Found", 404));
  res.status(200).json({ success: true }); 
});
