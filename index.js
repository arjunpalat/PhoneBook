require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms :body`)
);

app.get("/", (request, response) => {
  response.send("<h1>Welcome to Phonebook!</h1>");
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has ${contacts.length} contacts</p>
  <p>${Date()}</p>`);
});

app.get("/api/contacts", (request, response) => {
  Contact.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/contacts/:id", (request, response) => {
  const id = request.params.id;

  Contact.findById(id).then((note) => response.json(note));
});

/* app.delete("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id);
  contacts = contacts.filter((person) => person.id !== id);

  response.status(204).end();
}); */

app.post("/api/contacts", (request, response) => {
  const body = request.body;
  if (!body.name)
    return response.status(400).json({ Error: "A contact must have a name" });
  if (!body.number)
    return response.status(400).json({ Error: "A contact must have a number" });

  /* if (contacts.find(({ name }) => name === body.name))
    return response
      .status(400)
      .json({ Error: "A contact already exists with that name" }); */

  const contact = new Contact({ ...body });
  contact.save().then((savedContact) => {
    response.json(savedContact);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
