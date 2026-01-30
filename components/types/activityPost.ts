export type ActivityPost = {
  id: string;
  userId: string;
  timestamp: string;
  content: string;
  likes: number;
  likedBy: string[];
  author: {
    name: string;
    role:
      | "farmer"
      | "exporter"
      | "organization"
      | "warehouse"
      | "fermentaryOwner";
  };
};
