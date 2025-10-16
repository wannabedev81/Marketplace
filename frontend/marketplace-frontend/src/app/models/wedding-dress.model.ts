export interface WeddingDressImage {
  size: string;
  format: string;
  path: string;
}

export interface WeddingDress {
  title: string;
  size: string;
  price: number;
  condition: string;
  images?: { size: string; format: string; path: string }[];
  imageUrl?: string;
  style?: string;
  location?: string;

}