export interface ActivityPost {
  id: string;
  timestamp: string;
  likedBy: any[];
  content: string; // ✅ use 'content' instead of 'text'
  likes: number;
  author: {
    name: string;
    role: 'farmer' | 'exporter' | 'organization';
  };
}
