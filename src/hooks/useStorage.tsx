import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function OnStats({
  success,
  image = undefined,
}: {
  success: boolean;
  image: string | undefined;
}) {
  const [value, setValue, removeValue] = useLocalStorage("imageGPData", {
    success: 0,
    failed: 0,
    total: 0,
    lastImage: undefined,
  });
  useEffect(() => {
    const addSuccess = () =>
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
        };
      });
    const setLastImage = () =>
      setValue((v) => {
        return {
          ...v,
          lastImage: image,
        };
      });
    if (success) {
        console.log("REussite")
      addSuccess();
    } else {
        console.log("ECHEC")
      addFailure();
    }
    addTotal();
    setLastImage();
  }, [success]);

  return value
}
