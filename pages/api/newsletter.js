import { connectDatabase } from '@/helpers/db-util';

async function insertUsers(client, data) {
  await client.connect();

  await client.query('INSERT INTO users(email) VALUES($1)', [data.email]);
}

async function handler(req, res) {
  if (req.method === 'POST') {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({ message: 'Invalid email address.' });
      return;
    }

    let client;
    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Database connection failed.' });
      return;
    }

    try {
      await insertUsers(client, { email: userEmail });
      await client.end();
      res.status(201).json({ message: 'Signed up successfully!' });
    } catch (error) {
      await client.end();
      res.status(500).json({ message: 'Inserting data failed!' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

export default handler;
