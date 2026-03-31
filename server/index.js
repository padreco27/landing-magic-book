const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { google } = require("googleapis");

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

function getAuth() {
  const json = process.env.GOOGLE_CALENDAR_CREDENTIALS_JSON;
  if (!json) {
    throw new Error("Env GOOGLE_CALENDAR_CREDENTIALS_JSON ausente");
  }
  let key;
  try {
    key = JSON.parse(json);
  } catch (e) {
    throw new Error("GOOGLE_CALENDAR_CREDENTIALS_JSON inválido");
  }
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  return new google.auth.JWT(key.client_email, null, key.private_key, scopes);
}

app.post("/api/calendar/event", async (req, res) => {
  try {
    const { name, date, time, product, notes } = req.body || {};
    if (!name || !date || !time || !product) {
      return res.status(400).json({ error: "Campos obrigatórios: name, date, time, product" });
    }
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) {
      return res.status(500).json({ error: "Env GOOGLE_CALENDAR_ID ausente" });
    }

    const [year, month, day] = date.split("-").map((v) => parseInt(v, 10));
    const [hour, minute] = time.split(":").map((v) => parseInt(v, 10));
    if (!year || !month || !day || hour === undefined || minute === undefined) {
      return res.status(400).json({ error: "Data ou horário inválidos" });
    }

    const startIso = new Date(year, month - 1, day, hour, minute, 0).toISOString();
    const endIso = new Date(new Date(startIso).getTime() + 60 * 60 * 1000).toISOString();
    const timeZone = "America/Sao_Paulo";

    const auth = getAuth();
    const calendar = google.calendar({ version: "v3", auth });
    const event = {
      summary: `Encomenda: ${product}`,
      description: `Nome: ${name}\nProduto: ${product}\nObservações: ${notes || "-"}`,
      start: { dateTime: startIso, timeZone },
      end: { dateTime: endIso, timeZone },
    };

    const { data } = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });
    return res.json({ id: data.id, htmlLink: data.htmlLink });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Falha ao criar evento", details: String(err.message || err) });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API do Calendar rodando em http://localhost:${PORT}`);
});

