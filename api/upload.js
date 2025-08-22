import formidable from "formidable";
import fs from "fs";
import { google } from "googleapis";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Error parsing file");

    const file = files.file;
    const filePath = file?.filepath || (Array.isArray(file) ? file[0]?.filepath : null);
    if (!filePath) return res.status(400).send("File path not found");

    const filename = fields.filename || file.originalFilename || file[0]?.originalFilename;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    try {
      const response = await drive.files.create({
        requestBody: {
          name: filename,
          parents: [process.env.DRIVE_FOLDER_ID]
        },
        media: {
          mimeType: file.mimetype || file[0]?.mimetype,
          body: fs.createReadStream(filePath)
        },
        fields: "id, webViewLink"
      });

      fs.unlinkSync(filePath);

      res.status(200).json({ link: response.data.webViewLink, name: filename });
    } catch (e) {
      console.error("Upload failed:", e.message);
      res.status(500).send("Upload failed");
    }
  });
}
