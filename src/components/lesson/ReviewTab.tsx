import React, { useState } from 'react';
import type { LessonDetailType } from '../../models/LessonDetail';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Brain } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import ReviewConfig from './ReviewConfig';

interface ReviewTabContentProps {
  lesson: LessonDetailType;
}

export const ReviewTabContent: React.FC<ReviewTabContentProps> = ({ lesson }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 group-hover:scale-105 transition-transform duration-300" />
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Ôn tập kiến thức</h3>
              <p className="text-gray-600">
                Kiểm tra kiến thức của bạn với các dạng bài tập đa dạng
              </p>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Bắt đầu ôn tập
              </Button>
            </CardContent>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cấu hình ôn tập</DialogTitle>
            <DialogDescription>
              Tùy chỉnh các thiết lập cho phần ôn tập của bạn
            </DialogDescription>
          </DialogHeader>
          <ReviewConfig lesson={lesson} onClose={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}; 