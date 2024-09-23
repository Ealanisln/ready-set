import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, users_type } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = req.query;
  const { newRole } = req.body;

  // Validate that newRole is a valid users_type
  if (!Object.values(users_type).includes(newRole as users_type)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: String(userId) },
      data: { type: newRole as users_type },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
}