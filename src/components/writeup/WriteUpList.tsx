import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Edit,
  Trash2,
  FilePlus,
  AlertCircle,
  FileText,
  Image,
  MessageSquare,
  RotateCcw,
} from "lucide-react";

export type WriteUp = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published";
  comments: Comment[];
  attachments: Attachment[];
  isDeleted: boolean;
};

export type Comment = {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
};

export type Attachment = {
  id: string;
  name: string;
  type: "image" | "document";
  url: string;
  createdAt: string;
};

const initialWriteUps: WriteUp[] = [
  {
    id: "1",
    title: "Project Requirements Documentation",
    content: "This document outlines the requirements for the new project...",
    author: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:30:00Z",
    status: "published",
    comments: [
      {
        id: "1",
        content: "Great documentation, very thorough!",
        author: {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        },
        createdAt: "2023-05-16T14:45:00Z",
      },
    ],
    attachments: [
      {
        id: "1",
        name: "requirements.docx",
        type: "document",
        url: "#",
        createdAt: "2023-05-15T10:30:00Z",
      },
      {
        id: "2",
        name: "system-diagram.png",
        type: "image",
        url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
        createdAt: "2023-05-15T10:35:00Z",
      },
    ],
    isDeleted: false,
  },
  {
    id: "2",
    title: "Meeting Minutes - May 20",
    content: "Notes from our team meeting on May 20...",
    author: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    createdAt: "2023-05-20T15:00:00Z",
    updatedAt: "2023-05-20T16:30:00Z",
    status: "published",
    comments: [],
    attachments: [
      {
        id: "3",
        name: "meeting-notes.docx",
        type: "document",
        url: "#",
        createdAt: "2023-05-20T15:00:00Z",
      },
    ],
    isDeleted: false,
  },
  {
    id: "3",
    title: "Product Roadmap 2023",
    content: "Our product roadmap for the upcoming year...",
    author: {
      id: "3",
      name: "Emily Davis",
      email: "emily.d@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    },
    createdAt: "2023-05-10T09:15:00Z",
    updatedAt: "2023-05-12T11:20:00Z",
    status: "draft",
    comments: [
      {
        id: "2",
        content: "Can we add more details about Q3 objectives?",
        author: {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        },
        createdAt: "2023-05-11T10:30:00Z",
      },
      {
        id: "3",
        content: "I'll update with more details soon.",
        author: {
          id: "3",
          name: "Emily Davis",
          email: "emily.d@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
        },
        createdAt: "2023-05-11T14:20:00Z",
      },
    ],
    attachments: [
      {
        id: "4",
        name: "roadmap.docx",
        type: "document",
        url: "#",
        createdAt: "2023-05-10T09:15:00Z",
      },
      {
        id: "5",
        name: "timeline.png",
        type: "image",
        url: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&q=80",
        createdAt: "2023-05-10T09:20:00Z",
      },
    ],
    isDeleted: true,
  },
];

interface WriteUpListProps {
  writeUps: WriteUp[];
  onEdit: (writeUp: WriteUp) => void;
  onDelete: (writeUpId: string) => void;
}

export default function WriteUpList({
  writeUps,
  onEdit,
  onDelete,
}: WriteUpListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWriteUp, setSelectedWriteUp] = useState<WriteUp | null>(null);

  const filteredWriteUps = writeUps.filter(
    (writeUp) =>
      !writeUp.isDeleted &&
      (writeUp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        writeUp.content.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleDeleteWriteUp = (writeUp: WriteUp) => {
    setSelectedWriteUp(writeUp);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteWriteUp = () => {
    if (selectedWriteUp) {
      onDelete(selectedWriteUp.id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Documentation</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search documents..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowDeleted(!showDeleted)}
          >
            {showDeleted ? (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Show Active
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Recycle Bin
              </>
            )}
          </Button>
          <Button>
            <FilePlus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {filteredWriteUps.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No documents found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or create a new document.
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWriteUps.map((writeUp) => (
                <TableRow key={writeUp.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded">
                        <FileText className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium">{writeUp.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {writeUp.content.substring(0, 60)}...
                        </div>
                        <div className="flex items-center mt-1 space-x-2">
                          {writeUp.attachments.length > 0 && (
                            <span className="flex items-center text-xs text-gray-500">
                              <FileText className="h-3 w-3 mr-1" />
                              {
                                writeUp.attachments.filter(
                                  (a) => a.type === "document",
                                ).length
                              }
                            </span>
                          )}
                          {writeUp.attachments.filter((a) => a.type === "image")
                            .length > 0 && (
                            <span className="flex items-center text-xs text-gray-500">
                              <Image className="h-3 w-3 mr-1" />
                              {
                                writeUp.attachments.filter(
                                  (a) => a.type === "image",
                                ).length
                              }
                            </span>
                          )}
                          {writeUp.comments.length > 0 && (
                            <span className="flex items-center text-xs text-gray-500">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {writeUp.comments.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={writeUp.author.avatar} />
                        <AvatarFallback>
                          {writeUp.author.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{writeUp.author.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(writeUp.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${writeUp.status === "published" ? "bg-green-50 text-green-800 border-green-300" : "bg-yellow-50 text-yellow-800 border-yellow-300"}`}
                    >
                      {writeUp.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(writeUp)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteWriteUp(writeUp)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Recycle Bin</DialogTitle>
            <DialogDescription>
              Are you sure you want to move "{selectedWriteUp?.title}" to the
              recycle bin? You can restore it later if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteWriteUp}>
              Move to Recycle Bin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
