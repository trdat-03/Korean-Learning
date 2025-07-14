import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle } from "lucide-react";

interface Vocabulary {
  id: number | null;
  wordKorean: string;
  wordVietnamese: string;
  exampleSentence: string;
}
interface Grammar {
  id: number | null;
  structure: string;
  meaning: string;
  usageDescription: string;
  exampleSentence: string;
}
interface LessonDetail {
  id: number;
  title: string;
  orderNumber: number;
  vocabularyCount: number;
  grammarCount: number;
  vocabularies: Vocabulary[];
  grammars: Grammar[];
}

export default function AdminLessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVocabIndex, setEditingVocabIndex] = useState<number | null>(null);
  const [vocabForm, setVocabForm] = useState<Omit<Vocabulary, "id">>({
    wordKorean: "",
    wordVietnamese: "",
    exampleSentence: "",
  });

  const [showGrammarForm, setShowGrammarForm] = useState(false);
  const [editingGrammarIndex, setEditingGrammarIndex] = useState<number | null>(null);
  const [grammarForm, setGrammarForm] = useState<Omit<Grammar, "id">>({
    structure: "",
    meaning: "",
    usageDescription: "",
    exampleSentence: "",
  });

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/lessons/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy dữ liệu");
        return res.json();
      })
      .then((data) => setLesson(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveLesson = async () => {
    if (!lesson) return;
    
    try {
      // Transform data để loại bỏ null ids và convert sang format backend mong đợi
      const transformedLesson = {
        ...lesson,
        vocabularies: lesson.vocabularies.map(v => ({
          ...v,
          id: v.id === null ? undefined : v.id,
        })),
        grammars: lesson.grammars.map(g => ({
          ...g,
          id: g.id === null ? undefined : g.id,
        })),
      };
      
      const res = await fetch(`http://localhost:8080/api/lessons/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}` 
        },
        body: JSON.stringify(transformedLesson),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lưu bài học thất bại. Status: ${res.status}, Error: ${errorText}`);
      }
      
      setMessage("Đã lưu bài học thành công!");
      setAlertType('success');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (err) {
      setMessage(`Lỗi: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  // Vocab handlers
  const handleEditVocab = (index: number) => {
    const vocab = lesson?.vocabularies[index];
    if (!vocab) return;
    setShowAddForm(false);
    setEditingVocabIndex(index);
    setVocabForm({
      wordKorean: vocab.wordKorean,
      wordVietnamese: vocab.wordVietnamese,
      exampleSentence: vocab.exampleSentence,
    });
  };

  const handleDeleteVocab = (index: number) => {
    if (!lesson) return;
    if (!window.confirm("Bạn có chắc chắn muốn xoá từ vựng này?")) return;
    const updated = [...lesson.vocabularies];
    updated.splice(index, 1);
    setLesson({ ...lesson, vocabularies: updated });
    if (editingVocabIndex === index) setEditingVocabIndex(null);
  };

  const handleSubmitVocab = (e: React.FormEvent, index?: number | null) => {
    e.preventDefault();
    if (!lesson) return;
    
    if (index != null) {
      const updated = [...lesson.vocabularies];
      updated[index] = { ...updated[index], ...vocabForm };
      setLesson({ ...lesson, vocabularies: updated });
      setEditingVocabIndex(null);
    } else {
      setLesson({
        ...lesson,
        vocabularies: [{ id: null, ...vocabForm }, ...lesson.vocabularies],
      });
      setShowAddForm(false);
    }
  };

  const handleAddVocab = () => {
    setEditingVocabIndex(null);
    setVocabForm({ wordKorean: "", wordVietnamese: "", exampleSentence: "" });
    setShowAddForm(true);
  };

  // Grammar handlers
  const handleAddGrammar = () => {
    setEditingGrammarIndex(null);
    setGrammarForm({ structure: "", meaning: "", usageDescription: "", exampleSentence: "" });
    setShowGrammarForm(true);
  };

  const handleEditGrammar = (index: number) => {
    const grammar = lesson?.grammars[index];
    if (!grammar) return;
    setEditingGrammarIndex(index);
    setGrammarForm({
      structure: grammar.structure,
      meaning: grammar.meaning,
      usageDescription: grammar.usageDescription,
      exampleSentence: grammar.exampleSentence,
    });
    setShowGrammarForm(true);
  };

  const handleDeleteGrammar = (index: number) => {
    if (!lesson) return;
    if (!window.confirm("Bạn có chắc chắn muốn xoá ngữ pháp này?")) return;
    const updated = [...lesson.grammars];
    updated.splice(index, 1);
    setLesson({ ...lesson, grammars: updated });
    if (editingGrammarIndex === index) setEditingGrammarIndex(null);
  };

  const handleSubmitGrammar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson) return;
    
    if (editingGrammarIndex != null) {
      const updated = [...lesson.grammars];
      updated[editingGrammarIndex] = { ...updated[editingGrammarIndex], ...grammarForm };
      setLesson({ ...lesson, grammars: updated });
    } else {
      setLesson({
        ...lesson,
        grammars: [...lesson.grammars, { id: null, ...grammarForm }],
      });
    }
    setShowGrammarForm(false);
    setEditingGrammarIndex(null);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!lesson) return <div>Bài học không tồn tại.</div>;

  return (
    <AdminLayout 
      title={`Bài học: ${lesson.title}`}
    >
      {showAlert && (
        <div 
          className={`fixed top-4 right-4 z-50 animate-slide-in ${
            alertType === 'success' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
          } border px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}
        >
          {alertType === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className={alertType === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message}
          </span>
        </div>
      )}
      <div 
        className="mb-4"
      >
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white" 
          onClick={handleSaveLesson}
        >
          Lưu bài học
        </Button>
      </div>

      {/* Vocabularies */}
      <Card>
        <CardHeader>
          <CardTitle>
            Từ vựng
            <Button 
              className="ml-4 bg-green-600 hover:bg-green-700 text-white" 
              size="sm" 
              onClick={handleAddVocab}
            >
              Thêm từ vựng
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <form 
              onSubmit={(e) => handleSubmitVocab(e)} 
              className="mb-4 space-y-2"
            >
              <Input 
                value={vocabForm.wordKorean} 
                onChange={(e) => setVocabForm(f => ({ ...f, wordKorean: e.target.value }))} 
                placeholder="Tiếng Hàn" 
                required 
              />
              <Input 
                value={vocabForm.wordVietnamese} 
                onChange={(e) => setVocabForm(f => ({ ...f, wordVietnamese: e.target.value }))} 
                placeholder="Tiếng Việt" 
                required 
              />
              <Textarea 
                value={vocabForm.exampleSentence} 
                onChange={(e) => setVocabForm(f => ({ ...f, exampleSentence: e.target.value }))} 
                placeholder="Câu ví dụ" 
              />
              <Button 
                type="submit" 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Thêm mới
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Hủy
              </Button>
            </form>
          )}

          <ul>
            {lesson.vocabularies.map((vocab, index) => (
              <li 
                key={index} 
                className="border-b py-2"
              >
                <div 
                  className="flex justify-between"
                >
                  <div>
                    <strong>{vocab.wordKorean}</strong> - {vocab.wordVietnamese}
                    {vocab.exampleSentence && (
                      <div 
                        className="text-sm text-gray-500"
                      >
                        Ví dụ: {vocab.exampleSentence}
                      </div>
                    )}
                  </div>
                  <div 
                    className="flex gap-2"
                  >
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white border-green-600" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditVocab(index)}
                    >
                      Sửa
                    </Button>
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white border-red-600" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteVocab(index)}
                    >
                      Xoá
                    </Button>
                  </div>
                </div>
                {editingVocabIndex === index && (
                  <form 
                    onSubmit={(e) => handleSubmitVocab(e, index)} 
                    className="mt-2 space-y-2"
                  >
                    <Input 
                      value={vocabForm.wordKorean} 
                      onChange={(e) => setVocabForm(f => ({ ...f, wordKorean: e.target.value }))} 
                      required 
                    />
                    <Input 
                      value={vocabForm.wordVietnamese} 
                      onChange={(e) => setVocabForm(f => ({ ...f, wordVietnamese: e.target.value }))} 
                      required 
                    />
                    <Textarea 
                      value={vocabForm.exampleSentence} 
                      onChange={(e) => setVocabForm(f => ({ ...f, exampleSentence: e.target.value }))} 
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                    >
                      Lưu
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingVocabIndex(null)}
                    >
                      Hủy
                    </Button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Grammars */}
      <Card 
        className="mt-6"
      >
        <CardHeader>
          <CardTitle>
            Ngữ pháp
            <Button 
              className="ml-4 bg-green-600 hover:bg-green-700 text-white" 
              size="sm" 
              onClick={handleAddGrammar}
            >
              Thêm ngữ pháp
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {lesson.grammars.map((grammar, index) => (
              <li 
                key={index} 
                className="border p-4 mb-3 rounded"
              >
                <div 
                  className="mb-1 font-semibold"
                >
                  {grammar.structure} - {grammar.meaning}
                </div>
                <div 
                  className="text-sm text-gray-600 mb-1"
                >
                  Cách dùng: {grammar.usageDescription}
                </div>
                <div 
                  className="text-sm text-gray-600"
                >
                  Ví dụ: {grammar.exampleSentence}
                </div>
                <div 
                  className="mt-2 flex gap-2"
                >
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white border-green-600" 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEditGrammar(index)}
                  >
                    Sửa
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600" 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteGrammar(index)}
                  >
                    Xoá
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {showGrammarForm && (
            <form 
              onSubmit={handleSubmitGrammar} 
              className="mt-4 space-y-2"
            >
              <Input 
                value={grammarForm.structure} 
                onChange={(e) => setGrammarForm(f => ({ ...f, structure: e.target.value }))} 
                placeholder="Cấu trúc" 
                required 
              />
              <Input 
                value={grammarForm.meaning} 
                onChange={(e) => setGrammarForm(f => ({ ...f, meaning: e.target.value }))} 
                placeholder="Ý nghĩa" 
                required 
              />
              <Textarea 
                value={grammarForm.usageDescription} 
                onChange={(e) => setGrammarForm(f => ({ ...f, usageDescription: e.target.value }))} 
                placeholder="Cách dùng" 
              />
              <Textarea 
                value={grammarForm.exampleSentence} 
                onChange={(e) => setGrammarForm(f => ({ ...f, exampleSentence: e.target.value }))} 
                placeholder="Ví dụ" 
              />
              <div 
                className="flex gap-2"
              >
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white" 
                  type="submit" 
                  size="sm"
                >
                  {editingGrammarIndex !== null ? "Lưu thay đổi" : "Thêm mới"}
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowGrammarForm(false)}
                >
                  Hủy
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}