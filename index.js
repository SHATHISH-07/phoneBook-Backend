const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("postData", (req) => JSON.stringify(req.body));
morgan.token("deleteData", (req) => {
  const personToDelete = persons.find((person) => person.id === req.params.id);
  return personToDelete ? JSON.stringify(personToDelete) : "{}";
});

app.use((req, res, next) => {
  const format =
    req.method === "POST"
      ? ":method :url :status :res[content-length] - :response-time ms :postData"
      : req.method === "DELETE"
      ? ":method :url :status :res[content-length] - :response-time ms :deleteData"
      : ":method :url :status :res[content-length] - :response-time ms";

  morgan(format)(req, res, next);
});

const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.status(200).send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === req.params.id);
  if (person) {
    res.status(200).send(person);
  } else {
    res.status(404).send({ error: "person not found" });
  }
});

app.get("/info", (req, res) => {
  const info = `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    </div>`;

  res.status(200).send(info);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name or number is missing" });
  }

  const nameExists = persons.some((person) => person.name === name);
  if (nameExists) {
    return res.status(409).json({ error: "Name must be unique " });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name,
    number,
  };

  persons.push(person);
  res.status(201).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const filteredPersons = persons.filter(
    (person) => person.id !== req.params.id
  );
  persons.length = 0;
  persons.push(...filteredPersons);
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
