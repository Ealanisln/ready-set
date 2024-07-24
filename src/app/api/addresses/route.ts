import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.method === 'GET') {
    try {
      const addresses = await prisma.address.findMany({
        where: { user_id: session.user.id },
      });
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching addresses' });
    }
  } else if (req.method === 'POST') {
    const addressData = req.body;
    try {
      const newAddress = await prisma.address.create({
        data: {
          ...addressData,
          user: { connect: { id: session.user.id } },
        },
      });
      res.status(201).json(newAddress);
    } catch (error) {
      res.status(500).json({ error: 'Error creating address' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}