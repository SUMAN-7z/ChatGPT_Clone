import { toast } from "react-toastify";

export function errorHandler(message) {
  toast.error(message, {
    theme: "dark",
  });
}

export function successHandler(message) {
  toast.success(message, {
    theme: "dark",
  });
}

export function warningHandler(message) {
  toast.warning(message, {
    theme: "dark",
  });
}