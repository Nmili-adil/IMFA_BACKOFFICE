import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoomStore } from "@/store/roomStore";
import { RoomsTable } from "@/components/partials/rooms/rooms-table";
import { Plus, Home, RefreshCw, CheckCircle2, Wrench } from "lucide-react";
import { ROUTES } from "@/constants/appConstants";

export default function RoomsListPage() {
  const { rooms, isLoading, error, fetchRooms } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Home className="h-8 w-8 text-[#967E62]" />
            Gestion des Chambres
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez toutes les chambres de votre établissement
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetchRooms()}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button asChild className="bg-gradient-to-r from-[#967E62] to-[#795E46] hover:from-[#795E46] hover:to-[#3F3124]">
            <Link to={ROUTES.ROOMSNEW}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une Chambre
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/rooms/available">
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
            Disponibles ({rooms.filter((r) => r.status === "Disponible").length})
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/rooms/maintenance">
            <Wrench className="mr-2 h-4 w-4 text-yellow-600" />
            Maintenance ({rooms.filter((r) => r.status === "Maintenance" || r.status === "Nettoyage").length})
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Chambres</CardDescription>
            <CardTitle className="text-3xl">
              {isLoading ? <Skeleton className="h-9 w-16" /> : rooms.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Disponibles</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                rooms.filter((r) => r.status === "Disponible").length
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Occupées</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                rooms.filter((r) => r.status === "Occupée").length
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En Maintenance</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                rooms.filter((r) => r.status === "Maintenance" || r.status === "Nettoyage").length
              )}
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
                <Home className="h-5 w-5 text-red-600" />
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
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-14 rounded" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                  <div className="flex gap-1 flex-1">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-6 w-6 rounded" />
                    ))}
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des Chambres</CardTitle>
            <CardDescription>
              Visualisez, filtrez et gérez toutes vos chambres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoomsTable rooms={rooms} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
