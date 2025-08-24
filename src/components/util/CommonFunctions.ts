import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { removeUserRole } from "../../services/axiosClient";
import { logout } from "../../services/services";
import * as XLSX from "xlsx";
// export async function getCountryCode() {
//   try {
//     const response = await fetch("https://ipapi.co/json/");
//     const data = await response.json();

//     const countryCode3 = data.country_code_iso3;
//     return countryCode3;
//   } catch (error) {
//     console.error("Error getting 3-letter country code from IP:", error);
//     return null;
//   }
// }

export async function getDeviceIp() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error getting 3-letter country code from IP:", error);
    return null;
  }
}

export function formatDate(userDate: any) {
  return new Date(userDate)
    ?.toJSON()
    ?.slice(0, 10)
    ?.split("-")
    ?.reverse()
    ?.join("-");
}

export const formatDateJob = (dateString?: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function calculateAge(birthday: any) {
  if (birthday !== "") {
    var ageDifMs = Date.now() - new Date(birthday).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  } else {
    return "0";
  }
}

export function toCamelCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function dateTimeDifference(
  startDateTime: string | number | Date,
  endDateTime: string | number | Date
) {
  // Parse the date-time strings
  const start = new Date(startDateTime).getTime();
  const end = new Date(endDateTime).getTime();

  // Calculate the difference in milliseconds
  const differenceInMillis = end - start;

  // Convert milliseconds to total minutes
  const differenceInMinutes = Math.floor(differenceInMillis / 60000);

  // Calculate hours and minutes
  const hours = Math.floor(differenceInMinutes / 60);
  const minutes = differenceInMinutes % 60;

  return `${hours}hr ${minutes}mns`;
}

export function dateDifference(startDate: any, endDate: any) {
  const diffTime = new Date(endDate).getTime() - new Date(startDate).getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) {
    return `${diffDays} Days to go`;
  } else {
    return `${Math.abs(diffDays)} Days ago`;
  }
}

export function dateDifferenceInMinutes(endDate: any) {
  const diffTime = new Date(endDate).getTime() - new Date().getTime();
  const diffMin = Math.abs(Math.ceil(diffTime / (1000 * 60)));
  const diffHours = Math.abs(Math.ceil(diffTime / (1000 * 60 * 60)));
  const diffDays = Math.abs(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  if (diffMin > 60 && diffHours > 24) {
    return `${Math.abs(diffDays)} days ago`;
  } else if (diffMin > 60 && diffHours < 24) {
    return `${Math.abs(diffHours)} hour ago`;
  } else {
    return `${Math.abs(diffMin)} mins ago`;
  }
}

export function timeAgo(dateString: string): string {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - createdDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
}

export const normalizeHTMLToText = (html: string): string => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const parseNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent || "").trim();
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const element = node as HTMLElement;
    let result = "";

    const tag = element.tagName.toLowerCase();

    if (["h3", "h4", "h5", "h6"].includes(tag)) {
      result += element.textContent?.trim() + ":\n";
    } else if (["h1", "h2"].includes(tag)) {
      result += element.textContent?.trim() + "\n\n";
    } else if (tag === "p" || tag === "div") {
      result +=
        Array.from(element.childNodes).map(parseNode).join("").trim() + "\n\n";
    } else if (tag === "ul" || tag === "ol") {
      result +=
        Array.from(element.children)
          .map((li) =>
            li.tagName.toLowerCase() === "li"
              ? `• ${li.textContent?.trim()}\n`
              : ""
          )
          .join("") + "\n";
    } else if (tag === "li") {
      result += `• ${element.textContent?.trim()}\n`;
    } else {
      result += Array.from(element.childNodes).map(parseNode).join("");
    }

    return result;
  };

  return Array.from(tempDiv.childNodes)
    .map(parseNode)
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export function handleNavClick(
  history: any,
  setButtonColors: any,
  Path: string
) {
  if (Path === "/login") {
    logout("login");
  } else {
    if (Path !== "/notification" && Path !== "/account") {
      removeUserRole();
    }
    location.href = Path;
  }

  const newColors = {};

  setButtonColors(newColors);

  setButtonColors((newColors: any) => ({
    ...newColors,
    [Path]: "#0a5c6b",
  }));
}

export function getValueFromAttributes(
  key: string,
  value: string,
  valueProp: string,
  array: any[]
) {
  return array.filter((o: any) => o[key] === value).length > 0
    ? array.filter((o: any) => o[key] === value)[0][valueProp] || ""
    : "";
}

export function getRandomNumber() {
  const len = 12;
  const arr = "1234567890";
  let ans = "";
  for (let i = len; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
}

export function getRandomSixDigitNumber() {
  const len = 6;
  const arr = "1234567890";
  let ans = "";
  for (let i = len; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
}

export function getImagefromBuffer(image: any) {
  if (image) {
    return image;
  } else {
    return "/assets/pfp bw.png";
  }
}

export function getStoreImagefromBuffer(image: any) {
  if (image) {
    return image;
  } else {
    return "/assets/store.png";
  }
}
export function getFoodImagefromBuffer(image: any) {
  if (image) {
    return image;
  } else {
    return "/assets/food.png";
  }
}

const proceedListUserModuleRole = (
  option: any,
  checked: boolean,
  isDefault: boolean,
  arr: any[],
  userId: number
) => {
  if (arr.filter((o) => o?.moduleRoleId === option.moduleRoleId).length > 0) {
    return [
      ...arr.filter((o) => o?.moduleRoleId !== option.moduleRoleId),
      {
        moduleRoleId: option.moduleRoleId,
        userId: userId,
        isDefault: isDefault,
        displaySequence: arr.length,
        userModuleRoleStatus: checked ? "ACTIVE" : "PASSIVE",
      },
    ];
  } else {
    return [
      ...arr,
      {
        moduleRoleId: option.moduleRoleId,
        userId: userId,
        isDefault: isDefault,
        displaySequence: arr.length,
        userModuleRoleStatus: checked ? "ACTIVE" : "PASSIVE",
      },
    ];
  }
};

export const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 16,
  height: 16,
  boxShadow:
    "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: "#f5f8fa",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: "#ebf1f5",
    ...theme.applyStyles("dark", {
      backgroundColor: "#30404d",
    }),
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "rgba(206,217,224,.5)",
    ...theme.applyStyles("dark", {
      background: "rgba(57,75,89,.5)",
    }),
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 0 1px rgb(16 22 26 / 40%)",
    backgroundColor: "#394b59",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))",
  }),
}));

export const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#0a5c6b",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
});

interface StyledBadgeProps extends BadgeProps {
  isAvailable: boolean;
}
export const StyledBadge = styled(Badge)<StyledBadgeProps>(
  ({ theme, isAvailable }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isAvailable ? "#44b700" : "#9e9e9e",
      color: isAvailable ? "#44b700" : "#9e9e9e",

      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: -0.5,
        left: -0.2,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  })
);

export const getContrastColor = (hex) => {
  if (!hex) return "white";

  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "black" : "white";
};

export const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 600,
  width: "100%",
  height: "fit-content",
  maxHeight: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: 1,
  overflowY: "auto",
};

export const toRoman = (num: number): string => {
  const romanNumerals: { [key: number]: string } = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
  };
  return romanNumerals[num] || num.toString();
};

export const commonFormTextFieldSx = {
  background: "white",
  color: "black",
  borderRadius: "12px",
  border: "0px",

  "& .MuiOutlinedInput-root": {
    background: "white",
    color: "black",
    border: "0px",
    paddingTop: "0px",
    paddingBottom: "0px",
    borderRadius: "12px",
    fontFamily: "Montserrat-regular",

    "& fieldset": {
      border: "none",
      borderRadius: "12px",
    },
    "&.Mui-focused fieldset": {
      border: "0px",
      borderRadius: "12px",
    },
  },

  "& .MuiInputBase-input": {
    // borderRadius: "999px",
    paddingTop: "14px !important",
    paddingBottom: "8px !important",
  },

  "& .MuiSelect-outlined": {
    border: "none",
    borderRadius: "44px",
    backgroundColor: "white",
    fontFamily: "Montserrat-regular",

  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
    borderRadius: "12px",
  },

  "& .MuiFormLabel-root-MuiInputLabel-root": {
    fontSize: "11px !important",
    color: "#7f7f7f",
    transform: "translate(14px, 14px)",
    textTransform: "Uppercase",
    fontFamily: "Montserrat-regular",
  },

  "& .MuiInputLabel-root": {
    fontSize: "11px !important",
    color: "#7f7f7f",
    transform: "translate(14px, 14px)",
    textTransform: "Uppercase",
    fontFamily: "Montserrat-regular",
  },
  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink":
    {
      // color: "#000",
      transform: "translate(14px, 2px)",
    },
};

export function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { textTransform } from "html2canvas/dist/types/css/property-descriptors/text-transform";
import { fontFamily } from "html2canvas/dist/types/css/property-descriptors/font-family";

type InterviewQuestionAnswer = {
  categoryName: string;
  userAnswer?: string;
  isCorrect?: boolean;
};

type Applicant = {
  fullName?: string;
  interviewQuestionAnswer?: InterviewQuestionAnswer[];
};

export const generateInterviewReportExcel = async (
  input: Applicant | Applicant[]
) => {
  const applicants = Array.isArray(input) ? input : [input];
  if (!applicants.length) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Interview Report");

  const categorySet = new Set<string>();
  applicants.forEach((applicant) => {
    (applicant.interviewQuestionAnswer || []).forEach((q) => {
      if (q?.categoryName) categorySet.add(q.categoryName);
    });
  });
  const categories = Array.from(categorySet);

  // Step 2: Header Row Setup
  const headerRow1 = ["Student Name"];
  let colIndex = 2;

  categories.forEach((category) => {
    headerRow1.push(
      "Not Answered",
      "% Not Answered",
      "Right",
      "% Right",
      "Wrong",
      "% Wrong"
    );

    worksheet.mergeCells(1, colIndex, 1, colIndex + 5);
    const cell = worksheet.getCell(1, colIndex);
    cell.value = category;
    cell.font = { bold: true, color: { argb: "FF000000" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    colIndex += 6;
  });

  worksheet.getCell("A1").value = "Category Name";
  worksheet.getCell("A1").font = { bold: true, color: { argb: "FF000000" } };
  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9E1F2" },
  };
  worksheet.getCell("A1").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("A1").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.addRow(headerRow1);

  const headerRow = worksheet.getRow(2);
  headerRow.values = headerRow1;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FF000000" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  for (const applicant of applicants) {
    const row = [applicant.fullName || "N/A"];

    for (const category of categories) {
      const questions = (applicant.interviewQuestionAnswer || []).filter(
        (q) => q.categoryName === category
      );
      const total = questions.length;
      const notAnswered = questions.filter((q) => !q.userAnswer).length;
      const right = questions.filter((q) => q.isCorrect).length;
      const wrong = total - notAnswered - right;

      const percent = (val: number) =>
        total === 0 ? "0%" : `${Math.round((val / total) * 100)}%`;

      row.push(
        `${notAnswered}`,
        percent(notAnswered),
        `${right}`,
        percent(right),
        `${wrong}`,
        percent(wrong)
      );
    }

    worksheet.addRow(row);
  }

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber <= 2) return;
    row.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 12, color: { argb: "FF000000" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  worksheet.columns.forEach((col) => (col.width = 18));

  const studentName =
    applicants.length === 1
      ? applicants[0].fullName || "Student"
      : `All_Applicants`;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `Interview_Report_${studentName}.xlsx`);
};

export const speakWithElevenLabs = async (text: string) => {
  const apiKey = "sk_354e08957cfc41aa3c29f78b15c8995ffb7a0419245afd0b";
  const voiceId = "2bNrEsM0omyhLiEyOwqY";

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) throw new Error("TTS request failed");

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    return new Promise<void>((resolve) => {
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play();
    });
  } catch (err) {
    console.error("ElevenLabs TTS Error:", err);
  }
};

export const readExcelFileAsJson = async (file: File) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });

  const result = workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    return {
      sheetName,
      questions: json,
    };
  });

  return result;
};

export const safeParseAiJson = (
  raw: string
): {
  recommendations: string;
  fitmentPercentage: string;
  summary: string;
  detail: string;
} | null => {
  if (!raw) return null;

  let cleaned = raw
    .replace(/^```(json|html)?/i, "")
    .replace(/```$/i, "")
    .replace(/^json\s*/i, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return null;
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    try {
      let fixed = jsonMatch[0]
        .replace(/\r?\n/g, "\\n")
        .replace(/\\(?!n|")/g, "\\\\")
        .replace(/“|”/g, '"')
        .replace(/([^\]\\])"/g, '$1\\"');

      return JSON.parse(fixed);
    } catch (secondErr) {
      console.log("Raw text that failed:", jsonMatch[0]);
      return null;
    }
  }
};

export function extractCleanFileName(url: string): string {
  const fileName = url.split("/").pop() || "";
  const decoded = decodeURIComponent(fileName);
  const hyphenIndex = decoded.indexOf("-");
  return hyphenIndex !== -1 ? decoded.substring(hyphenIndex + 1) : decoded;
}

export function countTotalQuestions(data: any): number {
  if (!data || !Array.isArray(data.categories)) return 0;

  return data.categories.reduce((total: number, category: any) => {
    if (Array.isArray(category.questions)) {
      return total + category.questions.length;
    }
    return total;
  }, 0);
}

export const getFormattedDateKey = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today at ${time}`;
  if (isYesterday) return `Yesterday at ${time}`;

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // "May"
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month} at ${time}`;
};

export const getRemark = (score: number) => {
  if (score >= 85)
    return {
      remark: "Excellent",
      comparison: "You scored higher than 90% of the people.",
      bgcolor: "linear-gradient(0deg, #4CAF50, #81C784)",
    };
  if (score >= 70)
    return {
      remark: "Great",
      comparison: "You scored higher than 65% of the people.",
      bgcolor: "linear-gradient(0deg, #8BC34A, #AED581)",
    };
  if (score >= 50)
    return {
      remark: "Good",
      comparison: "You scored higher than 40% of the people.",
      bgcolor: "linear-gradient(0deg, #FFC107, #FFD54F)",
    };
  if (score >= 35)
    return {
      remark: "Fair",
      comparison: "You scored higher than 25% of the people.",
      bgcolor: "linear-gradient(0deg, #FF9800, #FFB74D)",
    };
  return {
    remark: "Needs Improvement",
    comparison: "Keep practicing to improve your score.",
    bgcolor: "linear-gradient(0deg, #F44336,rgb(186, 39, 39))",
  };
};

export function formatDateWithSuffix(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month}`;
}

export const CustomToggleButtonGroup1 = styled(ToggleButtonGroup)(
  ({ theme }) => ({
    backgroundColor: "#f0f2f7",
    borderRadius: "999px",
    padding: "8px",
  })
);

export const CustomToggleButton1 = styled(ToggleButton)(({ theme }) => ({
  border: "none",
  borderRadius: "999px !important",
  padding: "6px 16px",
  fontWeight: 600,
  fontSize: "18px",
  textTransform: "none",
  color: "grey",

  "&.Mui-selected": {
    background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
    color: "#fff",
    boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
  },
}));

export const getTextColor = (bgcolor: string) => {
  if (bgcolor.includes("#4CAF50") || bgcolor.includes("#81C784"))
    return "white"; // Excellent - green
  if (bgcolor.includes("#8BC34A") || bgcolor.includes("#AED581"))
    return "black"; // Great - lime
  if (bgcolor.includes("#FFC107") || bgcolor.includes("#FFD54F"))
    return "black"; // Good - yellow
  if (bgcolor.includes("#FF9800") || bgcolor.includes("#FFB74D"))
    return "white"; // Fair - orange
  if (bgcolor.includes("#F44336") || bgcolor.includes("186, 39, 39"))
    return "white"; // Needs Improvement - red

  return "black"; // Default fallback
};
