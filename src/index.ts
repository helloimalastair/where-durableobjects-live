import { Hono } from "hono";
import htmlGenerator from "./HTML";

const app = new Hono();

app.get("/json", async () => fetch("https://durable.goalastair.com/json"));

app.get("/", htmlGenerator);

export default app;