const express = require("express");
const app = express();
const port = 3001;

// Importiere die Route
const exampleRoute = require("./routes");

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
