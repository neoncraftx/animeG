import { useEffect, useState } from "react";
import { ButtonSpinner } from "../components/Button";
import { GrAddCircle } from "react-icons/gr";
import { ImagePreview,type ImageData} from "../components/Imagepreview";
import axios from "axios";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { MenuAmburger } from "../components/menu";
import { useLocalStorage } from "usehooks-ts";

type imageStats = {
  success: number;
  failed: number;
  time: Date | undefined;
  lastImage: string | undefined;
  status: boolean | undefined;
  total: number;
  images: [
    {
      url: string;
      count: number;
      date?: Date;
    }
  ];
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

  useDocumentTitle("Accueil")

  const [success, setSuccess] = useState<boolean | undefined>(undefined)
  const [startDate,setStartDate] = useState<Date>(new Date())
  const [_, setValue, _] = useLocalStorage<imageStats>("imageGPData", {
    success: 0,
    failed: 0,
    total: 0,
    lastImage: undefined,
    status: undefined,
    date: new Date(),
    time: undefined,
    images: [] as { url: string; count: number; date: Date }[]
  });
  
  // useEffect(() => {
  //   removeValue()
  // },[])
  useEffect(() => {
    const addImageUrl = () => {
      setValue((v) => {
        const existingImage = v?.images?.find((img) => img.url === imageUrl);
        if (existingImage) {
          existingImage.count += 1;
        } else {
          v.images.push({ url: imageUrl, count: 1,date: new Date() });
        }
        return { ...v};
      });
    };
    const addSuccess = () =>
      addImageUrl()
      setValue((v) => {
        return {
          ...v,
          success: v.success + 1,
        };
      });
    const addFailure = () =>
      setValue((v) => {
        return {
          ...v,
          failed: v.failed + 1,
        };
      });
    const addTotal = () =>
      setValue((v) => {
        return {
          ...v,
          total: v.total + 1,
          date: new Date(),
          status: success,
          time: new Date() - startDate
        };
      });
    const setLastImage = () =>
      setValue((v) => {
        return {
          ...v,
          lastImage: imageUrl,
        };
      });

    if (success !== undefined){
      if (success) {
          console.log("REussite")
        addSuccess();
      } else {
          console.log("ECHEC")
        addFailure();
      }
      addTotal();
      setLastImage();
    }
  }, [success,imageUrl]);
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
            setStartDate(new Date())
            setLoading(true);
            try {
              const { imageUrl, data } = await generateRandomWaifu();
              setImageUrl(imageUrl);
              setDataImage(data);
              setVariant("success");
              setLabel("Généré !");
              setGLabel("Génération terminée !");
              setSuccess(true)
            } catch (error) {
              setSuccess(false)
              console.error("Error generating waifu:", error);
              setVariant("danger");
              setGLabel("Erreur de génération");
            } finally {
              setTimeout(() => {
                setLoading(false);
                setVariant("primary");
                setGLabel("Génération");
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

  for (const key in params) {
    if (Array.isArray(params[key])) {
      params[key].forEach((value) => {
        queryParams.append(key, value);
      });
    } else {
      queryParams.set(key, params[key]);
    }
  }
  const requestUrl = `${apiUrl}?${queryParams.toString()}`;
  console.log("Request URL:", requestUrl);

  const response = await axios.get(requestUrl);
  if (response.status <= 201 ) {
    const data = await response.data;
    // Process the response data as needed
    const imageData: ImageData = data.images[0];
    return { imageUrl: imageData.url, data: imageData };
  } else {
    throw new Error("Request failed with status code: " + response.status);
  }
}
