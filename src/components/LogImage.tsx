export function LogImage({
  images,
  imageUrl,
}: {
  images: string[];
  imageUrl: string;
}) {
  const imageEqualCount = images.filter((url) => url === imageUrl).length;
  return (
    <div>
      <p>
        Count: {images.length} equal: {imageEqualCount} url: {imageUrl}
      </p>
    </div>
  );
}
