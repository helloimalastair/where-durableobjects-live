import schema from "./schema.json";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () => Response.json(schema);

export { OPTIONS } from "$lib";