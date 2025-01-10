exports.getExample = (req, res) => {
  res.json({
    message: 'Dies ist eine Beispielantwort für die Route /api/example',
    status: 'success'
  });
};
