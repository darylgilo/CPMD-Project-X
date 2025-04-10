import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WriteUpList, { WriteUp } from "@/components/writeup/WriteUpList";
import WriteUpEditor from "@/components/writeup/WriteUpEditor";
import RecycleBin from "@/components/writeup/RecycleBin";
import { FilePlus } from "lucide-react";
import { Header } from "@/components/layout/Header";

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
];

export default function UserWriteUps() {
  const [writeUps, setWriteUps] = useState<WriteUp[]>(initialWriteUps);
  const [activeTab, setActiveTab] = useState("documents");
  const [isEditing, setIsEditing] = useState(false);
  const [currentWriteUp, setCurrentWriteUp] = useState<WriteUp | null>(null);

  const activeWriteUps = writeUps.filter((writeUp) => !writeUp.isDeleted);
  const deletedWriteUps = writeUps.filter((writeUp) => writeUp.isDeleted);

  const handleCreateNew = () => {
    setCurrentWriteUp(null);
    setIsEditing(true);
  };

  const handleEdit = (writeUp: WriteUp) => {
    setCurrentWriteUp(writeUp);
    setIsEditing(true);
  };

  const handleSave = (updatedWriteUp: Partial<WriteUp>) => {
    if (currentWriteUp) {
      // Update existing write-up
      setWriteUps(
        writeUps.map((writeUp) =>
          writeUp.id === currentWriteUp.id
            ? { ...writeUp, ...updatedWriteUp }
            : writeUp,
        ),
      );
    } else {
      // Create new write-up
      const newWriteUp: WriteUp = {
        id: `writeup-${Date.now()}`,
        title: updatedWriteUp.title || "Untitled Document",
        content: updatedWriteUp.content || "",
        author: {
          id: "1", // Current user ID
          name: "John Doe", // Current user name
          email: "john.doe@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: updatedWriteUp.status || "draft",
        comments: updatedWriteUp.comments || [],
        attachments: updatedWriteUp.attachments || [],
        isDeleted: false,
      };
      setWriteUps([...writeUps, newWriteUp]);
    }
    setIsEditing(false);
  };

  const handleDelete = (writeUpId: string) => {
    setWriteUps(
      writeUps.map((writeUp) =>
        writeUp.id === writeUpId ? { ...writeUp, isDeleted: true } : writeUp,
      ),
    );
  };

  const handleRestore = (writeUpId: string) => {
    setWriteUps(
      writeUps.map((writeUp) =>
        writeUp.id === writeUpId ? { ...writeUp, isDeleted: false } : writeUp,
      ),
    );
  };

  const handlePermanentDelete = (writeUpId: string) => {
    setWriteUps(writeUps.filter((writeUp) => writeUp.id !== writeUpId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Documentation" userType="user" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          <WriteUpEditor
            writeUp={currentWriteUp || undefined}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Documentation</h1>
              <Button onClick={handleCreateNew}>
                <FilePlus className="h-4 w-4 mr-2" />
                New Document
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="recyclebin">Recycle Bin</TabsTrigger>
              </TabsList>

              <TabsContent value="documents">
                <WriteUpList
                  writeUps={activeWriteUps}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TabsContent>

              <TabsContent value="recyclebin">
                <RecycleBin
                  deletedWriteUps={deletedWriteUps}
                  onRestore={handleRestore}
                  onPermanentDelete={handlePermanentDelete}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
