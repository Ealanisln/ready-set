import Image from "next/image"
import type { UploadedFile } from "@/types/uploaded-file"
import { FileText } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { EmptyCard } from "@/components/Uploader/empty-card"

interface UploadedFilesCardProps {
  uploadedFiles: UploadedFile[]
}

export function UploadedFilesCard({ uploadedFiles }: UploadedFilesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
        <CardDescription>View the uploaded files here</CardDescription>
      </CardHeader>
      <CardContent>
        {uploadedFiles.length > 0 ? (
          <ScrollArea className="pb-4">
            <div className="flex w-max space-x-2.5">
              {uploadedFiles.map((file) => (
                <div key={file.key} className="relative aspect-video w-64">
                  {file.url && file.url.toLowerCase().endsWith('.pdf') ? (
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                      <FileText size={48} />
                      <span className="ml-2 text-sm">{file.name}</span>
                    </a>
                  ) : file.url ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      sizes="(min-width: 640px) 640px, 100vw"
                      loading="lazy"
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                      <span className="text-sm text-gray-500">No URL available</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <EmptyCard
            title="No files uploaded"
            description="Upload some files to see them here"
            className="w-full"
          />
        )}
      </CardContent>
    </Card>
  )
}