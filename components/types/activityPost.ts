export interface ActivityPost {
  id: string;
  timestamp: string;
  likedBy: any[];
  content: string; // ✅ use 'content' instead of 'text'
  userId: string; // ✅ track the user who created the post
  likes: number;
  author: {
    name: string;
    role: 'farmer' | 'exporter' | 'organization';
  };
}
