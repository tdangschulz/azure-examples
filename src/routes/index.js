const express = require("express");
const multer = require("multer");
const router = express.Router();

const exampleController = require("../controllers/exampleController");
// const databaseController = require("../controllers/database");
// const loginController = require("../controllers/login");
// const envController = require("../controllers/envVariable");
// const storageController = require("../controllers/storage");
// const computeVisionController = require("../controllers/computeVision");

router.get("/example", exampleController.getExample);
router.get("/stateless", exampleController.stateless);
router.get("/stateful", exampleController.stateful);

// router.get("/database", databaseController.database);
// router.get("/env", envController.getEnvVariable);

// const upload = multer({ dest: ".uploads/" });
// router.post("/upload", upload.single("file"), storageController.processUpload);
// router.get("/download/:fileName", storageController.processDownload);

// router.post("/analyze", upload.single("file"), computeVisionController.analyze);

// router.get("/login", loginController.login);
// router.get("/login/redirect", loginController.redirect);
// router.get("/login/auth", loginController.admin);

module.exports = router;
