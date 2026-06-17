import google from "@/assets/icons/google.png";

export const icons = {
    google,
} as const;

export type IconKey = keyof typeof icons;