 import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
 
 type Language = 'hi' | 'en';
 
 interface LanguageContextType {
   language: Language;
   setLanguage: (lang: Language) => void;
   t: (key: string) => string;
 }
 
 const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
 
 // Translations
const translations: Record<Language, Record<string, string>> = {
  hi: {
    // Site
    'site.name': 'ताज़ा खबर',
    'site.tagline': 'सच की आवाज़',
    
    // Navigation
    'nav.home': 'होम',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.admin': 'एडमिन पैनल',
    'nav.login': 'लॉग इन',
    'nav.logout': 'लॉग आउट',
    'nav.signup': 'साइन अप',
    'nav.backHome': 'होम पेज पर वापस जाएं',
    
    // Categories
    'category.politics': 'राजनीति',
    'category.sports': 'खेल',
    'category.entertainment': 'मनोरंजन',
    'category.national': 'देश',
    'category.international': 'विदेश',
    'category.business': 'व्यापार',
    'category.technology': 'तकनीक',
    'category.health': 'स्वास्थ्य',
    'category.notFound': 'श्रेणी नहीं मिली',
    'category.notExists': 'यह श्रेणी मौजूद नहीं है।',
    'category.allNews': 'से जुड़ी सभी ताज़ा खबरें',
    'category.noNews': 'इस श्रेणी में अभी कोई खबर नहीं है',
    
    // Article Status
    'status.draft': 'ड्राफ्ट',
    'status.pending_review': 'समीक्षा हेतु',
    'status.published': 'प्रकाशित',
    
    // Common
    'common.readMore': 'पूरी खबर पढ़ें',
    'common.read': 'पढ़ें',
    'common.share': 'शेयर करें',
    'common.views': 'व्यूज़',
    'common.breaking': 'ब्रेकिंग',
    'common.featured': 'मुख्य खबर',
    'common.popular': 'लोकप्रिय खबरें',
    'common.latest': 'ताज़ा खबरें',
    'common.related': 'संबंधित खबरें',
    'common.noArticles': 'कोई खबर नहीं मिली',
    'common.noNewsYet': 'अभी कोई खबर नहीं है',
    'common.noNewsPublished': 'अभी कोई खबर प्रकाशित नहीं हुई है',
    'common.loginAsAdmin': 'एडमिन के रूप में लॉगिन करें और खबरें जोड़ें',
    'common.seeMore': 'और देखें →',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि हुई',
    'common.search': 'खोजें',
    'common.all': 'सभी',
    'common.home': 'होम',
    
    // Article Page
    'article.notFound': 'खबर नहीं मिली',
    'article.notExists': 'यह खबर मौजूद नहीं है या हटा दी गई है।',
    'article.backHome': '← होम पेज पर वापस जाएं',
    'article.goBackHome': 'वापस होम पेज पर जाएं',
    
    // Footer
    'footer.about': 'हमारे बारे में',
    'footer.contact': 'संपर्क करें',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'नियम और शर्तें',
    'footer.rights': 'सर्वाधिकार सुरक्षित',
    
    // Auth
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.loginTitle': 'लॉग इन करें',
    'auth.signupTitle': 'नया खाता बनाएं',
    'auth.noAccount': 'खाता नहीं है?',
    'auth.hasAccount': 'पहले से खाता है?',
    'auth.loginButton': 'लॉगिन करें',
    'auth.signupButton': 'रजिस्टर करें',
    'auth.loginTab': 'लॉगिन',
    'auth.signupTab': 'रजिस्टर',
    'auth.adminPanel': 'एडमिन पैनल में लॉगिन करें',
    'auth.passwordPlaceholder': 'कम से कम 6 अक्षर',
    'auth.validEmail': 'कृपया वैध ईमेल दर्ज करें',
    'auth.passwordMin': 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    'auth.invalidCredentials': 'ईमेल या पासवर्ड गलत है',
    'auth.alreadyRegistered': 'यह ईमेल पहले से पंजीकृत है',
    'auth.accountCreated': 'खाता बन गया! कृपया लॉगिन करें',
    'auth.loginSuccess': 'लॉगिन सफल',
    'auth.error': 'कुछ गलत हो गया',
    
    // Profile
    'profile.title': 'मेरी प्रोफ़ाइल',
    'profile.displayName': 'प्रदर्शन नाम',
    'profile.bio': 'परिचय',
    'profile.save': 'सहेजें',
    
    // Admin
    'admin.dashboard': 'डैशबोर्ड',
    'admin.articles': 'लेख',
    'admin.categories': 'श्रेणियाँ',
    'admin.users': 'उपयोगकर्ता',
    'admin.seo': 'SEO सेटिंग्स',
    'admin.newArticle': 'नई खबर लिखें',
    'admin.newArticleDesc': 'एक नई खबर प्रकाशित करें',
    'admin.editArticle': 'लेख संपादित करें',
  },
  en: {
    // Site
    'site.name': 'Taza Khabar',
    'site.tagline': 'Voice of Truth',
    
    // Navigation
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin Panel',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.signup': 'Sign Up',
    'nav.backHome': 'Back to Home',
    
    // Categories
    'category.politics': 'Politics',
    'category.sports': 'Sports',
    'category.entertainment': 'Entertainment',
    'category.national': 'National',
    'category.international': 'International',
    'category.business': 'Business',
    'category.technology': 'Technology',
    'category.health': 'Health',
    'category.notFound': 'Category Not Found',
    'category.notExists': 'This category does not exist.',
    'category.allNews': 'All latest news from',
    'category.noNews': 'No news in this category yet',
    
    // Article Status
    'status.draft': 'Draft',
    'status.pending_review': 'Pending Review',
    'status.published': 'Published',
    
    // Common
    'common.readMore': 'Read Full Story',
    'common.read': 'Read',
    'common.share': 'Share',
    'common.views': 'views',
    'common.breaking': 'Breaking',
    'common.featured': 'Featured',
    'common.popular': 'Popular News',
    'common.latest': 'Latest News',
    'common.related': 'Related News',
    'common.noArticles': 'No articles found',
    'common.noNewsYet': 'No news yet',
    'common.noNewsPublished': 'No news published yet',
    'common.loginAsAdmin': 'Login as admin to add news',
    'common.seeMore': 'See More →',
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.search': 'Search',
    'common.all': 'All',
    'common.home': 'Home',
    
    // Article Page
    'article.notFound': 'Article Not Found',
    'article.notExists': 'This article does not exist or has been removed.',
    'article.backHome': '← Back to Home',
    'article.goBackHome': 'Go Back to Home',
    
    // Footer
    'footer.about': 'About Us',
    'footer.contact': 'Contact Us',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.rights': 'All Rights Reserved',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.loginTitle': 'Login',
    'auth.signupTitle': 'Create Account',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginButton': 'Login',
    'auth.signupButton': 'Register',
    'auth.loginTab': 'Login',
    'auth.signupTab': 'Register',
    'auth.adminPanel': 'Login to Admin Panel',
    'auth.passwordPlaceholder': 'At least 6 characters',
    'auth.validEmail': 'Please enter a valid email',
    'auth.passwordMin': 'Password must be at least 6 characters',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.alreadyRegistered': 'This email is already registered',
    'auth.accountCreated': 'Account created! Please login',
    'auth.loginSuccess': 'Login successful',
    'auth.error': 'Something went wrong',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.displayName': 'Display Name',
    'profile.bio': 'Bio',
    'profile.save': 'Save',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.articles': 'Articles',
    'admin.categories': 'Categories',
    'admin.users': 'Users',
    'admin.seo': 'SEO Settings',
    'admin.newArticle': 'Write New Article',
    'admin.newArticleDesc': 'Publish a new article',
    'admin.editArticle': 'Edit Article',
  },
};
 
 export function LanguageProvider({ children }: { children: ReactNode }) {
   const [language, setLanguageState] = useState<Language>(() => {
     const saved = localStorage.getItem('language');
     return (saved as Language) || 'hi';
   });
 
   useEffect(() => {
     localStorage.setItem('language', language);
     document.documentElement.lang = language;
   }, [language]);
 
   const setLanguage = (lang: Language) => {
     setLanguageState(lang);
   };
 
   const t = (key: string): string => {
     return translations[language][key] || key;
   };
 
   return (
     <LanguageContext.Provider value={{ language, setLanguage, t }}>
       {children}
     </LanguageContext.Provider>
   );
 }
 
 export function useLanguage() {
   const context = useContext(LanguageContext);
   if (context === undefined) {
     throw new Error('useLanguage must be used within a LanguageProvider');
   }
   return context;
 }
 
 // Helper hook to get category label based on current language
 export function useCategoryLabel(category: string): string {
   const { t } = useLanguage();
   return t(`category.${category}`);
 }