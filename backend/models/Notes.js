const { randomUUID } = require("crypto");

let notes = [];

/* 
  Purpose:
    Simulates a database-backed model using an in-memory array,
    while exposing a Mongoose-like API to keep controllers and
    project style consistent.

  Storage:
    Module-scoped `notes` array. Data resets on server restart.
    IDs use stable, unique; no ordering semantics.

  Public API:
    Swap these internals with real DB calls later
      create(note)
      find(query)                     
      findById(id)
      updateById(id, fields)          
      deleteById(id)
*/

const idEq = (a, b) => String(a) === String(b);
const matches = (doc, query = {}) =>
  Object.entries(query).every(([k, v]) => String(doc[k]) === String(v));

class Note {
  static async create({ title, content, user }) {
    const now = new Date();
    const note = {
      _id: randomUUID(),
      title: String(title).trim(),
      content: String(content),
      user: user ? String(user) : "public",
      createdAt: now,
      updatedAt: now,
    };
    notes.push(note);
    return note;
  }

  static async find(query = {}) {
    return notes.filter((n) => matches(n, query));
  }

  static async findById(id) {
    return notes.find((n) => idEq(n._id, id)) || null;
  }

  static async updateById(id, fields = {}) {
    const n = notes.find((x) => idEq(x._id, id));
    if (!n) return null;
    if (fields.title !== undefined) n.title = String(fields.title).trim();
    if (fields.content !== undefined) n.content = String(fields.content);
    n.updatedAt = new Date();
    return n;
  }

  static async deleteById(id) {
    const idx = notes.findIndex((n) => idEq(n._id, id));
    if (idx === -1) return false;
    notes.splice(idx, 1);
    return true;
  }
}

module.exports = Note;
