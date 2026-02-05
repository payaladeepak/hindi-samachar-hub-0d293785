 import { Button } from '@/components/ui/button';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { Globe } from 'lucide-react';
 
 export function LanguageSwitch() {
   const { language, setLanguage } = useLanguage();
 
   const toggleLanguage = () => {
     setLanguage(language === 'hi' ? 'en' : 'hi');
   };
 
   return (
     <Button
       variant="ghost"
       size="sm"
       onClick={toggleLanguage}
       className="flex items-center gap-1.5 text-xs font-medium hover:bg-primary/10"
     >
       <Globe className="h-3.5 w-3.5" />
       <span className="hidden sm:inline">
         {language === 'hi' ? 'English' : 'हिंदी'}
       </span>
       <span className="sm:hidden">
         {language === 'hi' ? 'EN' : 'हि'}
       </span>
     </Button>
   );
 }