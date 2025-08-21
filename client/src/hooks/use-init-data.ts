import { useEffect } from 'react';
import { stockApi } from '@/lib/api';

export function useInitializeData() {
  useEffect(() => {
    // Initialize sample data on first load
    const initData = async () => {
      try {
        await stockApi.initSampleData();
      } catch (error) {
        console.error('Failed to initialize sample data:', error);
      }
    };

    initData();
  }, []);
}