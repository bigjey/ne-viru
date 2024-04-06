import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient, Likes } from '@prisma/client'
import { escapeHtml } from '../utils/escape-html';

const prisma = new PrismaClient()

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const likes = await prisma.likes.findMany({orderBy: {id: 'asc'}});

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
                    ${likes.length ? renderUsers(likes) : "No users yet :)"}
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

function renderUsers(likes: Likes[]) {
    const html: string[] = [];

    html.push('<table><tbody>');
    
    likes.forEach((like, index) => {
        html.push(`<tr>`);
        html.push(`<td>${escapeHtml(like.name)}</td>`);
        html.push(`<td width="50"><code>${like.count}</code></td>`);
        html.push(`<td> <button type="submit" name="id" value="${like.id}">Like</button></td></tr>`);
        html.push('</tr>');
    });

    html.push('</tbody></table>');

    return html.join("");
}
