import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoomStore } from "@/store/roomStore";
import { ROUTES } from "@/constants/appConstants";
import {
  ArrowLeft,
  Wrench,
  RefreshCw,
  Eye,
  Pencil,
  Bed,
  Users,
  Maximize,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const STATUS_ICONS: Record<string, React.ReactNode> = {
  "Maintenance": <Wrench className="h-5 w-5" />,
  "Nettoyage": <Sparkles className="h-5 w-5" />,
};

const STATUS_COLORS: Record<string, string> = {
  "Maintenance": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Nettoyage": "bg-blue-100 text-blue-800 border-blue-200",
};

export default function RoomsMaintenancePage() {
  const { rooms, isLoading, error, fetchRooms } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const maintenanceRooms = rooms.filter(
    (room) => room.status === "Maintenance" || room.status === "Nettoyage"
  );

  const maintenanceCount = rooms.filter((r) => r.status === "Maintenance").length;
  const cleaningCount = rooms.filter((r) => r.status === "Nettoyage").length;

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
              <Wrench className="h-8 w-8 text-yellow-600" />
              Chambres en Maintenance
            </h1>
            <p className="text-muted-foreground mt-2">
              Chambres nécessitant une intervention ou un nettoyage
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchRooms()}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Indisponibles</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {isLoading ? <Skeleton className="h-9 w-16" /> : maintenanceRooms.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              En Maintenance
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {isLoading ? <Skeleton className="h-9 w-16" /> : maintenanceCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              En Nettoyage
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {isLoading ? <Skeleton className="h-9 w-16" /> : cleaningCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-800">Erreur de chargement</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <Button variant="outline" onClick={() => fetchRooms()}>
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && !rooms.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-40 w-full rounded-lg mb-4" />
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : maintenanceRooms.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-green-100 rounded-full">
                <Wrench className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800">
                  Tout est en ordre !
                </h3>
                <p className="text-muted-foreground mt-2">
                  Aucune chambre n'est actuellement en maintenance ou en nettoyage.
                </p>
              </div>
              <Button asChild>
                <Link to={ROUTES.ROOMS}>
                  Voir toutes les chambres
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maintenanceRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {room.image ? (
                  <img
                    src={room.image}
                    alt={`Chambre ${room.numChambre}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x200?text=Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Bed className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge
                  className={`absolute top-3 right-3 ${STATUS_COLORS[room.status]}`}
                >
                  <span className="mr-1">{STATUS_ICONS[room.status]}</span>
                  {room.status}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-[#967E62]" />
                    Chambre {room.numChambre}
                  </CardTitle>
                  <Badge variant="outline">{room.typeChambre}</Badge>
                </div>
                <CardDescription>Vue {room.vue}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {room.capacity} pers.
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    {room.surface} m²
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/rooms/${room.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Détails
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/rooms/${room.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
