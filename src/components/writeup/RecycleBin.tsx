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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, RotateCcw, Trash2, AlertCircle, FileText } from "lucide-react";
import { type WriteUp } from "./WriteUpList";

interface RecycleBinProps {
  deletedWriteUps: WriteUp[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}

export default function RecycleBin({
  deletedWriteUps,
  onRestore,
  onPermanentDelete,
}: RecycleBinProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWriteUp, setSelectedWriteUp] = useState<WriteUp | null>(null);

  const filteredWriteUps = deletedWriteUps.filter((writeUp) =>
    writeUp.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePermanentDelete = (writeUp: WriteUp) => {
    setSelectedWriteUp(writeUp);
    setIsDeleteDialogOpen(true);
  };

  const confirmPermanentDelete = () => {
    if (selectedWriteUp) {
      onPermanentDelete(selectedWriteUp.id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recycle Bin</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search deleted documents..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredWriteUps.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">Recycle bin is empty</h3>
          <p className="mt-1 text-gray-500">No deleted documents found.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Deleted Date</TableHead>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRestore(writeUp.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handlePermanentDelete(writeUp)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Permanently
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Permanent Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permanently Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete "
              {selectedWriteUp?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmPermanentDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
