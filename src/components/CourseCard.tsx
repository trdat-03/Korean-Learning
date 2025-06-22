
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Course } from "@/types/courses";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="relative">
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          {course.badge && (
            <Badge className="absolute top-2 left-2 bg-red-600">
              {course.badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{course.level}</Badge>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{course.rating}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg leading-tight">{course.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{course.total_students.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div>
              {course.original_price && (
                <span className="text-sm text-gray-500 line-through">
                  {course.original_price}
                </span>
              )}
              <span className="text-lg font-bold text-red-600 ml-2">
                {course.price}
              </span>
            </div>
          </div>
          
          <Link to={`/course/${course.id}`} className="w-full">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Xem chi tiết
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
