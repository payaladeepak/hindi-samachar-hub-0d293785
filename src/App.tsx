import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/admin/Dashboard";
import ArticlesList from "./pages/admin/ArticlesList";
import NewArticle from "./pages/admin/NewArticle";
import EditArticle from "./pages/admin/EditArticle";
import CategoriesList from "./pages/admin/CategoriesList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/news/:slug" element={<ArticlePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/articles" element={<ArticlesList />} />
            <Route path="/admin/articles/new" element={<NewArticle />} />
            <Route path="/admin/articles/:id/edit" element={<EditArticle />} />
            <Route path="/admin/categories" element={<CategoriesList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
