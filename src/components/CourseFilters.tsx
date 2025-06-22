
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface CourseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLevels: string[];
  setSelectedLevels: (levels: string[]) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  onClearFilters: () => void;
}

export const CourseFilters = ({
  searchTerm,
  setSearchTerm,
  selectedLevels,
  setSelectedLevels,
  priceRange,
  setPriceRange,
  onClearFilters
}: CourseFiltersProps) => {
  const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];

  const handleLevelChange = (level: string, checked: boolean) => {
    if (checked) {
      setSelectedLevels([...selectedLevels, level]);
    } else {
      setSelectedLevels(selectedLevels.filter(l => l !== level));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Search - Hidden on mobile */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle className="text-lg">Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Level Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cấp độ JLPT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {levels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={level}
                  checked={selectedLevels.includes(level)}
                  onCheckedChange={(checked) => handleLevelChange(level, checked as boolean)}
                />
                <Label htmlFor={level} className="text-sm font-medium">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Khoảng giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={5000000}
              min={0}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        onClick={onClearFilters}
        className="w-full"
      >
        <X className="w-4 h-4 mr-2" />
        Xóa bộ lọc
      </Button>
    </div>
  );
};
