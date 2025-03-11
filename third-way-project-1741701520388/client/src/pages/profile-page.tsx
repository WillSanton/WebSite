import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WitchAssistant, WitchCustomization, HeadAccessory, HandAccessory, BodyAccessory, FamiliarType } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DownloadProjectButton } from "@/components/DownloadProjectButton";

const FAMILIAR_NAMES: Record<FamiliarType, string> = {
  bat: "Morcego",
  toad: "Sapo",
  moth: "Mariposa",
  beetle: "Besouro",
  cat: "Gato",
  dog: "Cachorro",
  goat: "Bode",
};

const HEAD_ACCESSORY_NAMES: Record<HeadAccessory, string> = {
  witch_hat: "Chapéu de Bruxa",
  wizard_hat: "Chapéu de Mago",
  round_glasses: "Óculos Redondos",
};

const HAND_ACCESSORY_NAMES: Record<HandAccessory, string> = {
  magic_wand: "Varinha Mágica",
  witch_broom: "Vassoura de Bruxa",
  white_candle: "Vela Branca",
  spellbook: "Livro de Feitiços",
  dagger: "Adaga",
};

const BODY_ACCESSORY_NAMES: Record<BodyAccessory, string> = {
  magic_cloak: "Capa Mágica",
  herb_pouch: "Bolsinha de Ervas",
  amulet_necklace: "Colar Amuleto",
};

const DEFAULT_CUSTOMIZATION: WitchCustomization = {
  appearance: {
    race: 'cat',
    accessories: {
      head: null,
      hand: null,
      body: [],
    },
  },
};

// Schema para alteração de senha
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customization, setCustomization] = useState<WitchCustomization | null>(null);

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { data: assistant, isLoading } = useQuery<WitchAssistant>({
    queryKey: ["/api/witch-assistant"],
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<WitchAssistant>) => {
      const res = await apiRequest("PATCH", "/api/witch-assistant", updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/witch-assistant"] });
      toast({
        title: "Sucesso",
        description: "Seu assistente foi personalizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordForm) => {
      const res = await apiRequest("POST", "/api/change-password", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Sua senha foi alterada com sucesso!",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: "Não foi possível alterar a senha. Verifique se a senha atual está correta.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!assistant) {
    return <div>Assistente não encontrado</div>;
  }

  const currentCustomization = {
    ...DEFAULT_CUSTOMIZATION,
    ...(assistant.customization as WitchCustomization),
  };

  const handleFamiliarChange = (race: FamiliarType) => {
    setCustomization((prev) => {
      const newCustomization = {
        ...(prev || currentCustomization),
        appearance: {
          ...(prev?.appearance || currentCustomization.appearance),
          race,
        },
      };
      return newCustomization;
    });
  };

  const handleHeadAccessoryChange = (accessory: HeadAccessory | null) => {
    setCustomization((prev) => {
      const prevCustomization = prev || currentCustomization;
      return {
        ...prevCustomization,
        appearance: {
          ...prevCustomization.appearance,
          accessories: {
            ...prevCustomization.appearance.accessories,
            head: accessory,
          },
        },
      };
    });
  };

  const handleHandAccessoryChange = (accessory: HandAccessory | null) => {
    setCustomization((prev) => {
      const prevCustomization = prev || currentCustomization;
      return {
        ...prevCustomization,
        appearance: {
          ...prevCustomization.appearance,
          accessories: {
            ...prevCustomization.appearance.accessories,
            hand: accessory,
          },
        },
      };
    });
  };

  const handleBodyAccessoryToggle = (accessory: BodyAccessory) => {
    setCustomization((prev) => {
      const prevCustomization = prev || currentCustomization;
      const currentAccessories = prevCustomization.appearance.accessories.body || [];

      let newBodyAccessories;
      if (currentAccessories.includes(accessory)) {
        newBodyAccessories = currentAccessories.filter(a => a !== accessory);
      } else {
        newBodyAccessories = [...currentAccessories, accessory];
      }

      return {
        ...prevCustomization,
        appearance: {
          ...prevCustomization.appearance,
          accessories: {
            ...prevCustomization.appearance.accessories,
            body: newBodyAccessories,
          },
        },
      };
    });
  };

  const handleSave = () => {
    if (customization) {
      updateMutation.mutate({ customization });
    }
  };

  const activeCustomization = customization || currentCustomization;

  const onSubmitPassword = (data: ChangePasswordForm) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-serif">Seu Perfil Místico</h1>
        <DownloadProjectButton />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Nome de Usuário</Label>
                  <p className="text-lg">{user?.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seu Familiar Místico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Escolha seu Familiar</Label>
                  <Select
                    value={activeCustomization.appearance.race}
                    onValueChange={(value: FamiliarType) => handleFamiliarChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha seu familiar" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FAMILIAR_NAMES).map(([value, label]) => (
                        <SelectItem key={value} value={value as FamiliarType}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Acessório da Cabeça (Escolha um)</Label>
                  <RadioGroup
                    value={activeCustomization.appearance.accessories.head || ''}
                    onValueChange={(value) =>
                      handleHeadAccessoryChange(value ? (value as HeadAccessory) : null)
                    }
                    className="grid grid-cols-2 gap-4"
                  >
                    {Object.entries(HEAD_ACCESSORY_NAMES).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`head-${value}`} />
                        <label
                          htmlFor={`head-${value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Acessório da Mão (Escolha um)</Label>
                  <RadioGroup
                    value={activeCustomization.appearance.accessories.hand || ''}
                    onValueChange={(value) =>
                      handleHandAccessoryChange(value ? (value as HandAccessory) : null)
                    }
                    className="grid grid-cols-2 gap-4"
                  >
                    {Object.entries(HAND_ACCESSORY_NAMES).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`hand-${value}`} />
                        <label
                          htmlFor={`hand-${value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Acessórios do Corpo (Múltipla escolha)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(BODY_ACCESSORY_NAMES).map(([value, label]) => (
                      <motion.div
                        key={value}
                        className="flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-purple-900/20 cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBodyAccessoryToggle(value as BodyAccessory)}
                      >
                        <div
                          className={`w-4 h-4 rounded border ${
                            activeCustomization.appearance.accessories.body?.includes(value as BodyAccessory)
                              ? 'bg-purple-600 border-purple-600'
                              : 'border-input'
                          }`}
                        />
                        <label className="text-sm font-medium leading-none select-none">
                          {label}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>
              Mantenha sua conta segura alterando sua senha periodicamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitPassword)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha Atual</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? "Alterando..." : "Alterar Senha"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}