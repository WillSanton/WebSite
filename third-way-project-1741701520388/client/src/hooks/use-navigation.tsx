import { useCallback } from 'react';
import { useLocation } from 'wouter';

export function useNavigation() {
  const [, setLocation] = useLocation();

  const navigate = useCallback((path: string) => {
    try {
      if (path.startsWith('http')) {
        window.location.href = path;
      } else {
        setLocation(path);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback para navegação tradicional se o hook falhar
      window.location.href = path;
    }
  }, [setLocation]);

  return navigate;
}