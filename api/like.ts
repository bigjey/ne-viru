import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from "@vercel/postgres";

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const { name } = request.query;

    let finalName = Array.isArray(name) ? name[0] : name;

    if (!finalName || !finalName.trim()) {
        return response.status(400).send("Bad 'name' value");
    }

    finalName = finalName.trim();

    if (finalName.length > 255) {
        return response.status(400).send("It's too big! (that's what she said)");
    }

    console.log("processing name:", finalName);
    
    const { rows } = await sql`SELECT name, count FROM likes where name = ${finalName};`;

    if (rows.length) {
        await sql`UPDATE likes set count = ${rows[0].count + 1} where name = ${finalName};`;
    } else {
        await sql`insert into likes (name, count) values (${finalName}, 0);`;
    }

    response.redirect('/');
}