import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Users, Monitor, Smartphone, Globe, RefreshCw, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface VisitorData {
  id: string;
  ip_address: string | null;
  user_id: string | null;
  visitor_name: string | null;
  user_agent: string | null;
  page_visited: string | null;
  referrer: string | null;
  device_type: string | null;
  browser: string | null;
  country: string | null;
  city: string | null;
  push_token: string | null;
  is_subscribed_push: boolean;
  created_at: string;
}

export default function VisitorAnalytics() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ip' | 'name' | 'user'>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');

  const { data: visitors, isLoading, refetch } = useQuery({
    queryKey: ['visitor-data', searchTerm, filterType, deviceFilter],
    queryFn: async () => {
      let query = supabase
        .from('visitor_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (searchTerm) {
        if (filterType === 'ip') {
          query = query.ilike('ip_address', `%${searchTerm}%`);
        } else if (filterType === 'name') {
          query = query.ilike('visitor_name', `%${searchTerm}%`);
        } else if (filterType === 'user') {
          query = query.not('user_id', 'is', null);
          if (searchTerm) {
            query = query.ilike('visitor_name', `%${searchTerm}%`);
          }
        } else {
          query = query.or(`ip_address.ilike.%${searchTerm}%,visitor_name.ilike.%${searchTerm}%,page_visited.ilike.%${searchTerm}%`);
        }
      }

      if (deviceFilter !== 'all') {
        query = query.eq('device_type', deviceFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VisitorData[];
    },
  });

  // Stats
  const totalVisitors = visitors?.length || 0;
  const uniqueIPs = new Set(visitors?.map(v => v.ip_address).filter(Boolean)).size;
  const registeredUsers = visitors?.filter(v => v.user_id).length || 0;
  const mobileVisitors = visitors?.filter(v => v.device_type === 'Mobile').length || 0;
  const pushSubscribers = visitors?.filter(v => v.is_subscribed_push).length || 0;

  const translations = {
    title: language === 'hi' ? 'विज़िटर एनालिटिक्स' : 'Visitor Analytics',
    totalVisits: language === 'hi' ? 'कुल विज़िट' : 'Total Visits',
    uniqueIPs: language === 'hi' ? 'यूनिक आईपी' : 'Unique IPs',
    registeredUsers: language === 'hi' ? 'पंजीकृत उपयोगकर्ता' : 'Registered Users',
    mobileVisitors: language === 'hi' ? 'मोबाइल विज़िटर' : 'Mobile Visitors',
    pushSubscribers: language === 'hi' ? 'पुश सब्सक्राइबर' : 'Push Subscribers',
    searchPlaceholder: language === 'hi' ? 'खोजें...' : 'Search...',
    filterBy: language === 'hi' ? 'फ़िल्टर' : 'Filter by',
    all: language === 'hi' ? 'सभी' : 'All',
    ip: language === 'hi' ? 'आईपी' : 'IP',
    name: language === 'hi' ? 'नाम' : 'Name',
    user: language === 'hi' ? 'उपयोगकर्ता' : 'User',
    device: language === 'hi' ? 'डिवाइस' : 'Device',
    desktop: language === 'hi' ? 'डेस्कटॉप' : 'Desktop',
    mobile: language === 'hi' ? 'मोबाइल' : 'Mobile',
    tablet: language === 'hi' ? 'टैबलेट' : 'Tablet',
    refresh: language === 'hi' ? 'रिफ्रेश' : 'Refresh',
    ipAddress: language === 'hi' ? 'आईपी एड्रेस' : 'IP Address',
    visitorName: language === 'hi' ? 'विज़िटर नाम' : 'Visitor Name',
    page: language === 'hi' ? 'पेज' : 'Page',
    browser: language === 'hi' ? 'ब्राउज़र' : 'Browser',
    time: language === 'hi' ? 'समय' : 'Time',
    push: language === 'hi' ? 'पुश' : 'Push',
    guest: language === 'hi' ? 'अतिथि' : 'Guest',
    unknown: language === 'hi' ? 'अज्ञात' : 'Unknown',
    noData: language === 'hi' ? 'कोई विज़िटर डेटा नहीं' : 'No visitor data found',
    loading: language === 'hi' ? 'लोड हो रहा है...' : 'Loading...',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">{translations.title}</h1>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {translations.refresh}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                {translations.totalVisits}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalVisitors}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {translations.uniqueIPs}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{uniqueIPs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                {translations.registeredUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{registeredUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                {translations.mobileVisitors}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mobileVisitors}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {translations.pushSubscribers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{pushSubscribers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={translations.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={translations.filterBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{translations.all}</SelectItem>
                  <SelectItem value="ip">{translations.ip}</SelectItem>
                  <SelectItem value="name">{translations.name}</SelectItem>
                  <SelectItem value="user">{translations.user}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={translations.device} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{translations.all}</SelectItem>
                  <SelectItem value="Desktop">{translations.desktop}</SelectItem>
                  <SelectItem value="Mobile">{translations.mobile}</SelectItem>
                  <SelectItem value="Tablet">{translations.tablet}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                {translations.loading}
              </div>
            ) : visitors && visitors.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{translations.ipAddress}</TableHead>
                      <TableHead>{translations.visitorName}</TableHead>
                      <TableHead>{translations.page}</TableHead>
                      <TableHead>{translations.device}</TableHead>
                      <TableHead>{translations.browser}</TableHead>
                      <TableHead>{translations.time}</TableHead>
                      <TableHead>{translations.push}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitors.map((visitor) => (
                      <TableRow key={visitor.id}>
                        <TableCell className="font-mono text-sm">
                          {visitor.ip_address || translations.unknown}
                        </TableCell>
                        <TableCell>
                          {visitor.user_id ? (
                            <Badge variant="default" className="text-xs">
                              {visitor.visitor_name || translations.user}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              {translations.guest}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {visitor.page_visited}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            {visitor.device_type === 'Mobile' ? (
                              <Smartphone className="w-4 h-4" />
                            ) : (
                              <Monitor className="w-4 h-4" />
                            )}
                            {visitor.device_type}
                          </span>
                        </TableCell>
                        <TableCell>{visitor.browser}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(visitor.created_at), 'dd/MM/yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          {visitor.is_subscribed_push ? (
                            <Badge variant="default" className="bg-primary">
                              <Bell className="w-3 h-3" />
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              -
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {translations.noData}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
