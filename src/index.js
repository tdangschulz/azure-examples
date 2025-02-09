const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");

const app = express();
app.use(cookieParser());
const port = 3001;

// Importiere die Route
const exampleRoute = require("./routes");

app.use(
  session({
    secret: "your-secret-key-session-key!",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Middleware
app.use(express.json());

// Standard-Route
app.get("/", (req, res) => {
  res.send("Willkommen to fak73!");
});

// Beispiel-Route
app.use("/api", exampleRoute);

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
  console.warn(
    "Example Endpunkt kann man mit http://localhost:3001/api/example erreichen"
  );
});
