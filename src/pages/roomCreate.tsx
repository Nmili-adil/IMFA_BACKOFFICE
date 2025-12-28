
import { RoomForm } from "@/components/partials/forms/room-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";
import {Link} from "react-router-dom";

export default function AddRoomPage() {
  const handleSuccess = () => {
    // Handle success (e.g., redirect, show notification)
    console.log("Room added successfully!");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/rooms">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ajouter une Nouvelle Chambre</h1>
          <p className="text-gray-600 mt-2">
            Remplissez le formulaire pour ajouter une nouvelle chambre à votre hôtel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RoomForm onSuccess={handleSuccess} />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Conseils
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold">Numéro de Chambre</h4>
                <p className="text-sm text-gray-600">
                  Utilisez des numéros uniques pour chaque chambre.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Prix</h4>
                <p className="text-sm text-gray-600">
                  Le prix est en Dirhams Marocains (DH) par nuit.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Équipements</h4>
                <p className="text-sm text-gray-600">
                  Sélectionnez tous les équipements disponibles dans la chambre.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chambres totales</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disponibles</span>
                  <span className="font-semibold text-green-600">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupées</span>
                  <span className="font-semibold text-red-600">6</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}