// components/Uploader/uploaded-files-viewer.tsx
import React from "react";
import { 
  FileText, 
  FileImage, 
  FileCode, 
  FileSpreadsheet, 
  Eye,
  Download,
  Clock,
  File as FileIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/types/file";
import { format } from "date-fns";

interface UploadedFilesViewerProps {
  files: FileUpload[];
  isLoading?: boolean;
  onFileClick?: (file: FileUpload) => void;
}

const UploadedFilesViewer: React.FC<UploadedFilesViewerProps> = ({ 
  files, 
  isLoading = false,
  onFileClick
}) => {
  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading files...</span>
      </div>
    );
  }

  if (!files.length) {
    return (
      <div className="flex h-24 items-center justify-center border border-dashed rounded-md">
        <p className="text-muted-foreground">No files attached</p>
      </div>
    );
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string | null): React.ReactNode => {
    if (!fileType) return <FileIcon className="h-5 w-5" />;
    
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    }
    
    if (fileType === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    }
    
    if (fileType.includes('document') || fileType.includes('word')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
    
    if (fileType.includes('code') || fileType.includes('json') || fileType.includes('xml')) {
      return <FileCode className="h-5 w-5 text-yellow-600" />;
    }
    
    return <FileIcon className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Uploaded Files ({files.length})</div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.fileType)}
                    <span className="truncate max-w-[250px]">{file.fileName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {file.category || "general"}
                  </Badge>
                </TableCell>
                <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                <TableCell>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span className="text-xs">
                      {format(new Date(file.uploadedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onFileClick?.(file)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(file.fileUrl, '_blank')}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UploadedFilesViewer;