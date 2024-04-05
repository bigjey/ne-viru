import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";
import { allowCors } from "../utils/allow-cors";

async function handler(request: VercelRequest, response: VercelResponse) {
  const { id } = request.query;

  let finalId = Array.isArray(id) ? id[0] : id;

  if (!finalId || !finalId.trim()) {
    return response.status(400).send("Bad id");
  }

  await sql`update likes set count = count + 1 where id = ${finalId}`;

  if (request.headers["x-no-redirect"] === "true") {
    return response.status(200).end();
  }

  response.redirect("/");
}

export default allowCors(handler);
