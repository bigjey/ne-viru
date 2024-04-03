import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from "@vercel/postgres";

import { escapeHtml } from '../utils/escape-html';

type UserData = {name:string; id: number; count: number};

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const { rows } = await sql`SELECT id, name, count FROM likes order by id;`;

    return response.send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Like me</title>
                <link rel="stylesheet" href="/static/style.css" />
            </head>
            <body>
                <h1>Little likes app <3</h1>
                <form action="/api/like">
                    ${rows.length ? renderUsers(rows as UserData[]) : "No users yet :)"}
                </form>
                <br/>
                <form action="/api/add">
                    <h2>Add new user</h2>
                    <input type="text" name="name" autofocus />
                    <button type="submit">Add</button>
                </form>
            </body>
        </html>
    `);
}

function renderUsers(users: UserData[]) {
    const html: string[] = [];

    html.push('<table><tbody>');
    
    users.forEach((user, index) => {
        html.push(`<tr>`);
        html.push(`<td>${escapeHtml(user.name)}</td>`);
        html.push(`<td width="50"><code>${user.count}</code></td>`);
        html.push(`<td> <button type="submit" name="id" value="${user.id}">Like</button></td></tr>`);
        html.push('</tr>');
    });

    html.push('</tbody></table>');

    return html.join("");
}
