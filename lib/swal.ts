import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

/**
 * Reusable Arizona Rental Guy branded SweetAlert confirmation modal.
 * Replaces native browser window.confirm() with a sleek, themed dialog.
 */
export const showConfirm = async (options: {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: SweetAlertIcon;
  confirmButtonColor?: string;
}): Promise<SweetAlertResult> => {
  return Swal.fire({
    title: options.title,
    text: options.text,
    icon: options.icon || "warning",
    showCancelButton: true,
    confirmButtonColor: options.confirmButtonColor || "#DC2626", // Brand Red
    cancelButtonColor: "#4B5563", // Gray
    confirmButtonText: options.confirmButtonText || "Yes, proceed",
    cancelButtonText: options.cancelButtonText || "Cancel",
    reverseButtons: true,
    background: "#FFFFFF",
    color: "#0F172A",
    customClass: {
      popup: "rounded-xl border-2 border-yellow-500 shadow-2xl p-5",
      title: "text-base sm:text-lg font-black text-gray-950 tracking-tight",
      htmlContainer: "text-xs font-medium text-gray-600",
      confirmButton: "font-bold text-xs px-4 py-2 rounded shadow-xs",
      cancelButton: "font-bold text-xs px-4 py-2 rounded shadow-xs",
    },
  });
};

/**
 * Branded alert modal replacing window.alert().
 */
export const showAlert = async (options: {
  title: string;
  text: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
}): Promise<SweetAlertResult> => {
  return Swal.fire({
    title: options.title,
    text: options.text,
    icon: options.icon || "info",
    confirmButtonColor: "#DC2626",
    confirmButtonText: options.confirmButtonText || "Got it",
    background: "#FFFFFF",
    color: "#0F172A",
    customClass: {
      popup: "rounded-xl border-2 border-yellow-500 shadow-2xl p-5",
      title: "text-base sm:text-lg font-black text-gray-950 tracking-tight",
      htmlContainer: "text-xs font-medium text-gray-600",
      confirmButton: "font-bold text-xs px-4 py-2 rounded shadow-xs",
    },
  });
};

/**
 * Branded success modal with auto-dismiss timer.
 */
export const showSuccess = async (
  title: string,
  text?: string
): Promise<SweetAlertResult> => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#DC2626",
    confirmButtonText: "Done",
    timer: 2500,
    timerProgressBar: true,
    background: "#FFFFFF",
    color: "#0F172A",
    customClass: {
      popup: "rounded-xl border-2 border-emerald-500 shadow-2xl p-5",
      title: "text-base sm:text-lg font-black text-gray-950 tracking-tight",
      htmlContainer: "text-xs font-medium text-gray-600",
      confirmButton: "font-bold text-xs px-4 py-2 rounded shadow-xs",
    },
  });
};

export default Swal;

