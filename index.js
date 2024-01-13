const express = require("express");
const app = express();
const morgan = require("morgan");

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});

const generateId = () => {
  const limit = 100000000;
  return Math.round(Math.random() * limit);
};

let contacts = [
  {
    name: "Arto Hellas",
    number: "1234567890",
    id: 1,
  },
  {
    name: "Karan",
    number: "4658597822",
    id: 2,
  },
  {
    name: "Alice Johnson",
    number: "8765432109",
    id: 3,
  },
  {
    name: "Bob Smith",
    number: "5647382910",
    id: 4,
  },
  {
    name: "Catherine Lee",
    number: "1928374650",
    id: 5,
  },
];

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
  response.json(contacts);
});

app.get("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id);
  const contact = contacts.find((person) => person.id === id);
  if (contact) response.json(contact);
  else response.status(404).json({ Error: "Requested contact is not found" });
});

app.delete("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id);
  contacts = contacts.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/contacts", (request, response) => {
  const body = request.body;
  if (!body.name)
    return response.status(400).json({ Error: "A contact must have a name" });
  if (!body.number)
    return response.status(400).json({ Error: "A contact must have a number" });

  if (contacts.find(({ name }) => name === body.name))
    return response
      .status(400)
      .json({ Error: "A contact already exists with that name" });

  const newContact = { ...body, id: generateId() };
  response.json(newContact);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
