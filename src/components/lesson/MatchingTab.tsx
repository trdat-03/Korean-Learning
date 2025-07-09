import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LessonDetailType } from '../../models/LessonDetail';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import MatchingConfig from './MatchingConfig';

interface MatchingTabContentProps {
  lesson: LessonDetailType;
}

export const MatchingTabContent: React.FC<MatchingTabContentProps> = ({ lesson }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:scale-105 transition-transform duration-300" />
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Trò chơi ghép từ</h3>
              <p className="text-gray-600">
                Thử thách trí nhớ với trò chơi ghép từ tiếng Hàn - tiếng Việt
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Chơi ngay
              </Button>
            </CardContent>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cấu hình trò chơi ghép từ</DialogTitle>
            <DialogDescription>
              Tùy chỉnh các thiết lập cho trò chơi ghép từ của bạn
            </DialogDescription>
          </DialogHeader>
          <MatchingConfig 
            lesson={lesson} 
            onClose={() => setDialogOpen(false)} 
            onStart={(count) => {
              setDialogOpen(false);
              navigate(`/matching/${lesson.id}`, {
                state: { lesson, vocabularyCount: count }
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}; 