export interface Category {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
  is_visible: boolean;
  created_at: string;
  children: Category[];
}