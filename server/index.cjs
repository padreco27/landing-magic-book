const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const { z } = require("zod");
const crypto = require("crypto");

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

const EventSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  product: z.string().min(1).max(100),
  notes: z.string().max(1000).optional().nullable(),
  durationMinutes: z.number().int().min(15).max(480).optional(),
  location: z.string().max(200).optional(),
  attendees: z.array(z.string().email()).optional(),
  idempotencyKey: z.string().max(200).optional(),
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/calendar/event", async (req, res) => {
  try {
    const parsed = EventSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ error: "Payload inválido", details: parsed.error.flatten() });
    }
    const { name, date, time, product, notes, durationMinutes, location, attendees, idempotencyKey } = parsed.data;
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
    const durMs = (durationMinutes ?? 60) * 60 * 1000;
    const endIso = new Date(new Date(startIso).getTime() + durMs).toISOString();
    const timeZone = "America/Sao_Paulo";

    const auth = getAuth();
    const calendar = google.calendar({ version: "v3", auth });
    const event = {
      summary: `Encomenda: ${product}`,
      description: `Nome: ${name}\nProduto: ${product}\nObservações: ${notes || "-"}`,
      start: { dateTime: startIso, timeZone },
      end: { dateTime: endIso, timeZone },
      location: location || undefined,
      attendees: (attendees || []).map((email) => ({ email })),
      extendedProperties: idempotencyKey ? { private: { idempotencyKey } } : undefined,
    };
    let eventId;
    if (idempotencyKey) {
      eventId = crypto.createHash("sha1").update(`${calendarId}:${idempotencyKey}`).digest("hex");
    }

    try {
      const insertArgs = {
        calendarId,
        requestBody: event,
      };
      if (eventId) {
        insertArgs.requestBody.id = eventId;
      }
      const { data } = await calendar.events.insert(insertArgs);
      return res.json({ id: data.id, htmlLink: data.htmlLink });
    } catch (e) {
      const err = e && e.errors ? e.errors : e;
      const msg = String(err && err.message ? err.message : err);
      if (eventId && msg.includes("Already exists")) {
        const { data } = await calendar.events.get({ calendarId, eventId });
        return res.json({ id: data.id, htmlLink: data.htmlLink, duplicate: true });
      }
      throw e;
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Falha ao criar evento", details: String(err.message || err) });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API do Calendar rodando em http://localhost:${PORT}`);
});
