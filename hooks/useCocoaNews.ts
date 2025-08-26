// hooks/useCocoaNews.ts
import { useEffect, useState } from 'react'

type Article = {
  title: string
  url: string
  image: string
  source: string
  publishedAt: string
  description: string
}

export default function useCocoaNews(query = 'cocoa farming') {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('https://tuxlvyfredtuknhsqdtj.supabase.co/functions/v1/fetch-news', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ query }),
        })

        const data = await res.json()
        if (res.ok) {
          setArticles(data.articles)
        } else {
          setError(data.error || 'Failed to fetch news')
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [query])

  return { articles, loading, error }
}
