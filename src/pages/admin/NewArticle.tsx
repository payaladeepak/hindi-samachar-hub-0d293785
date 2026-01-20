import { AdminLayout } from '@/layouts/AdminLayout';
import { ArticleForm } from '@/components/admin/ArticleForm';

export default function NewArticle() {
  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">नई खबर लिखें</h1>
          <p className="text-muted-foreground">एक नई खबर प्रकाशित करें</p>
        </div>
        <ArticleForm />
      </div>
    </AdminLayout>
  );
}
