// src/components/forms/room-form.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Bed, 
  Bath, 
  Users, 
  Ruler, 
  Image, 
  Eye, 
  Wifi, 
  Tv, 
  Snowflake,
  Coffee,
  Car,
  Shield,
  Plus,
  X,
  Loader2
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRoomStore, ROOM_TYPES, VUE_TYPES, STATUS_TYPES, RoomFormData } from "@/store/roomStore";
import { toast } from "sonner";

// Available equipments
const EQUIPEMENTS_LIST = [
  { id: "wifi", label: "Wi-Fi", icon: <Wifi className="h-4 w-4" /> },
  { id: "tv", label: "TV", icon: <Tv className="h-4 w-4" /> },
  { id: "ac", label: "Climatisation", icon: <Snowflake className="h-4 w-4" /> },
  { id: "minibar", label: "Minibar", icon: <Coffee className="h-4 w-4" /> },
  { id: "safe", label: "Coffre-fort", icon: <Shield className="h-4 w-4" /> },
  { id: "parking", label: "Parking", icon: <Car className="h-4 w-4" /> },
];

// Form schema
const roomFormSchema = z.object({
  numChambre: z.string()
    .min(1, "Le numéro de chambre est requis")
    .regex(/^\d+$/, "Le numéro doit contenir uniquement des chiffres"),
  typeChambre: z.enum(ROOM_TYPES, {
    required_error: "Veuillez sélectionner un type de chambre",
  }),
  status: z.enum(STATUS_TYPES, {
    required_error: "Veuillez sélectionner un statut",
  }),
  pricePerNight: z.string()
    .min(1, "Le prix est requis")
    .regex(/^\d+$/, "Le prix doit être un nombre"),
  capacity: z.string()
    .min(1, "La capacité est requise")
    .regex(/^\d+$/, "La capacité doit être un nombre"),
  surface: z.string()
    .min(1, "La surface est requise")
    .regex(/^\d+$/, "La surface doit être un nombre"),
  bathrooms: z.string()
    .min(1, "Le nombre de salles de bain est requis")
    .regex(/^\d+$/, "Le nombre doit être un chiffre"),
  vue: z.enum(VUE_TYPES, {
    required_error: "Veuillez sélectionner une vue",
  }),
  image: z.string()
    .url("Veuillez entrer une URL valide")
    .optional()
    .or(z.literal("")),
  equipements: z.array(z.string()).optional().default([]),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

const defaultValues: Partial<RoomFormValues> = {
  status: "Disponible",
  equipements: ["wifi", "ac"], // Default selected equipments
};

interface RoomFormProps {
  onSuccess?: () => void;
  initialData?: RoomFormValues;
  isEditing?: boolean;
  roomId?: number;
}

export function RoomForm({ onSuccess, initialData, isEditing = false, roomId }: RoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>(
    initialData?.equipements || defaultValues.equipements || []
  );
  
  const { createRoom, updateRoom } = useRoomStore();

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: initialData || defaultValues,
  });

  async function onSubmit(data: RoomFormValues) {
    setIsSubmitting(true);
    
    try {
      const roomData: RoomFormData = {
        numChambre: data.numChambre,
        typeChambre: data.typeChambre,
        status: data.status,
        pricePerNight: data.pricePerNight,
        capacity: data.capacity,
        surface: data.surface,
        bathrooms: data.bathrooms,
        vue: data.vue,
        image: data.image || "",
        equipements: selectedEquipments,
      };

      console.log("Submitting room data:", roomData);

      let result;
      if (isEditing && roomId) {
        result = await updateRoom(roomId, roomData);
      } else {
        result = await createRoom(roomData);
      }

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de l'enregistrement");
      }

      toast.success(
        isEditing 
          ? "Chambre mise à jour avec succès!" 
          : "Chambre ajoutée avec succès!"
      );
      
      if (!isEditing) {
        form.reset();
        setSelectedEquipments(defaultValues.equipements || []);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving room:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de l'enregistrement"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const toggleEquipment = (equipmentId: string) => {
    setSelectedEquipments(prev =>
      prev.includes(equipmentId)
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
    form.setValue("equipements", selectedEquipments.includes(equipmentId)
      ? selectedEquipments.filter(id => id !== equipmentId)
      : [...selectedEquipments, equipmentId]
    );
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#967E62] to-[#795E46] text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>
              {isEditing ? "Modifier la Chambre" : "Ajouter une Nouvelle Chambre"}
            </CardTitle>
            <CardDescription className="text-white/80">
              Remplissez les détails de la chambre
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="h-5 w-1 bg-[#967E62] rounded-full"></div>
                Informations de Base
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numChambre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        Numéro de Chambre
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 101" 
                          {...field} 
                          className="focus:ring-[#967E62]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="typeChambre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de Chambre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-[#967E62]">
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ROOM_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-[#967E62]">
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_TYPES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricePerNight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <span className="font-bold">DH</span>
                        Prix par Nuit
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 500" 
                          {...field} 
                          className="focus:ring-[#967E62]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Room Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="h-5 w-1 bg-[#967E62] rounded-full"></div>
                Détails de la Chambre
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Capacité
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 2" 
                          {...field} 
                          className="focus:ring-[#967E62]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surface"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Ruler className="h-4 w-4" />
                        Surface (m²)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 25" 
                          {...field} 
                          className="focus:ring-[#967E62]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Bath className="h-4 w-4" />
                        Salles de Bain
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 1" 
                          {...field} 
                          className="focus:ring-[#967E62]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Vue
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-[#967E62]">
                            <SelectValue placeholder="Sélectionner une vue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VUE_TYPES.map((vue) => (
                            <SelectItem key={vue} value={vue}>
                              {vue}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Equipment Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Équipements</h3>
                <span className="text-sm text-gray-500">
                  {selectedEquipments.length} sélectionné(s)
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {EQUIPEMENTS_LIST.map((equipment) => (
                  <div
                    key={equipment.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedEquipments.includes(equipment.id)
                        ? "border-[#967E62] bg-[#967E62]/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleEquipment(equipment.id)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        selectedEquipments.includes(equipment.id)
                          ? "bg-[#967E62] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {equipment.icon}
                      </div>
                      <span className="text-sm font-medium text-center">
                        {equipment.label}
                      </span>
                      <div className={`h-2 w-2 rounded-full ${
                        selectedEquipments.includes(equipment.id)
                          ? "bg-[#967E62]"
                          : "bg-gray-300"
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
              
              <FormField
                control={form.control}
                name="equipements"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Image URL */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="h-5 w-1 bg-[#967E62] rounded-full"></div>
                Image de la Chambre
              </h3>
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      URL de l'Image
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/room-image.jpg" 
                        {...field} 
                        className="focus:ring-[#967E62]"
                      />
                    </FormControl>
                    <FormDescription>
                      Entrez une URL valide pour l'image de la chambre
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("image") && (
                <div className="mt-2">
                  <div className="relative h-48 w-full rounded-lg overflow-hidden border">
                    <img
                      src={form.watch("image")}
                      alt="Preview"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Image+non+disponible";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedEquipments(defaultValues.equipements || []);
                }}
                disabled={isSubmitting}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#967E62] to-[#795E46] hover:from-[#795E46] hover:to-[#3F3124]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {isEditing ? "Mettre à jour" : "Ajouter la Chambre"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}