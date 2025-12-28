"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRoomStore } from "@/store/roomStore";
import type { Room } from "@/store/roomStore";
import { toast } from "sonner";

interface DeleteRoomDialogProps {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteRoomDialog({
  room,
  open,
  onOpenChange,
  onSuccess,
}: DeleteRoomDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteRoom } = useRoomStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteRoom(room.id);
      
      if (result.success) {
        toast.success(`Chambre ${room.numChambre} supprimée avec succès`);
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Une erreur est survenue lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Confirmer la suppression
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Êtes-vous sûr de vouloir supprimer la chambre{" "}
              <strong className="text-foreground">N°{room.numChambre}</strong> ?
            </p>
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p><strong>Type:</strong> {room.typeChambre}</p>
              <p><strong>Prix:</strong> {room.pricePerNight} DH/nuit</p>
              <p><strong>Capacité:</strong> {room.capacity} personne(s)</p>
            </div>
            <p className="text-red-600 font-medium">
              Cette action est irréversible.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
