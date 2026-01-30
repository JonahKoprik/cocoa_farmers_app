import { useCallback, useEffect, useState } from 'react';

export type LocalNewsArticle = {
  id: string;
  title: string;
  summary: string;
  region: string;
  source: string;
  url: string;
  published_at: string;
};

export const useLocalNews = () => {
  const [articles, setArticles] = useState<LocalNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocalNews = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(
        'https://tuxlvyfredtuknhsqdtj.supabase.co/rest/v1/local_news?select=id,title,summary,region,source,url,published_at&order=published_at.desc',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        }
      );

      const data = await res.json();

      // 🔍 Debug logs
      console.log('📦 Raw response status:', res.status);
      console.log('📦 Raw response statusText:', res.statusText);
      console.log('📦 Parsed data:', data);

      if (res.ok && Array.isArray(data)) {
        setArticles(data);
        setError(null);
      } else {
        console.warn('⚠️ Unexpected response format:', data);
        setError('Unexpected response format');
        setArticles([]);
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch local_news:', err.message);
      setError(err.message ?? 'Unknown error');
      setArticles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLocalNews();
  }, [fetchLocalNews]);

  return { articles, loading, error, refreshing, refetch: fetchLocalNews };
};
