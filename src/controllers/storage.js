const express = require("express");
const { BlobServiceClient } = require("@azure/storage-blob");

const AZURE_STORAGE_CONNECTION_STRING =
  "DefaultEndpointsProtocol=https;AccountName=XXXX;AccountKey=XXXXX;EndpointSuffix=core.windows.net";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

const containerName = "tuan-container";

exports.processUpload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("Keine Datei hochgeladen.");
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const containerExists = await containerClient.exists();
    if (!containerExists) {
      await containerClient.create();
    }

    const blobName = file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadFile(file.path);

    res.status(200).send(`Datei erfolgreich hochgeladen: ${blobName}`);
  } catch (error) {
    console.error("Fehler beim Hochladen:", error.message);
    res.status(500).send("Fehler beim Hochladen der Datei.");
  }
};
