import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Download,
  MessageSquare,
  Eye,
  MoreHorizontal,
  Users,
  TrendingUp,
  UserCheck,
  Mail,
  Award,
} from 'lucide-react';

interface Student {
  id: number;
  fullName: string;
  email: string;
  avatar?: string;
  enrolledCourses: number;
  completedCourses: number;
  totalProgress: number;
  lastActive: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'graduated';
  courses: StudentCourse[];
}

interface StudentCourse {
  id: number;
  title: string;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  status: 'in_progress' | 'completed' | 'paused';
  grade?: number;
}

// Mock data
const mockStudents: Student[] = [
  {
    id: 1,
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: '',
    enrolledCourses: 3,
    completedCourses: 1,
    totalProgress: 78,
    lastActive: '2024-03-15T14:30:00Z',
    joinDate: '2024-01-15T10:00:00Z',
    status: 'active',
    courses: [
      {
        id: 1,
        title: 'Tiếng Hàn Cơ Bản A1',
        progress: 85,
        enrolledAt: '2024-01-20T10:00:00Z',
        status: 'in_progress',
      },
      {
        id: 2,
        title: 'Tiếng Hàn Trung Cấp A2',
        progress: 100,
        enrolledAt: '2024-01-22T11:00:00Z',
        completedAt: '2024-02-28T16:00:00Z',
        status: 'completed',
        grade: 92,
      },
    ],
  },
  {
    id: 2,
    fullName: 'Trần Thị B',
    email: 'tranthib@example.com',
    avatar: '',
    enrolledCourses: 2,
    completedCourses: 2,
    totalProgress: 100,
    lastActive: '2024-03-14T16:45:00Z',
    joinDate: '2024-01-10T09:30:00Z',
    status: 'graduated',
    courses: [
      {
        id: 1,
        title: 'Tiếng Hàn Cơ Bản A1',
        progress: 100,
        enrolledAt: '2024-01-15T10:00:00Z',
        completedAt: '2024-02-15T14:30:00Z',
        status: 'completed',
        grade: 95,
      },
      {
        id: 3,
        title: 'Ngữ Pháp Nâng Cao',
        progress: 100,
        enrolledAt: '2024-02-20T11:00:00Z',
        completedAt: '2024-03-10T15:00:00Z',
        status: 'completed',
        grade: 88,
      },
    ],
  },
  {
    id: 3,
    fullName: 'Lê Văn C',
    email: 'levanc@example.com',
    avatar: '',
    enrolledCourses: 1,
    completedCourses: 0,
    totalProgress: 45,
    lastActive: '2024-03-01T08:15:00Z',
    joinDate: '2024-01-25T14:00:00Z',
    status: 'inactive',
    courses: [
      {
        id: 1,
        title: 'Tiếng Hàn Cơ Bản A1',
        progress: 45,
        enrolledAt: '2024-01-25T14:00:00Z',
        status: 'paused',
      },
    ],
  },
];

const getStatusColor = (status: Student['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800';
    case 'graduated':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: Student['status']) => {
  switch (status) {
    case 'active':
      return 'Đang học';
    case 'inactive':
      return 'Không hoạt động';
    case 'graduated':
      return 'Đã tốt nghiệp';
    default:
      return 'Không xác định';
  }
};

const getCourseStatusColor = (status: StudentCourse['status']) => {
  switch (status) {
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCourseStatusText = (status: StudentCourse['status']) => {
  switch (status) {
    case 'in_progress':
      return 'Đang học';
    case 'completed':
      return 'Hoàn thành';
    case 'paused':
      return 'Tạm dừng';
    default:
      return 'Không xác định';
  }
};

export const TeacherStudentList: React.FC = () => {
  const [students] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Student['status'] | 'all'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
  };

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const graduatedStudents = students.filter(s => s.status === 'graduated').length;
  const averageProgress = Math.round(students.reduce((sum, s) => sum + s.totalProgress, 0) / totalStudents);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý học sinh</h1>
          <p className="text-gray-600">Theo dõi tiến độ và hoạt động của học sinh</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Gửi thông báo
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Tổng học sinh</p>
                <p className="text-xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Đang học</p>
                <p className="text-xl font-bold">{activeStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Tốt nghiệp</p>
                <p className="text-xl font-bold">{graduatedStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Tiến độ TB</p>
                <p className="text-xl font-bold">{averageProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Student['status'] | 'all')}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang học</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
            <SelectItem value="graduated">Đã tốt nghiệp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Học sinh</TableHead>
              <TableHead>Khóa học</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead>Hoạt động cuối</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {student.avatar ? (
                        <img 
                          src={student.avatar} 
                          alt={student.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {student.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-center">
                    <p className="font-medium">{student.enrolledCourses}</p>
                    <p className="text-sm text-gray-600">
                      {student.completedCourses} hoàn thành
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${student.totalProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{student.totalProgress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{new Date(student.lastActive).toLocaleDateString('vi-VN')}</p>
                    <p className="text-gray-600">
                      {new Date(student.lastActive).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(student.status)}>
                    {getStatusText(student.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Gửi tin nhắn
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Gửi email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy học sinh nào
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              : 'Chưa có học sinh nào đăng ký khóa học của bạn'}
          </p>
        </div>
      )}

      {/* Student Detail Dialog */}
      <Dialog open={showStudentDetail} onOpenChange={setShowStudentDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết học sinh</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về tiến độ học tập
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {selectedStudent.avatar ? (
                    <img 
                      src={selectedStudent.avatar} 
                      alt={selectedStudent.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium text-gray-600">
                      {selectedStudent.fullName.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.fullName}</h3>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(selectedStudent.status)}>
                      {getStatusText(selectedStudent.status)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Tham gia: {new Date(selectedStudent.joinDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedStudent.enrolledCourses}</p>
                  <p className="text-sm text-gray-600">Khóa học đăng ký</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedStudent.completedCourses}</p>
                  <p className="text-sm text-gray-600">Khóa học hoàn thành</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{selectedStudent.totalProgress}%</p>
                  <p className="text-sm text-gray-600">Tiến độ tổng thể</p>
                </div>
              </div>

              {/* Course List */}
              <div>
                <h4 className="font-semibold mb-3">Khóa học đã đăng ký</h4>
                <div className="space-y-3">
                  {selectedStudent.courses.map((course) => (
                    <div key={course.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{course.title}</h5>
                        <Badge className={getCourseStatusColor(course.status)}>
                          {getCourseStatusText(course.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 mr-4">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{course.progress}%</span>
                        </div>
                        {course.grade && (
                          <span className="text-sm text-gray-600">
                            Điểm: {course.grade}/100
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>Đăng ký: {new Date(course.enrolledAt).toLocaleDateString('vi-VN')}</span>
                        {course.completedAt && (
                          <span>Hoàn thành: {new Date(course.completedAt).toLocaleDateString('vi-VN')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
