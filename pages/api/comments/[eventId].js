import { connectDatabase } from '@/helpers/db-util';

async function insertComment(client, data) {
  console.log('Inserting comment:', data);
  const { eventId, email, name, text } = data;

  await client.connect();
  return await client.query(
    'INSERT INTO comments(event_id, email, name, text) VALUES($1, $2, $3, $4) RETURNING *',
    [eventId, email, name, text]
  );
}

async function fetchComments(client, eventId) {
  console.log('Fetching comments for event:', eventId);

  await client.connect();
  const result = await client.query(
    'SELECT id, event_id, email, name, text FROM comments WHERE event_id = $1 ORDER BY id DESC',
    [eventId]
  );

  return result;
}

async function handler(req, res) {
  const eventId = req.query.eventId;

  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed.' });
    return;
  }

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
      await client.end();
      return;
    }

    try {
      const result = await insertComment(client, {
        eventId,
        email,
        name,
        text,
      });
      res.status(201).json({
        message: 'Comment added successfully!',
        comment: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({ message: 'Database error.' });
    }
  }

  if (req.method === 'GET') {
    console.log('Fetching comments for event:', eventId);

    try {
      const result = await fetchComments(client, eventId);
      res.status(200).json({ comments: result.rows });
    } catch (error) {
      res.status(500).json({ message: 'Database error.' });
    }
  }
  await client.end();
}

export default handler;
