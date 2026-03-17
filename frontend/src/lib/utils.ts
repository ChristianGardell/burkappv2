import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeBlur() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

export function phoneInputValidations(phone_number: string): boolean {
  const isNumeric = /^\d+$/.test(phone_number);
  const isCorrectLength = phone_number.length === 10;
  return isNumeric && isCorrectLength;
}
export function scrollInputIntoView(
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) {
  // Delay slightly to allow the virtual keyboard to start opening
  setTimeout(() => {
    e.target.scrollIntoView({
      behavior: "smooth",
      block: "center", // Keeps it in the middle of the visible area
    });
  }, 200);
}
