import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  Image as ImageIcon,
  FileImage,
  AlertCircle,
  Check,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { vocabularyAnalysisService } from "@/services/learning/vocabularyAnalysisService";
import type { VocabularyItem } from "@/types/vocabulary";
import type { AnalyzeImageResponse } from "@/types/analysis";

interface ImageAnalysisDialogProps {
  onAddVocabularies: (vocabularies: VocabularyItem[]) => void | Promise<void>;
  trigger?: React.ReactNode;
  aiUsageCount?: number;
  userId?: number;
}

const SUPPORTED_FORMATS = ["jpg", "jpeg", "png", "webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ImageAnalysisDialog({ 
  onAddVocabularies, 
  trigger,
  aiUsageCount = 0,
  userId
}: ImageAnalysisDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedVocabularies, setAnalyzedVocabularies] = useState<VocabularyItem[]>([]);
  const [selectedVocabularies, setSelectedVocabularies] = useState<Set<number>>(new Set());
  const [maxResults, setMaxResults] = useState(10);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteAreaRef = useRef<HTMLDivElement>(null);

  // Validate file
  const validateFile = (file: File): string | null => {
    if (!file) return "Vui lòng chọn file hình ảnh";
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
      return `Chỉ hỗ trợ các định dạng: ${SUPPORTED_FORMATS.join(", ").toUpperCase()}`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return "Kích thước file không được vượt quá 10MB";
    }
    
    return null;
  };

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Clear previous results
    setAnalyzedVocabularies([]);
    setSelectedVocabularies(new Set());
  }, []);

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    const file = files[0];
    
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      toast.error("Vui lòng thả file hình ảnh hợp lệ");
    }
  }, [handleFileSelect]);

  // Handle paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          handleFileSelect(file);
          break;
        }
      }
    }
  }, [handleFileSelect]);

  // Analyze image
  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn hình ảnh");
      return;
    }

    try {
      setIsAnalyzing(true);
      const result: AnalyzeImageResponse = await vocabularyAnalysisService.analyzeImage(selectedFile, maxResults, userId);
      
      if (result.success && result.vocabularyItems) {
        setAnalyzedVocabularies(result.vocabularyItems);
        // Select all vocabularies by default
        const allIndices = new Set(
          result.vocabularyItems.map((_: VocabularyItem, index: number) => index)
        );
        setSelectedVocabularies(allIndices as Set<number>);
        toast.success(`Đã phân tích thành công ${result.vocabularyCount} từ vựng`);
      } else {
        toast.error(result.message || "Không thể phân tích hình ảnh");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Có lỗi xảy ra khi phân tích hình ảnh");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle vocabulary selection
  const toggleVocabularySelection = (index: number) => {
    const newSelected = new Set(selectedVocabularies);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedVocabularies(newSelected);
  };

  // Select all vocabularies
  const handleSelectAll = () => {
    const allIndices = new Set(analyzedVocabularies.map((_, index) => index));
    setSelectedVocabularies(allIndices);
  };

  // Deselect all vocabularies
  const handleDeselectAll = () => {
    setSelectedVocabularies(new Set());
  };

  // Add selected vocabularies
  const handleAddSelectedVocabularies = async () => {
    const selectedItems = analyzedVocabularies.filter((_, index) => 
      selectedVocabularies.has(index)
    );
    
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một từ vựng");
      return;
    }

    await onAddVocabularies(selectedItems);
    toast.success(`Đã thêm ${selectedItems.length} từ vựng`);
    handleCloseDialog();
  };

  // Clear image
  const handleClearImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setAnalyzedVocabularies([]);
    setSelectedVocabularies(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsOpen(false);
    // Clean up after a delay to allow animation
    setTimeout(() => {
      handleClearImage();
    }, 300);
  };

  const isDisabled = aiUsageCount <= 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            className="gap-2" 
            disabled={isDisabled}
            title={isDisabled ? "Bạn đã hết lượt sử dụng AI" : ""}
          >
            <Camera className="h-4 w-4" />
            Phân tích hình ảnh với AI
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Phân tích từ vựng từ hình ảnh
          </DialogTitle>
          <DialogDescription>
            Tải lên hoặc dán hình ảnh để tự động trích xuất từ vựng tiếng Hàn
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxResults">Số từ vựng tối đa</Label>
                <Input
                  id="maxResults"
                  type="number"
                  min={1}
                  max={50}
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* File Upload Area */}
            <div
              ref={pasteAreaRef}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragOver 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onPaste={handlePaste}
              onClick={() => fileInputRef.current?.click()}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileInputRef.current?.click();
                }
              }}
            >
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileImage className="h-6 w-6 text-gray-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-medium">
                    Chọn hình ảnh hoặc kéo thả vào đây
                  </p>
                  <p className="text-sm text-gray-500">
                    Hỗ trợ JPG, JPEG, PNG, WEBP (tối đa 10MB) • Hoặc dán hình ảnh (Ctrl+V)
                  </p>
                </div>
                <Button type="button" variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Chọn file
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Image Preview */}
            {selectedFile && previewUrl && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {Math.round(selectedFile.size / 1024)} KB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleClearImage}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAnalyzeImage}
                        disabled={isAnalyzing || isDisabled}
                        className="gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang phân tích...
                          </>
                        ) : (
                          <>
                            <Camera className="h-4 w-4" />
                            {isDisabled ? "Hết lượt sử dụng AI" : "Phân tích hình ảnh"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Analysis Results */}
          {analyzedVocabularies.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Từ vựng được phát hiện ({analyzedVocabularies.length})
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      Chọn tất cả
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                    >
                      Bỏ chọn tất cả
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {analyzedVocabularies.map((vocab, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-colors ${
                        selectedVocabularies.has(index)
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleVocabularySelection(index)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-4 h-4 border-2 rounded flex items-center justify-center ${
                            selectedVocabularies.has(index)
                              ? "bg-primary border-primary text-white"
                              : "border-gray-300"
                          }`}>
                            {selectedVocabularies.has(index) && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-base">
                                {vocab.wordKorean}
                              </span>
                              <Badge variant="secondary">
                                {vocab.wordVietnamese}
                              </Badge>
                            </div>
                            {vocab.exampleSentence && (
                              <p className="text-sm text-gray-600">
                                {vocab.exampleSentence}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedVocabularies.size > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                      Đã chọn {selectedVocabularies.size} từ vựng để thêm vào danh sách
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button type="button" variant="outline" onClick={handleCloseDialog}>
            Hủy
          </Button>
          {analyzedVocabularies.length > 0 && (
            <Button
              type="button"
              onClick={handleAddSelectedVocabularies}
              disabled={selectedVocabularies.size === 0}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm {selectedVocabularies.size} từ vựng
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}