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

const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET || "confeitaria_secret_key_change_me";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";
const PRODUCTS_FILE = path.join(__dirname, "products.json");
const USERS_FILE = path.join(__dirname, "users.json");

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Erro ao carregar usuários:", e);
  }
  return [];
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function initializeDefaultAdmin() {
  let users = loadUsers();
  if (users.length === 0) {
    users.push({
      id: "default_admin_id",
      username: ADMIN_USER,
      password: ADMIN_PASS,
      createdAt: new Date().toISOString()
    });
    saveUsers(users);
  }
}
initializeDefaultAdmin();


function loadProducts() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Erro ao carregar produtos:", e);
  }
  return [];
}

function saveProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "8h" });
    return res.json({ token });
  }
  
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "8h" });
    return res.json({ token });
  }
  
  return res.status(401).json({ error: "Credenciais inválidas" });
});

app.get("/api/admin/users", authMiddleware, (_req, res) => {
  const users = loadUsers().map(u => ({ id: u.id, username: u.username, createdAt: u.createdAt }));
  res.json(users);
});

app.post("/api/admin/users", authMiddleware, (req, res) => {
  const users = loadUsers();
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Usuário e senha são obrigatórios" });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: "Nome de usuário já existe" });
  }
  const newUser = {
    id: Date.now().toString(),
    username,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ id: newUser.id, username: newUser.username, createdAt: newUser.createdAt });
});

app.delete("/api/admin/users/:id", authMiddleware, (req, res) => {
  let users = loadUsers();
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Usuário não encontrado" });
  if (users.length === 1) return res.status(400).json({ error: "Não é possível excluir o único administrador do sistema." });
  
  const removed = users.splice(idx, 1)[0];
  saveUsers(users);
  res.json({ id: removed.id, username: removed.username });
});

app.get("/api/admin/products", authMiddleware, (_req, res) => {
  res.json(loadProducts());
});

app.post("/api/admin/products", authMiddleware, (req, res) => {
  const products = loadProducts();
  const { name, description, price, quantity, category } = req.body || {};
  if (!name || price === undefined) {
    return res.status(400).json({ error: "Nome e preço são obrigatórios" });
  }
  const product = {
    id: Date.now().toString(),
    name,
    description: description || "",
    price: Number(price),
    quantity: Number(quantity) || 0,
    category: category || "Geral",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(product);
  saveProducts(products);
  res.status(201).json(product);
});

app.put("/api/admin/products/:id", authMiddleware, (req, res) => {
  const products = loadProducts();
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Produto não encontrado" });
  const { name, description, price, quantity, category } = req.body || {};
  if (name !== undefined) products[idx].name = name;
  if (description !== undefined) products[idx].description = description;
  if (price !== undefined) products[idx].price = Number(price);
  if (quantity !== undefined) products[idx].quantity = Number(quantity);
  if (category !== undefined) products[idx].category = category;
  products[idx].updatedAt = new Date().toISOString();
  saveProducts(products);
  res.json(products[idx]);
});

app.delete("/api/admin/products/:id", authMiddleware, (req, res) => {
  let products = loadProducts();
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Produto não encontrado" });
  const removed = products.splice(idx, 1)[0];
  saveProducts(products);
  res.json(removed);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API do Calendar rodando em http://localhost:${PORT}`);
});
