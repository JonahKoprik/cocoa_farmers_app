export type ActivityPost = {
  id: string;
  userId: string;
  timestamp: string;
  content: string;
  author: {
    name: string;
    role: 'farmer' | 'exporter' | 'organization' | 'warehouse'| 'fermentaryOwner';
  };
};
