import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image as ImageIcon,
  FileText,
  Save,
  Send,
  Trash2,
  MessageSquare,
  Paperclip,
  X,
} from "lucide-react";
import { type WriteUp, type Comment, type Attachment } from "./WriteUpList";

interface WriteUpEditorProps {
  writeUp?: WriteUp;
  onSave?: (writeUp: Partial<WriteUp>) => void;
  onCancel?: () => void;
}

export default function WriteUpEditor({
  writeUp,
  onSave,
  onCancel,
}: WriteUpEditorProps) {
  const [title, setTitle] = useState(writeUp?.title || "");
  const [content, setContent] = useState(writeUp?.content || "");
  const [status, setStatus] = useState<"draft" | "published">(
    writeUp?.status || "draft",
  );
  const [activeTab, setActiveTab] = useState("editor");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(writeUp?.comments || []);
  const [attachments, setAttachments] = useState<Attachment[]>(
    writeUp?.attachments || [],
  );
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "document">(
    "document",
  );

  const handleSave = (publish: boolean = false) => {
    if (onSave) {
      onSave({
        title,
        content,
        status: publish ? "published" : "draft",
        comments,
        attachments,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        author: {
          id: "1", // Current user ID
          name: "John Doe", // Current user name
          email: "john.doe@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        },
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleAddAttachment = () => {
    // In a real app, this would handle file upload
    const newAttachment: Attachment = {
      id: `attachment-${Date.now()}`,
      name: uploadType === "document" ? "new-document.docx" : "new-image.png",
      type: uploadType,
      url:
        uploadType === "document"
          ? "#"
          : "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
      createdAt: new Date().toISOString(),
    };
    setAttachments([...attachments, newAttachment]);
    setIsUploadDialogOpen(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {writeUp ? "Edit Document" : "New Document"}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSave(false)}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Document Title"
          className="text-xl font-bold mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex items-center space-x-2 mb-4">
          <Badge
            variant="outline"
            className={`${status === "published" ? "bg-green-50 text-green-800 border-green-300" : "bg-yellow-50 text-yellow-800 border-yellow-300"}`}
          >
            {status === "published" ? "Published" : "Draft"}
          </Badge>
          {writeUp && (
            <span className="text-sm text-gray-500">
              Last updated: {new Date(writeUp.updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="comments">
            Comments ({comments.length})
          </TabsTrigger>
          <TabsTrigger value="attachments">
            Attachments ({attachments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <div className="border rounded-md p-2 mb-4">
            <div className="flex items-center space-x-2 mb-2 border-b pb-2">
              <Button variant="ghost" size="sm">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Underline className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUploadType("image");
                  setIsUploadDialogOpen(true);
                }}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUploadType("document");
                  setIsUploadDialogOpen(true);
                }}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Start writing your document..."
              className="min-h-[300px] border-none focus-visible:ring-0"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No comments yet</h3>
                <p className="mt-1 text-gray-500">
                  Be the first to comment on this document.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>
                          {comment.author.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">{comment.author.name}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            <div className="flex items-start space-x-3 mt-6">
              <Avatar>
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=john" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Add a comment..."
                  className="mb-2"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={handleAddComment}>Add Comment</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attachments">
          <div className="space-y-4">
            {attachments.length === 0 ? (
              <div className="text-center py-8">
                <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No attachments</h3>
                <p className="mt-1 text-gray-500">
                  Add documents or images to this write-up.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attachments.map((attachment) => (
                  <Card key={attachment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 p-2 rounded">
                            {attachment.type === "document" ? (
                              <FileText className="h-6 w-6 text-blue-500" />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-green-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{attachment.name}</h4>
                            <p className="text-xs text-gray-500">
                              Added{" "}
                              {new Date(
                                attachment.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAttachment(attachment.id)}
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                      {attachment.type === "image" && (
                        <div className="mt-3">
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="rounded-md w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadType("document");
                  setIsUploadDialogOpen(true);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Add Document
              </Button>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => {
                  setUploadType("image");
                  setIsUploadDialogOpen(true);
                }}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {uploadType === "document" ? "Upload Document" : "Upload Image"}
            </DialogTitle>
            <DialogDescription>
              {uploadType === "document"
                ? "Upload a document file to attach to this write-up."
                : "Upload an image to include in this write-up."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {uploadType === "document" ? (
                  <FileText className="h-6 w-6 text-gray-500" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <p className="text-sm font-medium mb-1">
                {uploadType === "document"
                  ? "Drag and drop your document"
                  : "Drag and drop your image"}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {uploadType === "document"
                  ? "Supports DOC, DOCX, PDF, TXT"
                  : "Supports JPG, PNG, GIF up to 10MB"}
              </p>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAttachment}>
              {uploadType === "document" ? "Add Document" : "Add Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
