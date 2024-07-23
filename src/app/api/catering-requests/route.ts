// pages/api/catering-requests.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { CateringRequestFormData } from '@/types/catering';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.method === 'POST') {
    return handlePost(req, res, session.user.id);
  } else if (req.method === 'GET') {
    return handleGet(req, res, session.user.id);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const cateringData: CateringRequestFormData = req.body;
  try {
    const newCateringRequest = await prisma.catering_request.create({
      data: {
        user: { connect: { id: userId } },
        address: { connect: { id: BigInt(cateringData.address_id) } },
        // ... other fields ...
      },
    });
    res.status(201).json(newCateringRequest);
  } catch (error) {
    console.error('Error creating catering request:', error);
    res.status(400).json({ error: 'Error creating catering request' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const cateringRequests = await prisma.catering_request.findMany({
      where: { user_id: userId },
      include: { address: true },
    });
    res.status(200).json(cateringRequests);
  } catch (error) {
    console.error('Error fetching catering requests:', error);
    res.status(400).json({ error: 'Error fetching catering requests' });
  }
}