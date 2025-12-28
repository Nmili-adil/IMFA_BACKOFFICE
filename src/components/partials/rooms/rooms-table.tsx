"use client";

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Wifi,
  Tv,
  Snowflake,
  Coffee,
  Shield,
  Car,
  Users,
  Bed,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { ROOM_TYPES, STATUS_TYPES } from "@/store/roomStore";
import type { Room } from "@/store/roomStore";
import { DeleteRoomDialog } from "./delete-room-dialog";

type SortField = "numChambre" | "typeChambre" | "status" | "pricePerNight" | "capacity";
type SortDirection = "asc" | "desc";

const EQUIPMENTS_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-3 w-3" />,
  tv: <Tv className="h-3 w-3" />,
  ac: <Snowflake className="h-3 w-3" />,
  minibar: <Coffee className="h-3 w-3" />,
  safe: <Shield className="h-3 w-3" />,
  parking: <Car className="h-3 w-3" />,
};

const STATUS_COLORS: Record<string, string> = {
  "Disponible": "bg-green-100 text-green-800 border-green-200",
  "Occupée": "bg-red-100 text-red-800 border-red-200",
  "Maintenance": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Nettoyage": "bg-blue-100 text-blue-800 border-blue-200",
};

interface RoomsTableProps {
  rooms: Room[];
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export function RoomsTable({ rooms }: RoomsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("numChambre");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort rooms
  const filteredAndSortedRooms = useMemo(() => {
    let result = [...rooms];

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

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((room) => room.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "numChambre":
          comparison = a.numChambre - b.numChambre;
          break;
        case "typeChambre":
          comparison = a.typeChambre.localeCompare(b.typeChambre);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "pricePerNight":
          comparison = a.pricePerNight - b.pricePerNight;
          break;
        case "capacity":
          comparison = a.capacity - b.capacity;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [rooms, searchQuery, typeFilter, statusFilter, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRooms = filteredAndSortedRooms.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || typeFilter !== "all" || statusFilter !== "all";

  const handleDeleteClick = (room: Room) => {
    setSelectedRoom(room);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro, type ou vue..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={(v) => handleFilterChange(setTypeFilter, v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
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

        <Select value={statusFilter} onValueChange={(v) => handleFilterChange(setStatusFilter, v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {STATUS_TYPES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="shrink-0">
            <X className="mr-2 h-4 w-4" />
            Effacer
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredAndSortedRooms.length} chambre(s) trouvée(s)
          {hasActiveFilters && ` sur ${rooms.length}`}
        </p>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("numChambre")}
                  className="h-8 px-2 -ml-2"
                >
                  N° Chambre
                  <SortIcon field="numChambre" />
                </Button>
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("typeChambre")}
                  className="h-8 px-2 -ml-2"
                >
                  Type
                  <SortIcon field="typeChambre" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="h-8 px-2 -ml-2"
                >
                  Statut
                  <SortIcon field="status" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("pricePerNight")}
                  className="h-8 px-2 -ml-2"
                >
                  Prix/Nuit
                  <SortIcon field="pricePerNight" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("capacity")}
                  className="h-8 px-2 -ml-2"
                >
                  Capacité
                  <SortIcon field="capacity" />
                </Button>
              </TableHead>
              <TableHead>Vue</TableHead>
              <TableHead>Équipements</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Bed className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {hasActiveFilters
                        ? "Aucune chambre ne correspond aux filtres"
                        : "Aucune chambre enregistrée"}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="link" onClick={clearFilters}>
                        Effacer les filtres
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-muted-foreground" />
                      {room.numChambre}
                    </div>
                  </TableCell>
                  <TableCell>
                    {room.image ? (
                      <img
                        src={room.image}
                        alt={`Chambre ${room.numChambre}`}
                        className="h-10 w-14 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/56x40?text=N/A";
                        }}
                      />
                    ) : (
                      <div className="h-10 w-14 bg-muted rounded flex items-center justify-center">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{room.typeChambre}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[room.status] || ""}>
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{room.pricePerNight}</span>
                    <span className="text-muted-foreground text-sm"> DH</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {room.capacity}
                    </div>
                  </TableCell>
                  <TableCell>{room.vue}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {room.equipements?.slice(0, 4).map((eq) => (
                        <div
                          key={eq}
                          className="p-1 bg-muted rounded"
                          title={eq}
                        >
                          {EQUIPMENTS_ICONS[eq] || eq}
                        </div>
                      ))}
                      {room.equipements?.length > 4 && (
                        <div className="p-1 bg-muted rounded text-xs">
                          +{room.equipements.length - 4}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={`/rooms/${room.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/rooms/${room.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(room)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredAndSortedRooms.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Afficher</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>par page</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {startIndex + 1}-{Math.min(endIndex, filteredAndSortedRooms.length)} sur {filteredAndSortedRooms.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {selectedRoom && (
        <DeleteRoomDialog
          room={selectedRoom}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onSuccess={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
