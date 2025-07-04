import { Capacitor } from "@capacitor/core";
import { Clipboard } from "@capacitor/clipboard";

export const copyToClipboard = async (text: string) => {
  try {
    if (Capacitor.isNativePlatform()) {
      await Clipboard.write({ string: text });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {      
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  } catch (error) {
    console.error("Failed to copy text:", error);
  }
};
