exports.getExample = (req, res) => {
  res.json({
    message: "Dies ist eine Beispielantwort für die Route /api/example",
    status: "success",
  });
};

exports.stateless = (req, res) => {
  const counter = req.query.counter || 0;
  res.send(
    `Stateless: Der Zählerstand ist immer ${counter}, weil der Server keinen Zustand speichert.`
  );
};

exports.stateful = (req, res) => {
  counter += 1;
  res.send(
    `Stateful: Der Zähler wurde auf ${counter} erhöht, der Server behält den Zustand.`
  );
};
