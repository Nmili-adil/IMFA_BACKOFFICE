import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoomStore, ROOM_TYPES, VUE_TYPES } from "@/store/roomStore";
import { ROUTES } from "@/constants/appConstants";
import {
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Eye,
  Pencil,
  Bed,
  Users,
  Maximize,
  AlertTriangle,
  Search,
  Filter,
  X,
  DollarSign,
  Bath,
} from "lucide-react";

export default function RoomsAvailablePage() {
  const { rooms, isLoading, error, fetchRooms } = useRoomStore();
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [vueFilter, setVueFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const availableRooms = useMemo(() => {
    let result = rooms.filter((room) => room.status === "Disponible");

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (room) =>
          room.numChambre.toString().includes(query) ||
          room.typeChambre.toLowerCase().includes(query) ||
          room.vue.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((room) => room.typeChambre === typeFilter);
    }

    // Vue filter
    if (vueFilter !== "all") {
      result = result.filter((room) => room.vue === vueFilter);
    }

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((room) => {
        if (max) {
          return room.pricePerNight >= min && room.pricePerNight <= max;
        }
        return room.pricePerNight >= min;
      });
    }

    return result;
  }, [rooms, searchQuery, typeFilter, vueFilter, priceRange]);

  const totalAvailable = rooms.filter((r) => r.status === "Disponible").length;
  const hasActiveFilters = searchQuery || typeFilter !== "all" || vueFilter !== "all" || priceRange !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setVueFilter("all");
    setPriceRange("all");
  };

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
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              Chambres Disponibles
            </h1>
            <p className="text-muted-foreground mt-2">
              {totalAvailable} chambre{totalAvailable > 1 ? "s" : ""} prête{totalAvailable > 1 ? "s" : ""} à être réservée{totalAvailable > 1 ? "s" : ""}
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

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type de chambre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {ROOM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={vueFilter} onValueChange={setVueFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Vue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les vues</SelectItem>
                {VUE_TYPES.map((vue) => (
                  <SelectItem key={vue} value={vue}>
                    {vue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="0-500">0 - 500 DH</SelectItem>
                <SelectItem value="500-1000">500 - 1000 DH</SelectItem>
                <SelectItem value="1000-2000">1000 - 2000 DH</SelectItem>
                <SelectItem value="2000-5000">2000 - 5000 DH</SelectItem>
                <SelectItem value="5000-">5000+ DH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {availableRooms.length} résultat{availableRooms.length > 1 ? "s" : ""}
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Effacer les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
                <Skeleton className="h-48 w-full rounded-lg mb-4" />
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : availableRooms.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-yellow-100 rounded-full">
                <Bed className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {hasActiveFilters
                    ? "Aucune chambre ne correspond aux filtres"
                    : "Aucune chambre disponible"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {hasActiveFilters
                    ? "Essayez d'ajuster vos critères de recherche"
                    : "Toutes les chambres sont actuellement occupées ou en maintenance."}
                </p>
              </div>
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              ) : (
                <Button asChild>
                  <Link to={ROUTES.ROOMS}>
                    Voir toutes les chambres
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                {room.image ? (
                  <img
                    src={room.image}
                    alt={`Chambre ${room.numChambre}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                <Badge className="absolute top-3 right-3 bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Disponible
                </Badge>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-[#967E62]" />
                    <span className="font-bold text-[#967E62]">{room.pricePerNight}</span>
                    <span className="text-sm text-muted-foreground">DH/nuit</span>
                  </div>
                </div>
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
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {room.bathrooms} SDB
                  </div>
                </div>
                
                {/* Equipment badges */}
                {room.equipements && room.equipements.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.equipements.slice(0, 4).map((eq) => (
                      <Badge key={eq} variant="secondary" className="text-xs">
                        {eq}
                      </Badge>
                    ))}
                    {room.equipements.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{room.equipements.length - 4}
                      </Badge>
                    )}
                  </div>
                )}

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
