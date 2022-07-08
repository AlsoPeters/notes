import { prisma } from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const noteId = req.query.id;

  if (req.method === 'DELETE') {
    const note = await prisma.note.delete({
      where: { id: Number(noteId) },
    });
    res.json(note);
  }
  if (req.method === 'PUT') {
    const note = await prisma.note.update({
      where: { id: Number(noteId) },
      data: {
        // I need to find out how to pull data from the input fields here instead of hard coding strings.
        // https://youtu.be/cQ6V7ZHzg8c?t=2879
        title: 'This is a test',
        content: 'Content test',
      },
    });
    res.json(note);
  } else {
    console.log('Note could not be created');
  }
}
