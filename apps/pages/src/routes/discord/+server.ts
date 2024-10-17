import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () => Response.redirect("https://discord.gg/V9AeGVvPRP", 302);