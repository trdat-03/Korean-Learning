import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";

interface ImportDialogProps {
  onImport: (vocabularies: Array<{
    wordKorean: string;
    wordVietnamese: string;
    exampleSentence: string;
  }>) => void;
}

export function ImportDialog({ onImport }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [termSeparator, setTermSeparator] = useState("tab");
  const [rowSeparator, setRowSeparator] = useState("newline");
  const [customTermSeparator, setCustomTermSeparator] = useState("");
  const [customRowSeparator, setCustomRowSeparator] = useState("");

  const getSeparator = (type: string, customValue: string) => {
    switch (type) {
      case "tab":
        return "\t";
      case "comma":
        return ",";
      case "semicolon":
        return ";";
      case "newline":
        return "\n";
      case "custom":
        return customValue;
      default:
        return "\t";
    }
  };

  const parseText = () => {
    if (!text.trim()) {
      toast.error("Vui lòng nhập dữ liệu để import!");
      return;
    }

    try {
      const termSep = getSeparator(termSeparator, customTermSeparator);
      const rowSep = getSeparator(rowSeparator, customRowSeparator);

      // Tách các dòng
      const rows = text.split(rowSep).filter(row => row.trim());
      
      const vocabularies = rows.map((row, index) => {
        const parts = row.split(termSep).map(part => part.trim());
        
        if (parts.length < 2) {
          throw new Error(`Dòng ${index + 1} không đúng định dạng (cần ít nhất 2 cột)`);
        }

        return {
          wordKorean: parts[0] || "",
          wordVietnamese: parts[1] || "",
          exampleSentence: parts[2] || "",
        };
      });

      if (vocabularies.length === 0) {
        toast.error("Không tìm thấy dữ liệu hợp lệ!");
        return;
      }

      onImport(vocabularies);
      toast.success(`Đã import thành công ${vocabularies.length} từ vựng!`);
      setOpen(false);
      setText("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi import!");
    }
  };

  const getPreviewText = () => {
    if (!text) return "Chưa có dữ liệu";
    
    const termSep = getSeparator(termSeparator, customTermSeparator);
    const rowSep = getSeparator(rowSeparator, customRowSeparator);
    
    const rows = text.split(rowSep).filter(row => row.trim());
    const preview = rows.slice(0, 3).map(row => {
      const parts = row.split(termSep).map(part => part.trim());
      return `• ${parts[0] || "?"} → ${parts[1] || "?"} ${parts[2] ? `(${parts[2]})` : ""}`;
    }).join("\n");
    
    return preview + (rows.length > 3 ? `\n... và ${rows.length - 3} dòng khác` : "");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import từ text
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import từ vựng từ text
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cài đặt định dạng */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Phân cách giữa từ và nghĩa</Label>
              <RadioGroup value={termSeparator} onValueChange={setTermSeparator}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tab" id="tab" />
                  <Label htmlFor="tab">Tab</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comma" id="comma" />
                  <Label htmlFor="comma">Comma (,)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="semicolon" id="semicolon" />
                  <Label htmlFor="semicolon">Semicolon (;)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom-term" id="custom-term" />
                  <Label htmlFor="custom-term">Tùy chỉnh:</Label>
                  <Input
                    placeholder="Nhập ký tự"
                    value={customTermSeparator}
                    onChange={(e) => {
                      setCustomTermSeparator(e.target.value);
                      if (e.target.value) setTermSeparator("custom");
                    }}
                    className="w-20 h-8"
                  />
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Phân cách giữa các dòng</Label>
              <RadioGroup value={rowSeparator} onValueChange={setRowSeparator}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newline" id="newline" />
                  <Label htmlFor="newline">New line</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="semicolon-row" id="semicolon-row" />
                  <Label htmlFor="semicolon-row">Semicolon (;)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom-row" id="custom-row" />
                  <Label htmlFor="custom-row">Tùy chỉnh:</Label>
                  <Input
                    placeholder="Nhập ký tự"
                    value={customRowSeparator}
                    onChange={(e) => {
                      setCustomRowSeparator(e.target.value);
                      if (e.target.value) setRowSeparator("custom");
                    }}
                    className="w-20 h-8"
                  />
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Textarea để paste text */}
          <div className="space-y-2">
            <Label htmlFor="import-text">Dán nội dung cần import</Label>
            <Textarea
              id="import-text"
              placeholder="Dán nội dung ở đây...&#10;Ví dụ:&#10;안녕하세요&#9;Xin chào&#9;안녕하세요, 저는 민수입니다.&#10;감사합니다&#9;Cảm ơn&#9;정말 감사합니다."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Định dạng: Từ Hàn [phân cách] Nghĩa Việt [phân cách] Câu ví dụ (tùy chọn)
            </p>
          </div>

          {/* Preview */}
          {text && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Xem trước:</Label>
              <div className="bg-muted p-3 rounded-md text-sm font-mono whitespace-pre-line">
                {getPreviewText()}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={parseText} disabled={!text.trim()}>
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}