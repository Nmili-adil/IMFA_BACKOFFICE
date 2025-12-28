import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoomStore } from "@/store/roomStore";
import type { RoomFormData } from "@/store/roomStore";
import { RoomForm } from "@/components/partials/forms/room-form";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";

export default function RoomEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchRoomById, selectedRoom, isLoading, error } = useRoomStore();
  const [initialData, setInitialData] = useState<RoomFormData | null>(null);

  useEffect(() => {
    if (id) {
      fetchRoomById(parseInt(id));
    }
  }, [id, fetchRoomById]);

  useEffect(() => {
    if (selectedRoom) {
      // Convert Room to RoomFormData
      setInitialData({
        numChambre: selectedRoom.numChambre.toString(),
        typeChambre: selectedRoom.typeChambre,
        status: selectedRoom.status,
        pricePerNight: selectedRoom.pricePerNight.toString(),
        capacity: selectedRoom.capacity.toString(),
        surface: selectedRoom.surface.toString(),
        bathrooms: selectedRoom.bathrooms.toString(),
        vue: selectedRoom.vue,
        image: selectedRoom.image || "",
        equipements: selectedRoom.equipements || [],
      });
    }
  }, [selectedRoom]);

  const handleSuccess = () => {
    navigate("/rooms");
  };

  if (isLoading && !selectedRoom) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!isLoading && !selectedRoom)) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Chambre introuvable</h2>
                <p className="text-muted-foreground mt-2">
                  {error || "La chambre demandée n'existe pas ou a été supprimée."}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/rooms">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la liste
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link to="/rooms">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            Modifier la Chambre N°{selectedRoom?.numChambre}
          </h1>
          <p className="text-muted-foreground mt-2">
            Modifiez les informations de la chambre
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {initialData && selectedRoom && (
            <RoomForm
              initialData={initialData}
              isEditing={true}
              roomId={selectedRoom.id}
              onSuccess={handleSuccess}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Informations actuelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedRoom?.image && (
                <img
                  src={selectedRoom.image}
                  alt={`Chambre ${selectedRoom.numChambre}`}
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x200?text=Image+non+disponible";
                  }}
                />
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{selectedRoom?.typeChambre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut:</span>
                  <span className="font-medium">{selectedRoom?.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix:</span>
                  <span className="font-medium">{selectedRoom?.pricePerNight} DH/nuit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacité:</span>
                  <span className="font-medium">{selectedRoom?.capacity} personne(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Surface:</span>
                  <span className="font-medium">{selectedRoom?.surface} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vue:</span>
                  <span className="font-medium">{selectedRoom?.vue}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conseils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                • Les modifications seront appliquées immédiatement
              </p>
              <p>
                • Vérifiez que le numéro de chambre n'est pas déjà utilisé
              </p>
              <p>
                • Le statut peut affecter les réservations en cours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
