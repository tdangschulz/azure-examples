const {
  ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");
const fs = require("fs");

const AZURE_COMPUTER_VISION_ENDPOINT =
  process.env.AZURE_COMPUTER_VISION_ENDPOINT;
const AZURE_COMPUTER_VISION_KEY = process.env.AZURE_COMPUTER_VISION_KEY;

if (!AZURE_COMPUTER_VISION_ENDPOINT || !AZURE_COMPUTER_VISION_KEY) {
  throw new Error(
    "Azure Cognitive Services Endpoint oder Key ist nicht definiert."
  );
}

const credentials = new ApiKeyCredentials({
  inHeader: { "Ocp-Apim-Subscription-Key": AZURE_COMPUTER_VISION_KEY },
});
const client = new ComputerVisionClient(
  credentials,
  AZURE_COMPUTER_VISION_ENDPOINT
);

exports.analyze = async (req, res) => {
  try {
    const imagePath = req.file.path;

    const features = ["Description", "Tags", "Objects", "Brands"];
    const imageStream = () => fs.createReadStream(imagePath);
    const analysis = await client.analyzeImageInStream(imageStream, {
      visualFeatures: features,
    });

    res.status(200).json({
      description: analysis.description.captions.map((c) => c.text),
      tags: analysis.tags.map((t) => t.name),
      objects: analysis.objects.map((o) => ({
        name: o.object,
        confidence: o.confidence,
      })),
    });

    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error("Fehler bei der Bildanalyse:", error.message);
    res.status(500).send("Fehler bei der Bildanalyse.");
  }
};
