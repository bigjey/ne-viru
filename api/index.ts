import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from "@vercel/postgres";

import { escapeHtml } from '../utils/escape-html';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const { rows } = await sql`SELECT id, name, count FROM likes order by id;`;

    return response.send(`
        <html>
            <body>
                <h1>Little likes app <3</h1>
                <form action="/api/like">
                    ${rows.length ? rows.map(row => {
                        return `<div>${escapeHtml(row.name)}: <code>${row.count}</code> <button type="submit" name="id" value="${row.id}">Like</button></div>`;
                    }).join("") : "No users yet :)"}
                </form>
                <form action="/api/add">
                    <div>
                        <input type="text" name="name" autofocus />
                        <button type="submit">Add</button>
                    </div>
                </form>
            </body>
        </html>
    `);
}