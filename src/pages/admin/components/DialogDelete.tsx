import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface DeleteConfirmationDialogProps {
  label: string;
  onConfirm: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  isPending: boolean;
}

export function DialogDelete({
  label,
  onConfirm,
  open,
  setOpen,
  isPending,
}: DeleteConfirmationDialogProps) {
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto";
      document.body.classList.remove("event-point-none");
    };
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa {label} này không? Hành động này không thể
            hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={(e) => {
              setOpen(false);
              e.stopPropagation();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={(e) => {
              onConfirm();
              e.stopPropagation();
            }}
            isLoading={isPending}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
