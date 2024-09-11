import * as React from "react"
import type { UploadedFile } from "@/types/uploaded-file"
import toast from "react-hot-toast";
import type { UploadFilesOptions } from "uploadthing/types"

import { getErrorMessage } from "@/lib/handle-error"
import { uploadFiles } from "@/lib/uploadthing"
import { type OurFileRouter } from "@/app/api/uploadthing/core"

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFiles?: UploadedFile[]
  maxFileCount?: number
  maxFileSize?: number
  allowedFileTypes?: string[]
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { 
    defaultUploadedFiles = [], 
    maxFileCount = 4,
    maxFileSize = 4 * 1024 * 1024, // 4MB
    allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    ...props 
  }: UseUploadFileProps = {}
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles)
  const [progresses, setProgresses] = React.useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = React.useState(false)

  async function onUpload(files: File[]) {
    // Validate file count
    if (files.length + uploadedFiles.length > maxFileCount) {
      toast.error(`You can only upload a maximum of ${maxFileCount} files.`)
      return
    }

    // Validate file types and sizes
    const invalidFiles = files.filter(file => 
      !allowedFileTypes.includes(file.type) || file.size > maxFileSize
    )

    if (invalidFiles.length > 0) {
      toast.error(`Some files are not allowed. Please check file types and sizes.`)
      return
    }

    setIsUploading(true)
    try {
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses((prev) => {
            return {
              ...prev,
              [file]: progress,
            }
          })
        },
      })

      setUploadedFiles((prev) => {
        const newFiles = res.map(file => ({
          ...file,
          fileType: file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'
        }))
        return prev ? [...prev, ...newFiles] : newFiles
      })
    } catch (err) {
      toast.error(getErrorMessage(err))
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