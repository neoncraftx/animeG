import { useEffect, useState } from "react";
import axios from "axios";
import { ImageUrl } from "./ImageUrl";
import { LogImage } from "./LogImage";

export interface ImageData {
  url: string;
  width?: number;
  height?: number;
  tags?: string[];
  author?: { name: string; url?: string };
  extension?: string;
  bytes?: number;
  source?: string;
}

type Props = {
  data: ImageData | undefined;
  imageUrl: string;
};
type imageStats = {
  success: number;
  failed: number;
  time: Date;
  lastImage: string;
  status: boolean;
  total: number;
  images: [
    {
      url: string;
      count: number;
    }
  ];
};
export function ImagePreview({
  imageUrl,
  data,
}: {
  imageUrl: string;
  data: ImageData | undefined;
}) {
  const [images, setImages] = useState<Props[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container">
      <LogImage
        images={images.map((img) => img.imageUrl)}
        imageUrl={imageUrl}
      />

      <h2>Generated Waifu</h2>
      <div className="d-flex justify-content-center flex-wrap">
        <LoadImagePreview
          imageUrl={imageUrl}
          loading={loading}
          onLoading={setLoading}
          onSetImages={setImages}
          data={data}
        />

        {!loading &&
          [...images].reverse().map((img, index) => (
            <div
              key={index}
              className="m-2"
              style={{
                width: "30%",
                animation: "fadeIn 0.8s forwards",
                animationDelay: `${index * 0.1}s`, // 🪄 Décalage progressif
                opacity: 0,
              }}
            >
              <ImageUrl imageUrl={img.imageUrl} data={img.data} />
            </div>
          ))}
      </div>
    </div>
  );
}

export function LoadImagePreview({
  imageUrl,
  loading,
  onLoading,
  onSetImages,
  data,
}: {
  imageUrl: string;
  loading: boolean;
  onLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSetImages: React.Dispatch<React.SetStateAction<Props[]>>;
  data: ImageData | undefined;
}) {
  const [progress, setProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // ✅ Télécharger une seule fois par URL
  useEffect(() => {
    if (!imageUrl) return;

    let cancelToken = axios.CancelToken.source();

    const handleDownload = async () => {
      onLoading(true);
      setProgress(0);
      try {
        const response = await axios.get(imageUrl, {
          responseType: "blob",
          cancelToken: cancelToken.token,
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
        });

        const blobUrl = URL.createObjectURL(response.data);
        setImageSrc(blobUrl);

        onSetImages((prev) => {
          if (prev.some((img) => img.imageUrl === imageUrl)) return prev;
          return [...prev, { imageUrl, data }];
        });
      } catch (error: any) {
        if (!axios.isCancel(error)) {
          console.error("Error downloading image:", error);
        }
      } finally {
        onLoading(false);
      }
    };

    handleDownload();

    // 🧹 Nettoyage pour éviter les leaks si on change d'image rapidement
    return () => {
      cancelToken.cancel("Image download canceled");
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageUrl]); // ✅ Ne dépend que de imageUrl

  return (
    <>
      {loading && (
        <div
          className="progress my-3"
          role="progressbar"
          aria-label="Download progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: "80%", height: "10px" }}
        >
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {imageSrc && !loading && (
        <div
          className="m-2"
          style={{
            width: "30%",
            opacity: 0,
            transform: "scale(0.95)",
            transition: "opacity 0.6s ease, transform 0.4s ease",
            animation: "fadeIn 0.8s forwards",
          }}
        >
          <img
            src={imageSrc}
            alt="Downloaded preview"
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              objectFit: "cover",
            }}
          />
        </div>
      )}
    </>
  );
}

export function ImageCreatedList({ images, label = undefined }: { images: string[], label?: string | undefined }) {
  return (
    <div className="row" style={{width: "100%"}}>
      {images.map((image, index) => (
        <div className="col-md-4 my-3" key={index}>
          <img
            src={image}
            alt={`Generated image ${index}`}
            className="img-fluid rounded"
            style={{ aspectRatio: 1, width: "100%" }}
          />
          {label && <p className="text-center">{label}</p>}
        </div>
      ))}
    </div>
  );
}
