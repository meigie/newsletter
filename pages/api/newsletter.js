import { Client } from 'pg';

async function handler(req, res) {
  if (req.method === 'POST') {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({ message: 'Invalid email address.' });
      return;
    }

    // Connect to PostgreSQL
    const client = new Client({
      connectionString: process.env.POSTGRES_URL, // Set this in your .env.local
    });

    try {
      await client.connect();
      await client.query('INSERT INTO users(email) VALUES($1)', [userEmail]);
      await client.end();
      res.status(201).json({ message: 'Signed up successfully!' });
    } catch (error) {
      await client.end();
      res.status(500).json({ message: 'Database error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

export default handler;
