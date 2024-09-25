import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FileText,
  Eye,
  Image as ImageIcon,
  ExternalLink,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { deleteFile } from "@/app/actions/delete-file";
import { getUserFiles, UserFile } from "@/app/actions/getUserFiles";

interface TransformedFile {
  key: string;
  name: string;
  url: string;
  type: "image" | "pdf" | string;
}

interface UserFilesDisplayProps {
  userId: string;
  refreshTrigger: number; // New prop to trigger refresh
}

const UserFilesDisplay: React.FC<UserFilesDisplayProps> = ({ userId, refreshTrigger }) => {
  const [userFiles, setUserFiles] = useState<TransformedFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserFiles = async () => {
      setIsLoading(true);
      try {
        const files = await getUserFiles(userId);
        const transformedFiles: TransformedFile[] = files.map(
          (file: UserFile) => ({
            key: file.id,
            name: file.fileName,
            url: file.fileUrl,
            type: file.fileType,
          }),
        );
        setUserFiles(transformedFiles);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFiles();
  }, [userId, refreshTrigger]);

  const handleRemoveFile = async (fileKey: string) => {
    try {
      const result = await deleteFile(userId, fileKey);
      if (result.success) {
        setUserFiles((prevFiles) =>
          prevFiles.filter((file) => file.key !== fileKey),
        );
        toast({
          title: "File record removed",
          description: result.message,
        });
      } else {
        console.error("Error removing file:", result.message, result.error);
        toast({
          title: "Error",
          description: result.error || result.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Unexpected error removing file:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderFilePreview = (file: TransformedFile) => {
    if (file.type === "image") {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-20 w-20 p-0">
              <Image
                src={file.url}
                alt={file.name}
                width={80}
                height={80}
                objectFit="cover"
                className="rounded-md"
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-4xl">
            <div
              className="relative h-full w-full"
              style={{ minHeight: "300px" }}
            >
              <Image
                src={file.url}
                alt={file.name}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="mt-4 text-right">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Open full size
                <ExternalLink size={16} className="ml-1" />
              </a>
            </div>
          </DialogContent>
        </Dialog>
      );
    } else if (file.type === "pdf") {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-20 w-20 p-2">
              <FileText size={32} />
              <Eye size={20} className="ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="h-[80vh] max-w-4xl p-0">
            <div className="flex h-full flex-col">
              <iframe
                src={`${file.url}#toolbar=0`}
                title={file.name}
                className="flex-grow border-none"
              />
              <div className="border-t bg-white p-4">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  Open in new tab
                  <ExternalLink size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100">
        <ImageIcon size={32} className="text-gray-400" />
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Files</CardTitle>
        <CardDescription>
          View and manage the users uploaded files here
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userFiles.length > 0 ? (
          <ul className="space-y-4">
            {userFiles.map((file) => (
              <li
                key={file.key}
                className="flex items-center space-x-4 rounded-md border p-2"
              >
                <div className="h-20 w-20 flex-shrink-0">
                  {renderFilePreview(file)}
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(file.key)}
                  className="text-red-500 hover:bg-red-100 hover:text-red-700"
                >
                  <X size={20} />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-4 text-center">
            <p>No files uploaded yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserFilesDisplay;
