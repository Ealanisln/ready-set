import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { files, userId } = await request.json()

    const savedFiles = await Promise.all(
      files.map(async (file: any) => {
        const savedFile = await prisma.file_upload.create({
          data: {
            userId: userId,
            fileName: file.name,
            fileType: file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
            fileSize: file.size,
            fileUrl: file.url,
          },
        })
        return savedFile
      })
    )

    return NextResponse.json(savedFiles, { status: 200 })
  } catch (error) {
    console.error('Error saving files:', error)
    return NextResponse.json({ message: 'Error saving files to database' }, { status: 500 })
  }
}