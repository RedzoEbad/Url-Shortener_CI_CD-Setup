export interface Url {
  _id?: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUrlData {
  originalUrl: string;
  customCode?: string;
}

export interface UrlStats {
  totalUrls: number;
  totalClicks: number;
  recentUrls: Url[];
}
