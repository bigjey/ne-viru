import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors } from "../utils/allow-cors";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(request: VercelRequest, response: VercelResponse) {
  const { id } = request.query;

  let finalId = Array.isArray(id) ? id[0] : id;

  if (!finalId || !finalId.trim()) {
    return response.status(400).send("Bad id");
  }

  await prisma.likes.update({
    data: {
      count: {increment: 1}
    },
    where: {
      id: Number(finalId)
    }
  })

  if (request.headers["x-no-redirect"] === "true") {
    return response.status(200).end();
  }

  response.redirect("/");
}

export default allowCors(handler);
