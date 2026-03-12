'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, X, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  useGetSettingsQuery,
  useInitializeSettingsMutation,
  useGetArticleCategoriesQuery,
  useUpdateArticleCategoriesMutation,
  useGetContactCategoriesQuery,
  useUpdateContactCategoriesMutation,
  useGetEventTypesQuery,
  useUpdateEventTypesMutation,
  useGetShopProductCategoriesQuery,
  useUpdateShopProductCategoriesMutation,
  useGetArtistSubmissionRolesQuery,
  useUpdateArtistSubmissionRolesMutation,
  useUpdateSettingMutation,
} from '@/lib/redux/api/settings.api';
import { SiteSetting, ApiResponse } from '@/lib/types/api';

// ── Reusable tag-list editor ──────────────────────────────────────────────────
function TagEditor({
  label,
  description,
  tags,
  newValue,
  isLoading,
  onAdd,
  onRemove,
  onSave,
  onChange,
  saveLabel,
  placeholder,
}: {
  label: string;
  description: string;
  tags: string[];
  newValue: string;
  isLoading: boolean;
  onAdd: () => void;
  onRemove: (tag: string) => void;
  onSave: () => void;
  onChange: (val: string) => void;
  saveLabel: string;
  placeholder: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {tags.length === 0 ? (
            <p className="text-sm text-zinc-500">No items yet — add one below.</p>
          ) : (
            tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-2"
              >
                {tag}
                <button onClick={() => onRemove(tag)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={newValue}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAdd()}
            className="max-w-xs bg-zinc-900 border-zinc-800"
          />
          <Button variant="outline" size="icon" onClick={onAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={onSave} disabled={isLoading} className="text-black">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saveLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

function TagEditorSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40 bg-zinc-800" />
        <Skeleton className="h-4 w-64 bg-zinc-800 mt-1" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full bg-zinc-800" />
          <Skeleton className="h-7 w-24 rounded-full bg-zinc-800" />
          <Skeleton className="h-7 w-16 rounded-full bg-zinc-800" />
        </div>
        <Skeleton className="h-9 w-32 bg-zinc-800" />
      </CardContent>
    </Card>
  );
}

// ── Category tab ──────────────────────────────────────────────────────────────
function CategoriesTab() {
  const { data: articleData, isLoading: loadingArticles } = useGetArticleCategoriesQuery();
  const { data: contactData, isLoading: loadingContact } = useGetContactCategoriesQuery();
  const { data: eventData, isLoading: loadingEvents } = useGetEventTypesQuery();
  const { data: shopData, isLoading: loadingShop } = useGetShopProductCategoriesQuery();
  const { data: artistData, isLoading: loadingArtist } = useGetArtistSubmissionRolesQuery();

  const [updateArticleCategories, { isLoading: savingArticles }] = useUpdateArticleCategoriesMutation();
  const [updateContactCategories, { isLoading: savingContact }] = useUpdateContactCategoriesMutation();
  const [updateEventTypes, { isLoading: savingEvents }] = useUpdateEventTypesMutation();
  const [updateShopCategories, { isLoading: savingShop }] = useUpdateShopProductCategoriesMutation();
  const [updateArtistRoles, { isLoading: savingArtist }] = useUpdateArtistSubmissionRolesMutation();

  const [articleCats, setArticleCats] = useState<string[]>([]);
  const [contactCats, setContactCats] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [shopCats, setShopCats] = useState<string[]>([]);
  const [artistRoles, setArtistRoles] = useState<string[]>([]);

  const [newArticle, setNewArticle] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [newShop, setNewShop] = useState('');
  const [newArtist, setNewArtist] = useState('');

  useEffect(() => {
    const d = (articleData as any)?.data;
    if (Array.isArray(d)) setArticleCats(d);
  }, [articleData]);

  useEffect(() => {
    const d = (contactData as any)?.data;
    if (Array.isArray(d)) setContactCats(d);
  }, [contactData]);

  useEffect(() => {
    const d = (eventData as any)?.data;
    if (Array.isArray(d)) setEventTypes(d);
  }, [eventData]);

  useEffect(() => {
    const d = (shopData as any)?.data;
    if (Array.isArray(d)) setShopCats(d);
  }, [shopData]);

  useEffect(() => {
    const d = (artistData as any)?.data;
    if (Array.isArray(d)) setArtistRoles(d);
  }, [artistData]);

  function addTo(list: string[], setList: (v: string[]) => void, val: string, setVal: (v: string) => void) {
    const trimmed = val.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setVal('');
    }
  }

  function removeFrom(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.filter((i) => i !== item));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function save(fn: () => Promise<any>, successMsg: string, errorMsg: string) {
    try {
      await fn();
      toast.success(successMsg);
    } catch {
      toast.error(errorMsg);
    }
  }

  return (
    <div className="space-y-4">
      {loadingArticles ? <TagEditorSkeleton /> : (
        <TagEditor
          label="Article Categories"
          description="Categories available for editorial articles"
          tags={articleCats}
          newValue={newArticle}
          isLoading={savingArticles}
          onChange={setNewArticle}
          onAdd={() => addTo(articleCats, setArticleCats, newArticle, setNewArticle)}
          onRemove={(t) => removeFrom(articleCats, setArticleCats, t)}
          onSave={() => save(
            () => updateArticleCategories({ categories: articleCats }).unwrap(),
            'Article categories saved',
            'Failed to save article categories',
          )}
          saveLabel="Save Article Categories"
          placeholder="e.g. Fashion"
        />
      )}

      {loadingContact ? <TagEditorSkeleton /> : (
        <TagEditor
          label="Contact Form Categories"
          description="Submission types for the contact form"
          tags={contactCats}
          newValue={newContact}
          isLoading={savingContact}
          onChange={setNewContact}
          onAdd={() => addTo(contactCats, setContactCats, newContact, setNewContact)}
          onRemove={(t) => removeFrom(contactCats, setContactCats, t)}
          onSave={() => save(
            () => updateContactCategories({ categories: contactCats }).unwrap(),
            'Contact categories saved',
            'Failed to save contact categories',
          )}
          saveLabel="Save Contact Categories"
          placeholder="e.g. Partnership"
        />
      )}

      {loadingEvents ? <TagEditorSkeleton /> : (
        <TagEditor
          label="Event Types"
          description="Types available when creating events"
          tags={eventTypes}
          newValue={newEvent}
          isLoading={savingEvents}
          onChange={setNewEvent}
          onAdd={() => addTo(eventTypes, setEventTypes, newEvent, setNewEvent)}
          onRemove={(t) => removeFrom(eventTypes, setEventTypes, t)}
          onSave={() => save(
            () => updateEventTypes({ types: eventTypes }).unwrap(),
            'Event types saved',
            'Failed to save event types',
          )}
          saveLabel="Save Event Types"
          placeholder="e.g. Club Night"
        />
      )}

      {loadingShop ? <TagEditorSkeleton /> : (
        <TagEditor
          label="Shop Product Categories"
          description="Categories available for shop products"
          tags={shopCats}
          newValue={newShop}
          isLoading={savingShop}
          onChange={setNewShop}
          onAdd={() => addTo(shopCats, setShopCats, newShop, setNewShop)}
          onRemove={(t) => removeFrom(shopCats, setShopCats, t)}
          onSave={() => save(
            () => updateShopCategories({ categories: shopCats }).unwrap(),
            'Shop categories saved',
            'Failed to save shop categories',
          )}
          saveLabel="Save Shop Categories"
          placeholder="e.g. Hoodies"
        />
      )}

      {loadingArtist ? <TagEditorSkeleton /> : (
        <TagEditor
          label="Artist Submission Roles"
          description="Roles available on the artist submission form"
          tags={artistRoles}
          newValue={newArtist}
          isLoading={savingArtist}
          onChange={setNewArtist}
          onAdd={() => addTo(artistRoles, setArtistRoles, newArtist, setNewArtist)}
          onRemove={(t) => removeFrom(artistRoles, setArtistRoles, t)}
          onSave={() => save(
            () => updateArtistRoles({ roles: artistRoles }).unwrap(),
            'Artist roles saved',
            'Failed to save artist roles',
          )}
          saveLabel="Save Artist Roles"
          placeholder="e.g. Producer"
        />
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data, isLoading: isLoadingAll, refetch } = useGetSettingsQuery();
  const [initializeSettings, { isLoading: isInitializing }] = useInitializeSettingsMutation();
  const [updateSetting, { isLoading: isUpdatingSetting }] = useUpdateSettingMutation();

  const response = data as ApiResponse<SiteSetting[]> | undefined;
  const settings = response?.data || [];

  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [shippingReturns, setShippingReturns] = useState('');

  useEffect(() => {
    if (settings.length > 0) {
      const siteNameSetting = settings.find((s) => s.key === 'site_name');
      const siteDescSetting = settings.find((s) => s.key === 'site_description');
      const shippingReturnsSetting = settings.find((s) => s.key === 'shop_shipping_returns');
      if (siteNameSetting?.parsedValue) setSiteName(siteNameSetting.parsedValue as string);
      if (siteDescSetting?.parsedValue) setSiteDescription(siteDescSetting.parsedValue as string);
      if (shippingReturnsSetting?.parsedValue) setShippingReturns(shippingReturnsSetting.parsedValue as string);
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

  const handleSaveSiteInfo = async () => {
    try {
      await updateSetting({ key: 'site_name', value: siteName }).unwrap();
      await updateSetting({ key: 'site_description', value: siteDescription }).unwrap();
      toast.success('Site information updated');
    } catch {
      toast.error('Failed to update site information');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage site configuration and categories</p>
        </div>
        <Button onClick={handleInitialize} disabled={isInitializing} variant="outline" size="sm">
          {isInitializing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Initialize Defaults
        </Button>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shop">Shop</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingAll ? (
                <div className="space-y-3 max-w-md">
                  <Skeleton className="h-9 w-full bg-zinc-800" />
                  <Skeleton className="h-9 w-full bg-zinc-800" />
                </div>
              ) : (
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <label htmlFor="siteName" className="text-sm font-medium">Site Name</label>
                    <Input
                      id="siteName"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="Mutuals+"
                      className="bg-zinc-900 border-zinc-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="siteDescription" className="text-sm font-medium">Site Tagline</label>
                    <Input
                      id="siteDescription"
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      placeholder="Culture, curated."
                      className="bg-zinc-900 border-zinc-800"
                    />
                  </div>
                </div>
              )}
              <Button onClick={handleSaveSiteInfo} disabled={isUpdatingSetting} className="text-black">
                {isUpdatingSetting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Site Information
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Settings</CardTitle>
              <CardDescription>View all configured settings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAll ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full bg-zinc-800" />
                  ))}
                </div>
              ) : settings.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No settings configured. Click &quot;Initialize Defaults&quot; to set up defaults.
                </p>
              ) : (
                <div className="space-y-2">
                  {settings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex items-start justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                    >
                      <div className="space-y-1">
                        <p className="font-mono text-sm text-zinc-300">{setting.key}</p>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                        <Badge variant="outline" className="text-xs">{setting.type}</Badge>
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

        <TabsContent value="shop" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping &amp; Returns Policy</CardTitle>
              <CardDescription>
                Displayed in the Shipping &amp; Returns accordion on every product page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingAll ? (
                <Skeleton className="h-32 w-full bg-zinc-800" />
              ) : (
                <Textarea
                  value={shippingReturns}
                  onChange={(e) => setShippingReturns(e.target.value)}
                  rows={6}
                  placeholder="e.g. Free standard shipping on orders over $100. Easy returns within 30 days of delivery..."
                  className="bg-zinc-900 border-zinc-800"
                />
              )}
              <Button
                onClick={async () => {
                  try {
                    await updateSetting({
                      key: 'shop_shipping_returns',
                      value: shippingReturns,
                      type: 'text',
                      description: 'Shipping & Returns policy shown on product pages',
                    }).unwrap();
                    toast.success('Shipping & Returns policy saved');
                  } catch {
                    toast.error('Failed to save policy');
                  }
                }}
                disabled={isUpdatingSetting}
                className="text-black"
              >
                {isUpdatingSetting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Policy
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
