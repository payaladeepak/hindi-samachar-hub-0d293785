import { AdminLayout } from '@/layouts/AdminLayout';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewArticle() {
  const { t } = useLanguage();
  
  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t('admin.newArticle')}</h1>
          <p className="text-muted-foreground">{t('admin.newArticleDesc')}</p>
        </div>
        <ArticleForm />
      </div>
    </AdminLayout>
  );
}
