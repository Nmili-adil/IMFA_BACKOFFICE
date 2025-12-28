import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useRoomStore } from "@/store/roomStore";
import { DeleteRoomDialog } from "@/components/partials/rooms/delete-room-dialog";
import { useState } from "react";
import { ROUTES } from "@/constants/appConstants";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Bed,
  Users,
  Bath,
  Maximize,
  Eye,
  Wifi,
  Tv,
  Snowflake,
  Coffee,
  Shield,
  Car,
  Calendar,
  DollarSign,
  Home,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "Disponible": "bg-green-100 text-green-800 border-green-200",
  "Occupée": "bg-red-100 text-red-800 border-red-200",
  "Maintenance": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Nettoyage": "bg-blue-100 text-blue-800 border-blue-200",
};

const EQUIPMENT_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  wifi: { label: "WiFi Gratuit", icon: <Wifi className="h-5 w-5" /> },
  tv: { label: "Télévision", icon: <Tv className="h-5 w-5" /> },
  ac: { label: "Climatisation", icon: <Snowflake className="h-5 w-5" /> },
  minibar: { label: "Minibar", icon: <Coffee className="h-5 w-5" /> },
  safe: { label: "Coffre-fort", icon: <Shield className="h-5 w-5" /> },
  parking: { label: "Parking", icon: <Car className="h-5 w-5" /> },
};

export default function RoomDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedRoom, isLoading, error, fetchRoomById, setSelectedRoom } = useRoomStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRoomById(Number(id));
    }
    return () => {
      setSelectedRoom(null);
    };
  }, [id, fetchRoomById, setSelectedRoom]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] rounded-lg" />
            <Skeleton className="h-[200px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedRoom) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-red-100 rounded-full">
                <Home className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-800">
                  Chambre introuvable
                </h2>
                <p className="text-red-600 mt-2">
                  {error || "La chambre demandée n'existe pas ou a été supprimée."}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to={ROUTES.ROOMS}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la liste
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const room = selectedRoom;

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to={ROUTES.ROOMS}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bed className="h-8 w-8 text-[#967E62]" />
              Chambre {room.numChambre}
            </h1>
            <p className="text-muted-foreground mt-1">
              {room.typeChambre} • Vue {room.vue}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/rooms/${room.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Image */}
          <Card>
            <CardContent className="p-0">
              {room.image ? (
                <img
                  src={room.image}
                  alt={`Chambre ${room.numChambre}`}
                  className="w-full h-[400px] object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/800x400?text=Image+non+disponible";
                  }}
                />
              ) : (
                <div className="w-full h-[400px] bg-muted rounded-lg flex flex-col items-center justify-center">
                  <Bed className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune image disponible</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Room Details */}
          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
              <CardDescription>Détails de la chambre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Users className="h-6 w-6 text-[#967E62] mb-2" />
                  <span className="text-2xl font-bold">{room.capacity}</span>
                  <span className="text-sm text-muted-foreground">Personnes</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Maximize className="h-6 w-6 text-[#967E62] mb-2" />
                  <span className="text-2xl font-bold">{room.surface}</span>
                  <span className="text-sm text-muted-foreground">m²</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Bath className="h-6 w-6 text-[#967E62] mb-2" />
                  <span className="text-2xl font-bold">{room.bathrooms}</span>
                  <span className="text-sm text-muted-foreground">
                    Salle{room.bathrooms > 1 ? "s" : ""} de bain
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Eye className="h-6 w-6 text-[#967E62] mb-2" />
                  <span className="text-lg font-bold">{room.vue}</span>
                  <span className="text-sm text-muted-foreground">Vue</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipments */}
          <Card>
            <CardHeader>
              <CardTitle>Équipements</CardTitle>
              <CardDescription>Services et commodités inclus</CardDescription>
            </CardHeader>
            <CardContent>
              {room.equipements && room.equipements.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {room.equipements.map((eq) => (
                    <div
                      key={eq}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="p-2 bg-[#967E62]/10 rounded-lg text-[#967E62]">
                        {EQUIPMENT_LABELS[eq]?.icon || <Bed className="h-5 w-5" />}
                      </div>
                      <span className="font-medium">
                        {EQUIPMENT_LABELS[eq]?.label || eq}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Aucun équipement spécifié
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Price Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Statut
                <Badge className={STATUS_COLORS[room.status] || ""}>
                  {room.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-5 w-5" />
                  <span>Prix par nuit</span>
                </div>
                <div>
                  <span className="text-3xl font-bold text-[#967E62]">
                    {room.pricePerNight}
                  </span>
                  <span className="text-muted-foreground ml-1">DH</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline">{room.typeChambre}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Numéro</span>
                <span className="font-semibold">{room.numChambre}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vue</span>
                <span className="font-semibold">{room.vue}</span>
              </div>
              {room.created_at && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Créée le
                    </span>
                    <span className="text-sm">
                      {new Date(room.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <Link to={`/rooms/${room.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier la chambre
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link to={ROUTES.ROOMSNEW}>
                  <Bed className="mr-2 h-4 w-4" />
                  Ajouter une chambre
                </Link>
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                <span className="text-red-600">Supprimer</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteRoomDialog
        room={room}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => navigate(ROUTES.ROOMS)}
      />
    </div>
  );
}
