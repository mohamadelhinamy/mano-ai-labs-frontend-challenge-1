import { serve } from "@hono/node-server";
import { Hono } from "hono";
import uploadRoutes from './routes/uploadRoutes.js';
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*',
  })
);

app.route('/api/files', uploadRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve({ fetch: app.fetch, port: 8080 });
console.log("Server is running on http://localhost:8080");
