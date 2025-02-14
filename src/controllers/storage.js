const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} = require("@azure/storage-blob");
const fs = require("fs");
const path = require("path");

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

const containerName = "tuan-storage";

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

exports.processDownload = async (req, res) => {
  const { fileName } = req.params;

  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const exists = await blockBlobClient.exists();
    if (!exists) {
      return res.status(404).send("Datei nicht gefunden.");
    }

    const downloadFilePath = path.join(__dirname, fileName);
    const downloadBlockBlobResponse = await blockBlobClient.downloadToFile(
      downloadFilePath
    );

    console.log(`Datei erfolgreich heruntergeladen: ${fileName}`);
    console.log(
      `Download abgeschlossen. Dateigröße: ${downloadBlockBlobResponse.contentLength} Bytes`
    );
    console.log(`Blob-Typ: ${downloadBlockBlobResponse.blobType}`);

    res.download(downloadFilePath, fileName, (err) => {
      if (err) {
        console.error("Fehler beim Senden der Datei:", err.message);
      }

      fs.unlinkSync(downloadFilePath);
    });
  } catch (error) {
    console.error("Fehler beim Herunterladen:", error);
    res.status(500).send("Fehler beim Herunterladen der Datei.");
  }
};

exports.show = async (req, res) => {
  try {
    const accountName =
      AZURE_STORAGE_CONNECTION_STRING.match(/AccountName=([^;]+)/)[1];
    const accountKey =
      AZURE_STORAGE_CONNECTION_STRING.match(/AccountKey=([^;]+)/)[1];

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );

    const expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 1);

    const permissions = BlobSASPermissions.parse("r");
    const blobName = "07-wave-rounded.gif";

    // SAS-Token generieren
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions,
        startsOn: new Date(),
        expiresOn,
      },
      sharedKeyCredential
    ).toString();

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const imageUrlWithSAS = `${blobClient.url}?${sasToken}`;

    res.json({ url: imageUrlWithSAS });
  } catch (error) {
    console.error("Fehler erstellen des SAS Token:", error);
    res.status(500).send("Fehler erstellen des SAS Token");
  }
};
