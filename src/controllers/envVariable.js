exports.getEnvVariable = (req, res) => {
  res.json({
    message: process.env.ENV_VARIABLE,
    status: "success",
  });
};
