const jwt = require("jsonwebtoken");
const { ConfidentialClientApplication } = require("@azure/msal-node");

const clientSecret =
  process.env.AZURE_CLIENT_SECRET || "6Qe8Q~9_U76UaoKjpWNP6KWMg1mLnKJMOtNXncyb";
const tenantId =
  process.env.AZURE_TENANT_ID || "4dc5490f-a4dd-4300-b4a5-07cf854c0efa";
const clientId =
  process.env.AZURE_CLIENT_ID || "d419e2ab-eda0-4e22-a866-5db7f4019c6a";

const config = {
  auth: {
    clientId: clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    clientSecret: clientSecret,
    redirectUri: "http://localhost:8080/api/login/redirect",
  },
};

const pca = new ConfidentialClientApplication(config);

exports.login = async (req, res) => {
  const authCodeUrlParams = {
    scopes: ["openid", "profile", "email", "Directory.AccessAsUser.All"],
    redirectUri: config.auth.redirectUri,
  };

  try {
    const response = await pca.getAuthCodeUrl(authCodeUrlParams);
    res.redirect(response);
  } catch (error) {
    console.error("Fehler beim Abrufen der AuthCode-URL:", error);
    res.status(500).send("Fehler beim Login-Prozess.");
  }
};

exports.redirect = async (req, res) => {
  if (req.query.error) {
    console.error(req.query.error);
    console.error(req.query.error_description);
    console.error(req.query.error_uri);
    return;
  }

  const tokenRequest = {
    scopes: ["openid", "profile", "email", "Directory.AccessAsUser.All"],
    redirectUri: config.auth.redirectUri,
    code: req.query.code,
  };

  try {
    const response = await pca.acquireTokenByCode(tokenRequest);
    const accessToken = response.accessToken;

    // Rollen aus idTokenClaims extrahieren
    const roles = response.idTokenClaims.roles || [];
    console.log("Benutzerrollen:", roles);

    // Session speichern
    req.session.roles = roles;
    req.session.jwt = accessToken;

    res.redirect("/api/login/auth");
  } catch (error) {
    console.error("Fehler beim Abrufen des Tokens:", error);
    res.status(500).send("Fehler beim Login-Prozess.");
  }
};

exports.admin = async (req, res) => {
  const token = req.session.jwt;
  if (!token) return res.status(401).send("Nicht autorisiert.");

  try {
    if (!req.session.roles || !req.session.roles.includes("admin")) {
      return res.status(403).send("Zugriff verweigert.");
    }

    const decodedToken = jwt.decode(token);

    res.send(`Willkommen ${decodedToken.given_name} (Admin)`);
  } catch (error) {
    console.error("Token-Fehler:", error);
    res.status(401).send("Ungültiges Token.");
  }
};
