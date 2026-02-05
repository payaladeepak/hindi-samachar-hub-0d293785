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
     
     // Categories
     'category.politics': 'राजनीति',
     'category.sports': 'खेल',
     'category.entertainment': 'मनोरंजन',
     'category.national': 'देश',
     'category.international': 'विदेश',
     'category.business': 'व्यापार',
     'category.technology': 'तकनीक',
     'category.health': 'स्वास्थ्य',
     
     // Article Status
     'status.draft': 'ड्राफ्ट',
     'status.pending_review': 'समीक्षा हेतु',
     'status.published': 'प्रकाशित',
     
     // Common
     'common.readMore': 'पूरी खबर पढ़ें',
     'common.share': 'शेयर करें',
     'common.views': 'बार देखा गया',
     'common.breaking': 'ब्रेकिंग',
     'common.featured': 'मुख्य खबर',
     'common.popular': 'लोकप्रिय खबरें',
     'common.latest': 'ताज़ा खबरें',
     'common.related': 'संबंधित खबरें',
     'common.noArticles': 'कोई खबर नहीं मिली',
     'common.loading': 'लोड हो रहा है...',
     'common.error': 'त्रुटि हुई',
     'common.search': 'खोजें',
     'common.all': 'सभी',
     
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
     'admin.newArticle': 'नया लेख',
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
     
     // Categories
     'category.politics': 'Politics',
     'category.sports': 'Sports',
     'category.entertainment': 'Entertainment',
     'category.national': 'National',
     'category.international': 'International',
     'category.business': 'Business',
     'category.technology': 'Technology',
     'category.health': 'Health',
     
     // Article Status
     'status.draft': 'Draft',
     'status.pending_review': 'Pending Review',
     'status.published': 'Published',
     
     // Common
     'common.readMore': 'Read Full Story',
     'common.share': 'Share',
     'common.views': 'views',
     'common.breaking': 'Breaking',
     'common.featured': 'Featured',
     'common.popular': 'Popular News',
     'common.latest': 'Latest News',
     'common.related': 'Related News',
     'common.noArticles': 'No articles found',
     'common.loading': 'Loading...',
     'common.error': 'Error occurred',
     'common.search': 'Search',
     'common.all': 'All',
     
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
     'admin.newArticle': 'New Article',
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