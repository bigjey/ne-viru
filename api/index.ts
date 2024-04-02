import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from "@vercel/postgres";

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const { rows } = await sql`SELECT name, count FROM likes;`;

    return response.send(`
        <html>
            <body>
                <h1>Little likes app <3</h1>
                <form action="/api/like">
                    ${rows.length ? rows.map(row => {
                        return `<div>${row.name}: ${row.count} <button type="submit" name="name" value="${row.name}">Like</button></div>`;
                    }) : "No users yet :)"}
                </form>
                <form action="/api/like">
                    <div>
                        <input type="text" name="name" autofocus />
                        <button type="submit">Add</button>
                    </div>
                </form>
            </body>
        </html>
    `);
}