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

app.get("/info", (request, response, next) => {
  Contact.find({})
    .then((contacts) => {
      response.send(`<p>Phonebook has ${contacts.length} contacts</p>
  <p>${Date()}</p>`);
    })
    .catch((error) => next(error));
});

app.get("/api/contacts", (request, response) => {
  Contact.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/contacts/:id", (request, response, next) => {
  const id = request.params.id;

  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response
          .status(404)
          .send({ Error: "The requested contact is not found" });
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/contacts/:id", (request, response, next) => {
  const id = request.params.id;

  Contact.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/contacts", (request, response, next) => {
  const body = request.body;
  if (!body.name)
    return response.status(400).json({ Error: "A contact must have a name" });
  if (!body.number)
    return response.status(400).json({ Error: "A contact must have a number" });

  const contact = new Contact(body);
  contact
    .save()
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch((error) => next(error));
});

app.put("/api/contacts/:id", (request, response, next) => {
  const body = request.body;

  Contact.findByIdAndUpdate(request.params.id, body, { new: true })
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response
      .status(400)
      .send({ Error: "The requested ID is not a valid format" });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
