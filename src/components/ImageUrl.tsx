export interface ImageData {
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

export function ImageUrl({ imageUrl , data = undefined }: { imageUrl: string , data: ImageData | undefined }) {
  return (
    <div>
      <img src={imageUrl} alt="Generated Waifu" style={{ maxWidth: '100%', borderRadius: '10px' }} />
      {data && (
        <div>
          <p className=""><strong>Image Details:</strong> Width: {data?.width} x Height: {data?.height}</p>
        </div>
      )}
    </div>
  );
}