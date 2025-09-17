export interface DashboardItem {
  _id: string;
  contentType: string;
  title: string;
  isPublic: boolean;
  platform: string;
  url: string;
  description?: string;   
  imageUrl?: string;      
  shareId: string;
  createdAt: string;      
  updatedAt: string;      
}
