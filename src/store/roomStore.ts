import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

// Room types
export const ROOM_TYPES = [
  "Simple",
  "Double",
  "Suite",
  "Deluxe",
  "Family",
  "Presidential"
] as const;

export const VUE_TYPES = [
  "Jardin",
  "Mer",
  "Ville",
  "Piscine",
  "Montagne"
] as const;

export const STATUS_TYPES = [
  "Disponible",
  "Occupée",
  "Maintenance",
  "Nettoyage"
] as const;

export type RoomType = typeof ROOM_TYPES[number];
export type VueType = typeof VUE_TYPES[number];
export type StatusType = typeof STATUS_TYPES[number];

export interface Room {
  id: number;
  numChambre: number;
  typeChambre: RoomType;
  status: StatusType;
  pricePerNight: number;
  capacity: number;
  surface: number;
  bathrooms: number;
  vue: VueType;
  image: string | null;
  equipements: string[];
  created_at?: string;
  updated_at?: string;
}

export interface RoomFormData {
  numChambre: string;
  typeChambre: RoomType;
  status: StatusType;
  pricePerNight: string;
  capacity: string;
  surface: string;
  bathrooms: string;
  vue: VueType;
  image?: string;
  equipements: string[];
}

interface RoomState {
  rooms: Room[];
  selectedRoom: Room | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRooms: () => Promise<void>;
  fetchRoomById: (id: number) => Promise<Room | null>;
  createRoom: (data: RoomFormData) => Promise<{ success: boolean; error?: string }>;
  updateRoom: (id: number, data: RoomFormData) => Promise<{ success: boolean; error?: string }>;
  deleteRoom: (id: number) => Promise<{ success: boolean; error?: string }>;
  setSelectedRoom: (room: Room | null) => void;
  clearError: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,

  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('numChambre', { ascending: true });

      if (error) throw error;

      set({ rooms: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des chambres',
        isLoading: false 
      });
    }
  },

  fetchRoomById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      set({ selectedRoom: data, isLoading: false });
      return data;
    } catch (error) {
      console.error('Error fetching room:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement de la chambre',
        isLoading: false 
      });
      return null;
    }
  },

  createRoom: async (data: RoomFormData) => {
    set({ isLoading: true, error: null });
    try {
      const roomData = {
        numChambre: parseInt(data.numChambre),
        typeChambre: data.typeChambre,
        status: data.status,
        pricePerNight: parseInt(data.pricePerNight),
        capacity: parseInt(data.capacity),
        surface: parseInt(data.surface),
        bathrooms: parseInt(data.bathrooms),
        vue: data.vue,
        image: data.image || null,
        equipements: data.equipements,
      };

      const { data: newRoom, error } = await supabase
        .from('rooms')
        .insert([roomData])
        .select()
        .single();

      if (error) throw error;

      // Add the new room to the list
      set((state) => ({
        rooms: [...state.rooms, newRoom].sort((a, b) => a.numChambre - b.numChambre),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Error creating room:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la chambre';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  updateRoom: async (id: number, data: RoomFormData) => {
    set({ isLoading: true, error: null });
    try {
      const roomData = {
        numChambre: parseInt(data.numChambre),
        typeChambre: data.typeChambre,
        status: data.status,
        pricePerNight: parseInt(data.pricePerNight),
        capacity: parseInt(data.capacity),
        surface: parseInt(data.surface),
        bathrooms: parseInt(data.bathrooms),
        vue: data.vue,
        image: data.image || null,
        equipements: data.equipements,
      };

      const { data: updatedRoom, error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update the room in the list
      set((state) => ({
        rooms: state.rooms.map((room) => 
          room.id === id ? updatedRoom : room
        ).sort((a, b) => a.numChambre - b.numChambre),
        selectedRoom: updatedRoom,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Error updating room:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la chambre';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  deleteRoom: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove the room from the list
      set((state) => ({
        rooms: state.rooms.filter((room) => room.id !== id),
        selectedRoom: state.selectedRoom?.id === id ? null : state.selectedRoom,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Error deleting room:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la chambre';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  setSelectedRoom: (room) => set({ selectedRoom: room }),
  
  clearError: () => set({ error: null }),
}));
