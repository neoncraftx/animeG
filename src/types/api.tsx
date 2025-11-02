export interface ImageDataApi {
    url: string;
    width?: number;
    height?: number;
    tags?: string[];
    author?: {
      name: string;
      url?: string;
    }
    extension?: string;
    bytes?: number;
    source?: string;
  
  }