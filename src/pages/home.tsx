import { useEffect, useState } from "react";
import { ButtonSpinner } from "../components/Button";
import { GrAddCircle } from "react-icons/gr";
import { ImagePreview, type ImageData } from "../components/Imagepreview";
import axios from "axios";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { MenuAmburger } from "../components/menu";
import { useLocalStorage } from "usehooks-ts";

type imageStats = {
  success: number;
  failed: number;
  // elapsed time in milliseconds
  time?: number;
  lastImage?: string;
  status?: boolean;
  total: number;
  date?: Date;
  images: { url: string; count: number; date?: Date }[];
};

const defaultV: imageStats = {
  success: 0,
  failed: 0,
  total: 0,
  lastImage: undefined,
  status: undefined,
  date: new Date(),
  time: undefined,
  images: [],
};
export function Home() {
  //Image config
  const [imageUrl, setImageUrl] = useState("");
  const [dataImage, setDataImage] = useState<ImageData | undefined>(undefined);

  // button config
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState<
    "primary" | "secondary" | "success" | "danger" | "warning"
  >("primary");
  const [label, setLabel] = useState<string>("Générer");
  const [gLabel, setGLabel] = useState<string>("Génération");

  useDocumentTitle("Accueil");

  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [, setValue] = useLocalStorage<imageStats>("imageGPData", defaultV);

  // useEffect(() => {
  //   removeValue()
  // },[])
  useEffect(() => {
    if (success === undefined) return;

    // Do a single, immutable update so localStorage receives a consistent state
    setValue((prev) => {
      const v = prev ?? defaultV;

      // clone images array (avoid mutating prev)
      const images = v.images ? [...v.images] : [];

      let successCount = v.success;
      let failedCount = v.failed;

      if (success === true) {
        successCount = (v.success ?? 0) + 1;
        const idx = images.findIndex((img) => img.url === imageUrl);
        if (idx >= 0) {
          images[idx] = { ...images[idx], count: images[idx].count + 1 };
        } else {
          images.push({ url: imageUrl, count: 1, date: new Date() });
        }
      } else {
        failedCount = (v.failed ?? 0) + 1;
      }

      const now = new Date();
      const elapsed = startDate ? now.getTime() - startDate.getTime() : undefined;

      return {
        ...v,
        success: successCount,
        failed: failedCount,
        total: (v.total ?? 0) + 1,
        date: now,
        time: elapsed,
        status: success,
        lastImage: imageUrl,
        images,
      };
    });
  }, [success, imageUrl, startDate, setValue]);
  return (
    <div>
      <h1 className="text-center m-3">Waifu Generator</h1>
      <MenuAmburger></MenuAmburger>
      <div className="text-center">
        <p className="text-center">
          Click the button below to generate a random waifu image!
        </p>
        <ButtonSpinner
          label={label}
          gLabel={gLabel}
          loading={loading}
          onClick={async () => {
            setStartDate(new Date());
            setLoading(true);
            try {
              const { imageUrl, data } = await generateRandomWaifu();
              setImageUrl(imageUrl);
              setDataImage(data);
              setVariant("success");
              setLabel("Généré !");
              setGLabel("Génération terminée !");
              setSuccess(true);
            } catch (error) {
              setSuccess(false);
              console.error("Error generating waifu:", error);
              setVariant("danger");
              setGLabel("Erreur de génération");
            } finally {
              setTimeout(() => {
                setLoading(false);
                setVariant("primary");
                setGLabel("Génération");
                setSuccess(undefined);
              }, 1000);
            }
          }}
          icon={<GrAddCircle size={20} />}
          variant={variant}
          size="md"
        />
      </div>
      {imageUrl && <ImagePreview imageUrl={imageUrl} data={dataImage} />}
    </div>
  );
}

async function generateRandomWaifu(): Promise<{
  imageUrl: string;
  data: ImageData;
}> {
  const apiUrl = "https://api.waifu.im/search";
  const params = {
    included_tags: ["raiden-shogun"],
    height: ">=1000",
  };

  const queryParams = new URLSearchParams();

  (Object.keys(params) as Array<keyof typeof params>).forEach((key) => {
    const val = params[key];
    if (Array.isArray(val)) {
      val.forEach((v) => queryParams.append(key, String(v)));
    } else {
      queryParams.set(key, String(val));
    }
  });
  const requestUrl = `${apiUrl}?${queryParams.toString()}`;
  console.log("Request URL:", requestUrl);

  const response = await axios.get(requestUrl);
  if (response.status <= 201) {
    const data = await response.data;
    // Process the response data as needed
    const imageData: ImageData = data.images[0];
    return { imageUrl: imageData.url, data: imageData };
  } else {
    throw new Error("Request failed with status code: " + response.status);
  }
}
