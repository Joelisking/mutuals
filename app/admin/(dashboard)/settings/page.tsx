'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, X, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  useGetSettingsQuery,
  useInitializeSettingsMutation,
  useUpdateArticleCategoriesMutation,
  useUpdateContactCategoriesMutation,
  useUpdateEventTypesMutation,
  useUpdateSettingMutation,
} from '@/lib/redux/api/settings.api';
import { SiteSetting, ApiResponse } from '@/lib/types/api';

export default function SettingsPage() {
  const { data, isLoading, refetch } = useGetSettingsQuery();
  const [initializeSettings, { isLoading: isInitializing }] = useInitializeSettingsMutation();
  const [updateArticleCategories, { isLoading: isUpdatingArticles }] = useUpdateArticleCategoriesMutation();
  const [updateContactCategories, { isLoading: isUpdatingContact }] = useUpdateContactCategoriesMutation();
  const [updateEventTypes, { isLoading: isUpdatingEvents }] = useUpdateEventTypesMutation();
  const [updateSetting, { isLoading: isUpdatingSetting }] = useUpdateSettingMutation();

  // Local state for editing
  const [articleCategories, setArticleCategories] = useState<string[]>([]);
  const [contactCategories, setContactCategories] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState('');
  const [newContactCategory, setNewContactCategory] = useState('');
  const [newEventType, setNewEventType] = useState('');

  // Parse settings data
  const response = data as ApiResponse<SiteSetting[]> | undefined;
  const settings = response?.data || [];

  // Initialize local state from settings
  useEffect(() => {
    if (settings.length > 0) {
      const articleCatsSetting = settings.find((s) => s.key === 'article_categories');
      const contactCatsSetting = settings.find((s) => s.key === 'contact_categories');
      const eventTypesSetting = settings.find((s) => s.key === 'event_types');
      const siteNameSetting = settings.find((s) => s.key === 'site_name');
      const siteDescSetting = settings.find((s) => s.key === 'site_description');

      if (articleCatsSetting?.parsedValue) {
        setArticleCategories(articleCatsSetting.parsedValue as string[]);
      }
      if (contactCatsSetting?.parsedValue) {
        setContactCategories(contactCatsSetting.parsedValue as string[]);
      }
      if (eventTypesSetting?.parsedValue) {
        setEventTypes(eventTypesSetting.parsedValue as string[]);
      }
      if (siteNameSetting?.parsedValue) {
        setSiteName(siteNameSetting.parsedValue as string);
      }
      if (siteDescSetting?.parsedValue) {
        setSiteDescription(siteDescSetting.parsedValue as string);
      }
    }
  }, [settings]);

  const handleInitialize = async () => {
    try {
      await initializeSettings().unwrap();
      toast.success('Settings initialized successfully');
      refetch();
    } catch {
      toast.error('Failed to initialize settings');
    }
  };

  const handleAddArticleCategory = () => {
    if (newArticleCategory.trim() && !articleCategories.includes(newArticleCategory.trim())) {
      setArticleCategories([...articleCategories, newArticleCategory.trim()]);
      setNewArticleCategory('');
    }
  };

  const handleRemoveArticleCategory = (category: string) => {
    setArticleCategories(articleCategories.filter((c) => c !== category));
  };

  const handleSaveArticleCategories = async () => {
    try {
      await updateArticleCategories({ categories: articleCategories }).unwrap();
      toast.success('Article categories updated');
    } catch {
      toast.error('Failed to update article categories');
    }
  };

  const handleAddContactCategory = () => {
    if (newContactCategory.trim() && !contactCategories.includes(newContactCategory.trim())) {
      setContactCategories([...contactCategories, newContactCategory.trim()]);
      setNewContactCategory('');
    }
  };

  const handleRemoveContactCategory = (category: string) => {
    setContactCategories(contactCategories.filter((c) => c !== category));
  };

  const handleSaveContactCategories = async () => {
    try {
      await updateContactCategories({ categories: contactCategories }).unwrap();
      toast.success('Contact categories updated');
    } catch {
      toast.error('Failed to update contact categories');
    }
  };

  const handleAddEventType = () => {
    if (newEventType.trim() && !eventTypes.includes(newEventType.trim())) {
      setEventTypes([...eventTypes, newEventType.trim()]);
      setNewEventType('');
    }
  };

  const handleRemoveEventType = (type: string) => {
    setEventTypes(eventTypes.filter((t) => t !== type));
  };

  const handleSaveEventTypes = async () => {
    try {
      await updateEventTypes({ types: eventTypes }).unwrap();
      toast.success('Event types updated');
    } catch {
      toast.error('Failed to update event types');
    }
  };

  const handleSaveSiteInfo = async () => {
    try {
      await updateSetting({ key: 'site_name', value: siteName }).unwrap();
      await updateSetting({ key: 'site_description', value: siteDescription }).unwrap();
      toast.success('Site information updated');
    } catch {
      toast.error('Failed to update site information');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage site configuration and categories
          </p>
        </div>
        {settings.length === 0 && (
          <Button onClick={handleInitialize} disabled={isInitializing}>
            {isInitializing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Initialize Default Settings
          </Button>
        )}
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          {/* Article Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Article Categories</CardTitle>
              <CardDescription>
                Manage categories available for editorial articles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {articleCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm flex items-center gap-2"
                  >
                    {category}
                    <button
                      onClick={() => handleRemoveArticleCategory(category)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="New category name"
                  value={newArticleCategory}
                  onChange={(e) => setNewArticleCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddArticleCategory()}
                  className="max-w-xs bg-zinc-900 border-zinc-800"
                />
                <Button variant="outline" size="icon" onClick={handleAddArticleCategory}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleSaveArticleCategories}
                disabled={isUpdatingArticles}
                className="text-black"
              >
                {isUpdatingArticles ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Article Categories
              </Button>
            </CardContent>
          </Card>

          {/* Contact Form Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Categories</CardTitle>
              <CardDescription>
                Manage submission types for the contact form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {contactCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm flex items-center gap-2"
                  >
                    {category}
                    <button
                      onClick={() => handleRemoveContactCategory(category)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="New category name"
                  value={newContactCategory}
                  onChange={(e) => setNewContactCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddContactCategory()}
                  className="max-w-xs bg-zinc-900 border-zinc-800"
                />
                <Button variant="outline" size="icon" onClick={handleAddContactCategory}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleSaveContactCategories}
                disabled={isUpdatingContact}
                className="text-black"
              >
                {isUpdatingContact ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Contact Categories
              </Button>
            </CardContent>
          </Card>

          {/* Event Types */}
          <Card>
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
              <CardDescription>
                Manage types available for events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {eventTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm flex items-center gap-2"
                  >
                    {type}
                    <button
                      onClick={() => handleRemoveEventType(type)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="New event type"
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEventType()}
                  className="max-w-xs bg-zinc-900 border-zinc-800"
                />
                <Button variant="outline" size="icon" onClick={handleAddEventType}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleSaveEventTypes}
                disabled={isUpdatingEvents}
                className="text-black"
              >
                {isUpdatingEvents ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Event Types
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic site configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <label htmlFor="siteName" className="text-sm font-medium">
                    Site Name
                  </label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Mutuals+"
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="siteDescription" className="text-sm font-medium">
                    Site Tagline
                  </label>
                  <Input
                    id="siteDescription"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    placeholder="Culture, curated."
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveSiteInfo}
                disabled={isUpdatingSetting}
                className="text-black"
              >
                {isUpdatingSetting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Site Information
              </Button>
            </CardContent>
          </Card>

          {/* All Settings View */}
          <Card>
            <CardHeader>
              <CardTitle>All Settings</CardTitle>
              <CardDescription>
                View all configured settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {settings.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No settings configured. Click &quot;Initialize Default Settings&quot; to set up defaults.
                </p>
              ) : (
                <div className="space-y-3">
                  {settings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex items-start justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                    >
                      <div className="space-y-1">
                        <p className="font-mono text-sm text-zinc-300">{setting.key}</p>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {setting.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-400 max-w-[200px] truncate">
                        {setting.type === 'json'
                          ? Array.isArray(setting.parsedValue)
                            ? `[${(setting.parsedValue as string[]).length} items]`
                            : '{object}'
                          : String(setting.parsedValue)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
