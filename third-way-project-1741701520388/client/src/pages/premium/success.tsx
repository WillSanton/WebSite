import { useEffect } from "react";
import { useNavigation } from "@/hooks/use-navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PaymentStatus {
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'requires_confirmation' | 'canceled';
}

export default function PremiumSuccessPage() {
  const navigate = useNavigation();
  const searchParams = new URLSearchParams(window.location.search);
  const paymentIntentId = searchParams.get("payment_intent");

  const { data: paymentStatus, isLoading } = useQuery<PaymentStatus>({
    queryKey: [`/api/payment-status/${paymentIntentId}`],
    enabled: !!paymentIntentId,
  });

  useEffect(() => {
    if (paymentStatus?.status === "succeeded") {
      // Atualizar o cache do assistente após 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [paymentStatus, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="container py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>
            {paymentStatus?.status === "succeeded" 
              ? "Pagamento Confirmado!" 
              : "Processando Pagamento..."}
          </CardTitle>
          <CardDescription>
            {paymentStatus?.status === "succeeded"
              ? "Seu assistente místico está pronto para acompanhá-la."
              : "Aguarde enquanto confirmamos seu pagamento."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => navigate("/")} variant="ghost">
            Voltar para a página inicial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}