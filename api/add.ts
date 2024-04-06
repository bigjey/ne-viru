import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors } from "../utils/allow-cors";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(request: VercelRequest, response: VercelResponse) {
  const { name } = request.query;

  let finalName = Array.isArray(name) ? name[0] : name;

  if (!finalName || !finalName.trim()) {
    return response.status(400).send("Bad 'name' value!");
  }

  finalName = finalName.trim();

  if (finalName.length > 255) {
    return response
      .status(400)
      .send("'name' is too big! (that's what she said)");
  }

  await prisma.likes.create({
    data: {
      name: finalName,
      count: 0
    }
  })

  if (request.headers['x-no-redirect'] === 'true') {
    return response.status(200).end();
  }

  response.redirect("/");
}

export default allowCors(handler);
