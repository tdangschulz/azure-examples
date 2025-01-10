const express = require("express");
const multer = require("multer");
const router = express.Router();
const exampleController = require("../controllers/exampleController");
const databaseController = require("../controllers/database");
const envController = require("../controllers/envVariable");
const storageController = require("../controllers/storage");

// Beispiel-Route
router.get("/example", exampleController.getExample);
router.get("/database", databaseController.database);
router.get("/env", envController.getEnvVariable);

const upload = multer({ dest: "uploads/" });
router.post("/upload", upload.single("file"), storageController.processUpload);

module.exports = router;
