import { Client } from 'pg';

async function handler(req, res) {
  const eventId = req.query.eventId;

  if (req.method === 'POST') {
    const { email, name, text } = req.body;

    if (
      !email ||
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !text ||
      text.trim() === ''
    ) {
      res.status(422).json({ message: 'Invalid input.' });
      return;
    }

    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
    });

    try {
      await client.connect();
      const result = await client.query(
        'INSERT INTO comments(event_id, email, name, text) VALUES($1, $2, $3, $4) RETURNING *',
        [eventId, email, name, text]
      );
      await client.end();

      res.status(201).json({
        message: 'Comment added successfully!',
        comment: result.rows[0],
      });
    } catch (error) {
      await client.end();
      res.status(500).json({ message: 'Database error.' });
    }
  }

  if (req.method === 'GET') {
    console.log('Fetching comments for event:', eventId);
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
    });

    try {
      await client.connect();
      const result = await client.query(
        'SELECT id, event_id, email, name, text FROM comments WHERE event_id = $1 ORDER BY id DESC',
        [eventId]
      );
      await client.end();

      console.log(result.rows);

      res.status(200).json({ comments: result.rows });
    } catch (error) {
      await client.end();
      res.status(500).json({ message: 'Database error.' });
    }
  }
}

export default handler;
