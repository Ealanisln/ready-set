import * as React from "react"
import type { UploadedFile } from "@/types/uploaded-file"
import { toast } from "@/components/ui/use-toast"
import type { UploadFilesOptions } from "uploadthing/types"

import { getErrorMessage } from "@/lib/handle-error"
import { uploadFiles } from "@/lib/uploadthing"
import { type OurFileRouter } from "@/app/api/uploadthing/core"

interface UseUploadFileProps {
  defaultUploadedFiles?: UploadedFile[]
  userId?: string
  maxFileCount?: number
  maxFileSize?: number
  allowedFileTypes?: string[]
  onUploadBegin?: UploadFilesOptions<OurFileRouter, keyof OurFileRouter>["onUploadBegin"]
  onUploadProgress?: UploadFilesOptions<OurFileRouter, keyof OurFileRouter>["onUploadProgress"]
  headers?: UploadFilesOptions<OurFileRouter, keyof OurFileRouter>["headers"]
  skipPolling?: UploadFilesOptions<OurFileRouter, keyof OurFileRouter>["skipPolling"]
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  {
    defaultUploadedFiles = [],
    userId,
    maxFileCount,
    maxFileSize,
    allowedFileTypes,
    onUploadBegin,
    onUploadProgress,
    headers,
    skipPolling,
  }: UseUploadFileProps = {}
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles)
  const [progresses, setProgresses] = React.useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = React.useState(false)

  async function onUpload(files: File[]) {
    // Client-side validation
    if (maxFileCount && files.length > maxFileCount) {
      toast({ title: "Error", description: `You can only upload up to ${maxFileCount} files.`, variant: "destructive" })
      return
    }

    const invalidFiles = files.filter(file => {
      if (maxFileSize && file.size > maxFileSize) return true
      if (allowedFileTypes && !allowedFileTypes.includes(file.type)) return true
      return false
    })

    if (invalidFiles.length > 0) {
      toast({ title: "Error", description: "Some files are invalid. Please check file types and sizes.", variant: "destructive" })
      return
    }

    setIsUploading(true)
    try {
      // Add userId to headers if provided
      const updatedHeaders = userId
        ? { ...headers, "X-User-Id": userId }
        : headers

      const res = await uploadFiles(endpoint, {
        files,
        headers: updatedHeaders,
        onUploadBegin,
        skipPolling,
        onUploadProgress: (opts:any) => {
          setProgresses((prev) => ({
            ...prev,
            [opts.file.name]: opts.progress,
          }))
          onUploadProgress?.(opts)
        },
      })

      setUploadedFiles((prev) => (prev ? [...prev, ...res] : res))
    } catch (err) {
      toast({ title: "Error", description: getErrorMessage(err), variant: "destructive" })
    } finally {
      setProgresses({})
      setIsUploading(false)
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  }
}