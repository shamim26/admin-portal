"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ButtonProps } from "@/components/ui/button"; // Import ButtonProps

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmVariant?: ButtonProps["variant"]; // e.g., "destructive"
  confirmText?: string;
}

export default function ConfirmationAlert({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmVariant = "default",
  confirmText = "Continue",
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose(); // Automatically close on confirm
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            variant={confirmVariant} // Use the prop for styling
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
