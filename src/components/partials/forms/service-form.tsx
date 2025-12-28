// src/components/forms/service-form.tsx
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  Image, 
  DollarSign, 
  Clock, 
  Tag, 
  Plus, 
  X, 
  Loader2,
  Palette,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

// Icon options (from Lucide React)
const ICON_OPTIONS = [
  { value: "wifi", label: "Wi-Fi", icon: "Wifi" },
  { value: "coffee", label: "Café", icon: "Coffee" },
  { value: "car", label: "Parking", icon: "Car" },
  { value: "utensils", label: "Restaurant", icon: "Utensils" },
  { value: "droplets", label: "Spa", icon: "Droplets" },
  { value: "dumbbell", label: "Gym", icon: "Dumbbell" },
  { value: "concierge-bell", label: "Room Service", icon: "ConciergeBell" },
  { value: "shirt", label: "Blanchisserie", icon: "Shirt" },
  { value: "tv", label: "TV", icon: "Tv" },
  { value: "wind", label: "Climatisation", icon: "Wind" },
  { value: "shield", label: "Sécurité", icon: "Shield" },
  { value: "briefcase", label: "Business", icon: "Briefcase" },
] as const;

// Form schema
const serviceFormSchema = z.object({
  name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne doit pas dépasser 50 caractères"),
  icon: z.string()
    .min(1, "Veuillez sélectionner une icône"),
  description: z.string()
    .max(500, "La description ne doit pas dépasser 500 caractères")
    .optional(),
  price: z.string()
    .regex(/^\d*$/, "Le prix doit être un nombre")
    .optional()
    .or(z.literal("")),
  duration: z.string()
    .regex(/^\d*$/, "La durée doit être un nombre")
    .optional()
    .or(z.literal("")),
  category: z.string()
    .max(30, "La catégorie ne doit pas dépasser 30 caractères")
    .optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const defaultValues: Partial<ServiceFormValues> = {
  description: "",
  price: "",
  duration: "",
  category: "",
};

interface ServiceFormProps {
  onSuccess?: () => void;
  initialData?: ServiceFormValues;
  isEditing?: boolean;
}

export function ServiceForm({ onSuccess, initialData, isEditing = false }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>(
    initialData?.icon || ""
  );

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initialData || defaultValues,
  });

  async function onSubmit(data: ServiceFormValues) {
    setIsSubmitting(true);
    
    try {
      const serviceData = {
        name: data.name,
        icon: data.icon,
        description: data.description || null,
        price: data.price ? parseInt(data.price) : null,
        duration: data.duration ? parseInt(data.duration) : null,
        category: data.category || null,
      };

      console.log("Submitting service data:", serviceData);

      let result;
      if (isEditing && initialData) {
        // Update existing service (you'll need to pass the service ID)
        // result = await supabase
        //   .from("services")
        //   .update(serviceData)
        //   .eq("id", serviceId);
      } else {
        // Insert new service
        result = await supabase
          .from("services")
          .insert([serviceData])
          .select()
          .single();
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success(
        isEditing 
          ? "Service mis à jour avec succès!" 
          : "Service ajouté avec succès!"
      );
      
      form.reset();
      setSelectedIcon("");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de l'enregistrement"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Function to get Lucide icon component by name
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      wifi: <span className="text-lg">📶</span>,
      coffee: <span className="text-lg">☕</span>,
      car: <span className="text-lg">🚗</span>,
      utensils: <span className="text-lg">🍴</span>,
      droplets: <span className="text-lg">💧</span>,
      dumbbell: <span className="text-lg">🏋️</span>,
      'concierge-bell': <span className="text-lg">🛎️</span>,
      shirt: <span className="text-lg">👕</span>,
      tv: <span className="text-lg">📺</span>,
      wind: <span className="text-lg">💨</span>,
      shield: <span className="text-lg">🛡️</span>,
      briefcase: <span className="text-lg">💼</span>,
    };
    return iconMap[iconName] || <Sparkles className="h-5 w-5" />;
  };

  return (
    <Card className="border-0 shadow-lg max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>
              {isEditing ? "Modifier le Service" : "Ajouter un Nouveau Service"}
            </CardTitle>
            <CardDescription className="text-white/80">
              Remplissez les détails du service
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
                <div className="h-5 w-1 bg-blue-600 rounded-full"></div>
                Informations de Base
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Nom du Service
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Service de Petit Déjeuner" 
                          {...field} 
                          className="focus:ring-blue-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Restauration, Confort, Sécurité" 
                          {...field} 
                          className="focus:ring-blue-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez le service en détail..." 
                        className="min-h-[100px] focus:ring-blue-600"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 caractères
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Icon Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Sélectionner une Icône
                </h3>
                {selectedIcon && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="h-4 w-4" />
                    Icône sélectionnée
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {ICON_OPTIONS.map((icon) => (
                          <div
                            key={icon.value}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center gap-2 ${
                              selectedIcon === icon.value
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => {
                              setSelectedIcon(icon.value);
                              field.onChange(icon.value);
                            }}
                          >
                            {getIconComponent(icon.value)}
                            <span className="text-xs text-center truncate w-full">
                              {icon.label}
                            </span>
                            <div className={`h-2 w-2 rounded-full ${
                              selectedIcon === icon.value
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`} />
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Price & Duration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="h-5 w-1 bg-blue-600 rounded-full"></div>
                Tarification et Durée
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Prix (DH)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 50 (optionnel)" 
                          {...field} 
                          className="focus:ring-blue-600"
                        />
                      </FormControl>
                      <FormDescription>
                        Laissez vide si le service est gratuit
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Durée (minutes)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 60 (optionnel)" 
                          {...field} 
                          className="focus:ring-blue-600"
                        />
                      </FormControl>
                      <FormDescription>
                        Durée approximative du service
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Preview */}
            {form.watch("name") && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-3">Aperçu du Service</h4>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                    {selectedIcon ? getIconComponent(selectedIcon) : <Sparkles className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold">{form.watch("name")}</h5>
                    <p className="text-sm text-gray-600">
                      {form.watch("description") || "Aucune description"}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      {form.watch("price") && (
                        <span className="font-semibold text-blue-600">
                          {form.watch("price")} DH
                        </span>
                      )}
                      {form.watch("duration") && (
                        <span className="text-gray-500">
                          {form.watch("duration")} min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedIcon("");
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {isEditing ? "Mettre à jour" : "Ajouter le Service"}
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