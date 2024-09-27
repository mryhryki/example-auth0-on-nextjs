import { NextApiRequest, NextApiResponse } from 'next'
import { handleCallback } from '@auth0/nextjs-auth0'

export const auth0CallbackHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await handleCallback(req, res, {})
  } catch (err: unknown) {
    console.error('Auth0 callback error:',err)
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    const title = err instanceof Error ? err.message : "An error occurred";
    res.send(`
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body style="max-width: 40rem; margin: 1rem auto;">
        <h1 style="font-size: 1.5rem;">${title}</h1>
        <ul>${Object.entries(req.query).map(([key, value]): string => {
      const values = Array.isArray(value) ? value : [value];
      return `<li><strong>${key}:</strong><ul>${values.map((value) => `<li>${value}</li>`)}</ul></li>`;
    }).join("")}</ul>
      </body>
      </html>
    `);
    res.end();
    return;
  }
}
