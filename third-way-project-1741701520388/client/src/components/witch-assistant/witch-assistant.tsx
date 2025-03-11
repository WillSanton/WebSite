import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { WitchAvatar } from "./witch-avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WitchCustomization, WitchAssistant as WitchAssistantType } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export function WitchAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { data: assistant, isLoading } = useQuery<WitchAssistantType>({
    queryKey: ["/api/witch-assistant"],
    enabled: !!user,
  });

  if (isLoading && user) {
    return (
      <div className="fixed bottom-4 right-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Se não houver usuário, mostrar botão de login
  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="fixed bottom-4 right-4 bg-purple-900/50 hover:bg-purple-800/50"
          >
            ✨ Conhecer Assistente Místico
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conheça seu Assistente Místico</DialogTitle>
            <DialogDescription>
              Entre para ter seu próprio assistente personalizado que irá guiá-lo em sua jornada mística.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-900/20">
              <div className="flex-1">
                <h4 className="font-medium">Recursos:</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Aparência personalizável</li>
                  <li>• Escolha de familiar mágico</li>
                  <li>• Interações personalizadas</li>
                  <li>• Insights místicos</li>
                </ul>
              </div>
            </div>
            <Link href="/auth">
              <Button className="w-full" onClick={() => setIsOpen(false)}>
                Fazer Login ✨
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!assistant) {
    return null;
  }

  return (
    <WitchAvatar
      customization={assistant.customization as WitchCustomization}
      isAnimating={true}
    />
  );
}