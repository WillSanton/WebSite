
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ExportZipButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      
      // Fazer a requisição para a API
      const response = await fetch('/api/export-zip', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      // Obter o blob da resposta
      const blob = await response.blob();
      
      // Criar URL para o blob
      const url = window.URL.createObjectURL(blob);
      
      // Criar link para download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Obter nome do arquivo do cabeçalho ou usar um padrão
      const contentDisposition = response.headers.get('content-disposition');
      const fileName = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '') 
        : 'third-way-export.zip';
      
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Limpar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting ZIP:', error);
      alert('Erro ao exportar dados. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleExport} 
            disabled={isLoading}
          >
            <Download className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
            <span className="sr-only">Exportar ZIP</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Exportar conteúdo como ZIP</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
