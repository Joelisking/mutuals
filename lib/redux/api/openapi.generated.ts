import { api } from "./index";
export const addTagTypes = [
  "Articles",
  "Authentication",
  "Cart",
  "DJs",
  "Events",
  "Homepage",
  "Media",
  "Newsletter",
  "Playlists",
  "Products",
  "Submissions",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getArticles: build.query<GetArticlesApiResponse, GetArticlesApiArg>({
        query: (queryArg) => ({
          url: `/articles`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
            category: queryArg.category,
            excludeCategory: queryArg.excludeCategory,
            status: queryArg.status,
            featured: queryArg.featured,
            search: queryArg.search,
          },
        }),
        providesTags: ["Articles"],
      }),
      postArticles: build.mutation<PostArticlesApiResponse, PostArticlesApiArg>(
        {
          query: (queryArg) => ({
            url: `/articles`,
            method: "POST",
            body: queryArg.body,
          }),
          invalidatesTags: ["Articles"],
        },
      ),
      getArticlesBySlug: build.query<
        GetArticlesBySlugApiResponse,
        GetArticlesBySlugApiArg
      >({
        query: (queryArg) => ({ url: `/articles/${queryArg.slug}` }),
        providesTags: ["Articles"],
      }),
      getArticlesIdById: build.query<
        GetArticlesIdByIdApiResponse,
        GetArticlesIdByIdApiArg
      >({
        query: (queryArg) => ({ url: `/articles/id/${queryArg.id}` }),
        providesTags: ["Articles"],
      }),
      putArticlesById: build.mutation<
        PutArticlesByIdApiResponse,
        PutArticlesByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/articles/${queryArg.id}`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Articles"],
      }),
      deleteArticlesById: build.mutation<
        DeleteArticlesByIdApiResponse,
        DeleteArticlesByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/articles/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Articles"],
      }),
      getArticlesFeatured: build.query<
        GetArticlesFeaturedApiResponse,
        GetArticlesFeaturedApiArg
      >({
        query: (queryArg) => ({
          url: `/articles/featured`,
          params: {
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Articles"],
      }),
      postArticlesByArticleIdRelatedAndRelatedArticleId: build.mutation<
        PostArticlesByArticleIdRelatedAndRelatedArticleIdApiResponse,
        PostArticlesByArticleIdRelatedAndRelatedArticleIdApiArg
      >({
        query: (queryArg) => ({
          url: `/articles/${queryArg.articleId}/related/${queryArg.relatedArticleId}`,
          method: "POST",
        }),
        invalidatesTags: ["Articles"],
      }),
      getArticlesCategoryByCategory: build.query<
        GetArticlesCategoryByCategoryApiResponse,
        GetArticlesCategoryByCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/articles/category/${queryArg.category}`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Articles"],
      }),
      postAuthRegister: build.mutation<
        PostAuthRegisterApiResponse,
        PostAuthRegisterApiArg
      >({
        query: (queryArg) => ({
          url: `/auth/register`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Authentication"],
      }),
      postAuthLogin: build.mutation<
        PostAuthLoginApiResponse,
        PostAuthLoginApiArg
      >({
        query: (queryArg) => ({
          url: `/auth/login`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Authentication"],
      }),
      postAuthRefresh: build.mutation<
        PostAuthRefreshApiResponse,
        PostAuthRefreshApiArg
      >({
        query: (queryArg) => ({
          url: `/auth/refresh`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Authentication"],
      }),
      getAuthMe: build.query<GetAuthMeApiResponse, GetAuthMeApiArg>({
        query: () => ({ url: `/auth/me` }),
        providesTags: ["Authentication"],
      }),
      getCart: build.query<GetCartApiResponse, GetCartApiArg>({
        query: (queryArg) => ({
          url: `/cart`,
          params: {
            sessionId: queryArg.sessionId,
          },
        }),
        providesTags: ["Cart"],
      }),
      postCartItems: build.mutation<
        PostCartItemsApiResponse,
        PostCartItemsApiArg
      >({
        query: (queryArg) => ({
          url: `/cart/items`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Cart"],
      }),
      putCartItemsByItemId: build.mutation<
        PutCartItemsByItemIdApiResponse,
        PutCartItemsByItemIdApiArg
      >({
        query: (queryArg) => ({
          url: `/cart/items/${queryArg.itemId}`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Cart"],
      }),
      deleteCartItemsByItemId: build.mutation<
        DeleteCartItemsByItemIdApiResponse,
        DeleteCartItemsByItemIdApiArg
      >({
        query: (queryArg) => ({
          url: `/cart/items/${queryArg.itemId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Cart"],
      }),
      postCartClear: build.mutation<
        PostCartClearApiResponse,
        PostCartClearApiArg
      >({
        query: (queryArg) => ({
          url: `/cart/clear`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Cart"],
      }),
      getCartSummary: build.query<
        GetCartSummaryApiResponse,
        GetCartSummaryApiArg
      >({
        query: (queryArg) => ({
          url: `/cart/summary`,
          params: {
            sessionId: queryArg.sessionId,
          },
        }),
        providesTags: ["Cart"],
      }),
      getDjs: build.query<GetDjsApiResponse, GetDjsApiArg>({
        query: (queryArg) => ({
          url: `/djs`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
            featured: queryArg.featured,
          },
        }),
        providesTags: ["DJs"],
      }),
      postDjs: build.mutation<PostDjsApiResponse, PostDjsApiArg>({
        query: (queryArg) => ({
          url: `/djs`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["DJs"],
      }),
      getDjsById: build.query<GetDjsByIdApiResponse, GetDjsByIdApiArg>({
        query: (queryArg) => ({ url: `/djs/${queryArg.id}` }),
        providesTags: ["DJs"],
      }),
      putDjsById: build.mutation<PutDjsByIdApiResponse, PutDjsByIdApiArg>({
        query: (queryArg) => ({
          url: `/djs/${queryArg.id}`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["DJs"],
      }),
      deleteDjsById: build.mutation<
        DeleteDjsByIdApiResponse,
        DeleteDjsByIdApiArg
      >({
        query: (queryArg) => ({ url: `/djs/${queryArg.id}`, method: "DELETE" }),
        invalidatesTags: ["DJs"],
      }),
      getDjsSlugBySlug: build.query<
        GetDjsSlugBySlugApiResponse,
        GetDjsSlugBySlugApiArg
      >({
        query: (queryArg) => ({ url: `/djs/slug/${queryArg.slug}` }),
        providesTags: ["DJs"],
      }),
      getDjsFeatured: build.query<
        GetDjsFeaturedApiResponse,
        GetDjsFeaturedApiArg
      >({
        query: (queryArg) => ({
          url: `/djs/featured`,
          params: {
            limit: queryArg.limit,
          },
        }),
        providesTags: ["DJs"],
      }),
      getDjsByDjIdMixes: build.query<
        GetDjsByDjIdMixesApiResponse,
        GetDjsByDjIdMixesApiArg
      >({
        query: (queryArg) => ({
          url: `/djs/${queryArg.djId}/mixes`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
          },
        }),
        providesTags: ["DJs"],
      }),
      getDjsMixesByMixId: build.query<
        GetDjsMixesByMixIdApiResponse,
        GetDjsMixesByMixIdApiArg
      >({
        query: (queryArg) => ({ url: `/djs/mixes/${queryArg.mixId}` }),
        providesTags: ["DJs"],
      }),
      putDjsMixesByMixId: build.mutation<
        PutDjsMixesByMixIdApiResponse,
        PutDjsMixesByMixIdApiArg
      >({
        query: (queryArg) => ({
          url: `/djs/mixes/${queryArg.mixId}`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["DJs"],
      }),
      deleteDjsMixesByMixId: build.mutation<
        DeleteDjsMixesByMixIdApiResponse,
        DeleteDjsMixesByMixIdApiArg
      >({
        query: (queryArg) => ({
          url: `/djs/mixes/${queryArg.mixId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["DJs"],
      }),
      postDjsMixes: build.mutation<PostDjsMixesApiResponse, PostDjsMixesApiArg>(
        {
          query: (queryArg) => ({
            url: `/djs/mixes`,
            method: "POST",
            body: queryArg.body,
          }),
          invalidatesTags: ["DJs"],
        },
      ),
      getEvents: build.query<GetEventsApiResponse, GetEventsApiArg>({
        query: (queryArg) => ({
          url: `/events`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
            status: queryArg.status,
            featured: queryArg.featured,
            city: queryArg.city,
            search: queryArg.search,
          },
        }),
        providesTags: ["Events"],
      }),
      postEvents: build.mutation<PostEventsApiResponse, PostEventsApiArg>({
        query: (queryArg) => ({
          url: `/events`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Events"],
      }),
      getEventsById: build.query<GetEventsByIdApiResponse, GetEventsByIdApiArg>(
        {
          query: (queryArg) => ({ url: `/events/${queryArg.id}` }),
          providesTags: ["Events"],
        },
      ),
      putEventsById: build.mutation<
        PutEventsByIdApiResponse,
        PutEventsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/events/${queryArg.id}`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Events"],
      }),
      deleteEventsById: build.mutation<
        DeleteEventsByIdApiResponse,
        DeleteEventsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/events/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Events"],
      }),
      getEventsUpcoming: build.query<
        GetEventsUpcomingApiResponse,
        GetEventsUpcomingApiArg
      >({
        query: (queryArg) => ({
          url: `/events/upcoming`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Events"],
      }),
      getEventsPast: build.query<GetEventsPastApiResponse, GetEventsPastApiArg>(
        {
          query: (queryArg) => ({
            url: `/events/past`,
            params: {
              page: queryArg.page,
              limit: queryArg.limit,
            },
          }),
          providesTags: ["Events"],
        },
      ),
      getEventsFeatured: build.query<
        GetEventsFeaturedApiResponse,
        GetEventsFeaturedApiArg
      >({
        query: (queryArg) => ({
          url: `/events/featured`,
          params: {
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Events"],
      }),
      postEventsByEventIdMedia: build.mutation<
        PostEventsByEventIdMediaApiResponse,
        PostEventsByEventIdMediaApiArg
      >({
        query: (queryArg) => ({
          url: `/events/${queryArg.eventId}/media`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Events"],
      }),
      deleteEventsMediaByMediaId: build.mutation<
        DeleteEventsMediaByMediaIdApiResponse,
        DeleteEventsMediaByMediaIdApiArg
      >({
        query: (queryArg) => ({
          url: `/events/media/${queryArg.mediaId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Events"],
      }),
      getHomepageHeroSlides: build.query<
        GetHomepageHeroSlidesApiResponse,
        GetHomepageHeroSlidesApiArg
      >({
        query: () => ({ url: `/homepage/hero-slides` }),
        providesTags: ["Homepage"],
      }),
      postHomepageHeroSlides: build.mutation<
        PostHomepageHeroSlidesApiResponse,
        PostHomepageHeroSlidesApiArg
      >({
        query: (queryArg) => ({
          url: `/homepage/hero-slides`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Homepage"],
      }),
      getHomepageHeroSlidesActive: build.query<
        GetHomepageHeroSlidesActiveApiResponse,
        GetHomepageHeroSlidesActiveApiArg
      >({
        query: () => ({ url: `/homepage/hero-slides/active` }),
        providesTags: ["Homepage"],
      }),
      getHomepageHeroSlidesById: build.query<
        GetHomepageHeroSlidesByIdApiResponse,
        GetHomepageHeroSlidesByIdApiArg
      >({
        query: (queryArg) => ({ url: `/homepage/hero-slides/${queryArg.id}` }),
        providesTags: ["Homepage"],
      }),
      putHomepageHeroSlidesById: build.mutation<
        PutHomepageHeroSlidesByIdApiResponse,
        PutHomepageHeroSlidesByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/homepage/hero-slides/${queryArg.id}`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Homepage"],
      }),
      deleteHomepageHeroSlidesById: build.mutation<
        DeleteHomepageHeroSlidesByIdApiResponse,
        DeleteHomepageHeroSlidesByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/homepage/hero-slides/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Homepage"],
      }),
      postHomepageHeroSlidesReorder: build.mutation<
        PostHomepageHeroSlidesReorderApiResponse,
        PostHomepageHeroSlidesReorderApiArg
      >({
        query: (queryArg) => ({
          url: `/homepage/hero-slides/reorder`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Homepage"],
      }),
      patchHomepageHeroSlidesByIdToggle: build.mutation<
        PatchHomepageHeroSlidesByIdToggleApiResponse,
        PatchHomepageHeroSlidesByIdToggleApiArg
      >({
        query: (queryArg) => ({
          url: `/homepage/hero-slides/${queryArg.id}/toggle`,
          method: "PATCH",
        }),
        invalidatesTags: ["Homepage"],
      }),
      postMediaUpload: build.mutation<
        PostMediaUploadApiResponse,
        PostMediaUploadApiArg
      >({
        query: (queryArg) => ({
          url: `/media/upload`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Media"],
      }),
      getMedia: build.query<GetMediaApiResponse, GetMediaApiArg>({
        query: (queryArg) => ({
          url: `/media`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
            type: queryArg["type"],
          },
        }),
        providesTags: ["Media"],
      }),
      getMediaById: build.query<GetMediaByIdApiResponse, GetMediaByIdApiArg>({
        query: (queryArg) => ({ url: `/media/${queryArg.id}` }),
        providesTags: ["Media"],
      }),
      deleteMediaById: build.mutation<
        DeleteMediaByIdApiResponse,
        DeleteMediaByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/media/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Media"],
      }),
      postNewsletterSubscribe: build.mutation<
        PostNewsletterSubscribeApiResponse,
        PostNewsletterSubscribeApiArg
      >({
        query: (queryArg) => ({
          url: `/newsletter/subscribe`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Newsletter"],
      }),
      postNewsletterUnsubscribe: build.mutation<
        PostNewsletterUnsubscribeApiResponse,
        PostNewsletterUnsubscribeApiArg
      >({
        query: (queryArg) => ({
          url: `/newsletter/unsubscribe`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Newsletter"],
      }),
      getNewsletterSubscribers: build.query<
        GetNewsletterSubscribersApiResponse,
        GetNewsletterSubscribersApiArg
      >({
        query: (queryArg) => ({
          url: `/newsletter/subscribers`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
            status: queryArg.status,
          },
        }),
        providesTags: ["Newsletter"],
      }),
      getNewsletterStats: build.query<
        GetNewsletterStatsApiResponse,
        GetNewsletterStatsApiArg
      >({
        query: () => ({ url: `/newsletter/stats` }),
        providesTags: ["Newsletter"],
      }),
      getPlaylists: build.query<GetPlaylistsApiResponse, GetPlaylistsApiArg>({
        query: (queryArg) => ({
          url: `/playlists`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
            platform: queryArg.platform,
            featured: queryArg.featured,
            seriesName: queryArg.seriesName,
            search: queryArg.search,
          },
        }),
        providesTags: ["Playlists"],
      }),
      postPlaylists: build.mutation<
        PostPlaylistsApiResponse,
        PostPlaylistsApiArg
      >({
        query: (queryArg) => ({
          url: `/playlists`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Playlists"],
      }),
      getPlaylistsById: build.query<
        GetPlaylistsByIdApiResponse,
        GetPlaylistsByIdApiArg
      >({
        query: (queryArg) => ({ url: `/playlists/${queryArg.id}` }),
        providesTags: ["Playlists"],
      }),
      putPlaylistsById: build.mutation<
        PutPlaylistsByIdApiResponse,
        PutPlaylistsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/playlists/${queryArg.id}`,
          method: "PUT",
        }),
        invalidatesTags: ["Playlists"],
      }),
      deletePlaylistsById: build.mutation<
        DeletePlaylistsByIdApiResponse,
        DeletePlaylistsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/playlists/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Playlists"],
      }),
      getPlaylistsFeatured: build.query<
        GetPlaylistsFeaturedApiResponse,
        GetPlaylistsFeaturedApiArg
      >({
        query: (queryArg) => ({
          url: `/playlists/featured`,
          params: {
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Playlists"],
      }),
      getPlaylistsPlatformByPlatform: build.query<
        GetPlaylistsPlatformByPlatformApiResponse,
        GetPlaylistsPlatformByPlatformApiArg
      >({
        query: (queryArg) => ({
          url: `/playlists/platform/${queryArg.platform}`,
        }),
        providesTags: ["Playlists"],
      }),
      getPlaylistsSeriesBySeriesName: build.query<
        GetPlaylistsSeriesBySeriesNameApiResponse,
        GetPlaylistsSeriesBySeriesNameApiArg
      >({
        query: (queryArg) => ({
          url: `/playlists/series/${queryArg.seriesName}`,
        }),
        providesTags: ["Playlists"],
      }),
      getProducts: build.query<GetProductsApiResponse, GetProductsApiArg>({
        query: (queryArg) => ({
          url: `/products`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
            category: queryArg.category,
            status: queryArg.status,
            featured: queryArg.featured,
            search: queryArg.search,
            minPrice: queryArg.minPrice,
            maxPrice: queryArg.maxPrice,
          },
        }),
        providesTags: ["Products"],
      }),
      postProducts: build.mutation<PostProductsApiResponse, PostProductsApiArg>(
        {
          query: (queryArg) => ({
            url: `/products`,
            method: "POST",
            body: queryArg.body,
          }),
          invalidatesTags: ["Products"],
        },
      ),
      getProductsById: build.query<
        GetProductsByIdApiResponse,
        GetProductsByIdApiArg
      >({
        query: (queryArg) => ({ url: `/products/${queryArg.id}` }),
        providesTags: ["Products"],
      }),
      putProductsById: build.mutation<
        PutProductsByIdApiResponse,
        PutProductsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/products/${queryArg.id}`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Products"],
      }),
      deleteProductsById: build.mutation<
        DeleteProductsByIdApiResponse,
        DeleteProductsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/products/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Products"],
      }),
      getProductsSlugBySlug: build.query<
        GetProductsSlugBySlugApiResponse,
        GetProductsSlugBySlugApiArg
      >({
        query: (queryArg) => ({ url: `/products/slug/${queryArg.slug}` }),
        providesTags: ["Products"],
      }),
      getProductsFeatured: build.query<
        GetProductsFeaturedApiResponse,
        GetProductsFeaturedApiArg
      >({
        query: (queryArg) => ({
          url: `/products/featured`,
          params: {
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Products"],
      }),
      getProductsCategoryByCategory: build.query<
        GetProductsCategoryByCategoryApiResponse,
        GetProductsCategoryByCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/products/category/${queryArg.category}`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Products"],
      }),
      postProductsVariants: build.mutation<
        PostProductsVariantsApiResponse,
        PostProductsVariantsApiArg
      >({
        query: (queryArg) => ({
          url: `/products/variants`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Products"],
      }),
      putProductsVariantsByVariantId: build.mutation<
        PutProductsVariantsByVariantIdApiResponse,
        PutProductsVariantsByVariantIdApiArg
      >({
        query: (queryArg) => ({
          url: `/products/variants/${queryArg.variantId}`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Products"],
      }),
      deleteProductsVariantsByVariantId: build.mutation<
        DeleteProductsVariantsByVariantIdApiResponse,
        DeleteProductsVariantsByVariantIdApiArg
      >({
        query: (queryArg) => ({
          url: `/products/variants/${queryArg.variantId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Products"],
      }),
      postProductsByProductIdImages: build.mutation<
        PostProductsByProductIdImagesApiResponse,
        PostProductsByProductIdImagesApiArg
      >({
        query: (queryArg) => ({
          url: `/products/${queryArg.productId}/images`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Products"],
      }),
      deleteProductsImagesByImageId: build.mutation<
        DeleteProductsImagesByImageIdApiResponse,
        DeleteProductsImagesByImageIdApiArg
      >({
        query: (queryArg) => ({
          url: `/products/images/${queryArg.imageId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Products"],
      }),
      postProductsByProductIdRecommendationsAndRecommendedProductId:
        build.mutation<
          PostProductsByProductIdRecommendationsAndRecommendedProductIdApiResponse,
          PostProductsByProductIdRecommendationsAndRecommendedProductIdApiArg
        >({
          query: (queryArg) => ({
            url: `/products/${queryArg.productId}/recommendations/${queryArg.recommendedProductId}`,
            method: "POST",
          }),
          invalidatesTags: ["Products"],
        }),
      postSubmissionsContact: build.mutation<
        PostSubmissionsContactApiResponse,
        PostSubmissionsContactApiArg
      >({
        query: (queryArg) => ({
          url: `/submissions/contact`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Submissions"],
      }),
      getSubmissionsContact: build.query<
        GetSubmissionsContactApiResponse,
        GetSubmissionsContactApiArg
      >({
        query: (queryArg) => ({
          url: `/submissions/contact`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
            status: queryArg.status,
          },
        }),
        providesTags: ["Submissions"],
      }),
      getSubmissionsContactById: build.query<
        GetSubmissionsContactByIdApiResponse,
        GetSubmissionsContactByIdApiArg
      >({
        query: (queryArg) => ({ url: `/submissions/contact/${queryArg.id}` }),
        providesTags: ["Submissions"],
      }),
      deleteSubmissionsContactById: build.mutation<
        DeleteSubmissionsContactByIdApiResponse,
        DeleteSubmissionsContactByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/submissions/contact/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Submissions"],
      }),
      patchSubmissionsContactByIdStatus: build.mutation<
        PatchSubmissionsContactByIdStatusApiResponse,
        PatchSubmissionsContactByIdStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/submissions/contact/${queryArg.id}/status`,
          method: "PATCH",
          body: queryArg.body,
        }),
        invalidatesTags: ["Submissions"],
      }),
      postSubmissionsArtist: build.mutation<
        PostSubmissionsArtistApiResponse,
        PostSubmissionsArtistApiArg
      >({
        query: (queryArg) => ({
          url: `/submissions/artist`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Submissions"],
      }),
      getSubmissionsArtist: build.query<
        GetSubmissionsArtistApiResponse,
        GetSubmissionsArtistApiArg
      >({
        query: (queryArg) => ({
          url: `/submissions/artist`,
          params: {
            page: queryArg.page,
            limit: queryArg.limit,
            status: queryArg.status,
            search: queryArg.search,
          },
        }),
        providesTags: ["Submissions"],
      }),
      getSubmissionsArtistById: build.query<
        GetSubmissionsArtistByIdApiResponse,
        GetSubmissionsArtistByIdApiArg
      >({
        query: (queryArg) => ({ url: `/submissions/artist/${queryArg.id}` }),
        providesTags: ["Submissions"],
      }),
      deleteSubmissionsArtistById: build.mutation<
        DeleteSubmissionsArtistByIdApiResponse,
        DeleteSubmissionsArtistByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/submissions/artist/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Submissions"],
      }),
      patchSubmissionsArtistByIdStatus: build.mutation<
        PatchSubmissionsArtistByIdStatusApiResponse,
        PatchSubmissionsArtistByIdStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/submissions/artist/${queryArg.id}/status`,
          method: "PATCH",
          body: queryArg.body,
        }),
        invalidatesTags: ["Submissions"],
      }),
      getSubmissionsStats: build.query<
        GetSubmissionsStatsApiResponse,
        GetSubmissionsStatsApiArg
      >({
        query: () => ({ url: `/submissions/stats` }),
        providesTags: ["Submissions"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as api };
export type GetArticlesApiResponse = unknown;
export type GetArticlesApiArg = {
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Filter by category */
  category?: string;
  /** Exclude articles with this category */
  excludeCategory?: string;
  /** Filter by status */
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  /** Filter by featured */
  featured?: boolean;
  /** Search in title, subtitle, and content */
  search?: string;
};
export type PostArticlesApiResponse = unknown;
export type PostArticlesApiArg = {
  body: {
    title: string;
    subtitle?: string;
    description?: string;
    readTime?: string;
    content: string;
    excerpt?: string;
    heroMediaUrl?: string;
    heroMediaType?: "IMAGE" | "VIDEO";
    category: string;
    tags?: string[];
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    publishDate?: string;
    featured?: boolean;
  };
};
export type GetArticlesBySlugApiResponse = unknown;
export type GetArticlesBySlugApiArg = {
  /** Article slug */
  slug: string;
};
export type GetArticlesIdByIdApiResponse = unknown;
export type GetArticlesIdByIdApiArg = {
  /** Article ID */
  id: string;
};
export type PutArticlesByIdApiResponse = unknown;
export type PutArticlesByIdApiArg = {
  /** Article ID */
  id: string;
  body: object;
};
export type DeleteArticlesByIdApiResponse = unknown;
export type DeleteArticlesByIdApiArg = {
  /** Article ID */
  id: string;
};
export type GetArticlesFeaturedApiResponse = unknown;
export type GetArticlesFeaturedApiArg = {
  /** Number of featured articles to return */
  limit?: number;
};
export type PostArticlesByArticleIdRelatedAndRelatedArticleIdApiResponse =
  unknown;
export type PostArticlesByArticleIdRelatedAndRelatedArticleIdApiArg = {
  articleId: string;
  relatedArticleId: string;
};
export type GetArticlesCategoryByCategoryApiResponse = unknown;
export type GetArticlesCategoryByCategoryApiArg = {
  category: string;
  page?: number;
  limit?: number;
};
export type PostAuthRegisterApiResponse = unknown;
export type PostAuthRegisterApiArg = {
  body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONTRIBUTOR";
  };
};
export type PostAuthLoginApiResponse = unknown;
export type PostAuthLoginApiArg = {
  body: {
    email: string;
    password: string;
  };
};
export type PostAuthRefreshApiResponse = unknown;
export type PostAuthRefreshApiArg = {
  body: {
    refreshToken: string;
  };
};
export type GetAuthMeApiResponse = unknown;
export type GetAuthMeApiArg = void;
export type GetCartApiResponse = unknown;
export type GetCartApiArg = {
  sessionId: string;
};
export type PostCartItemsApiResponse = unknown;
export type PostCartItemsApiArg = {
  body: {
    sessionId: string;
    productVariantId: string;
    quantity?: number;
  };
};
export type PutCartItemsByItemIdApiResponse = unknown;
export type PutCartItemsByItemIdApiArg = {
  itemId: string;
  body: {
    quantity: number;
  };
};
export type DeleteCartItemsByItemIdApiResponse = unknown;
export type DeleteCartItemsByItemIdApiArg = {
  itemId: string;
};
export type PostCartClearApiResponse = unknown;
export type PostCartClearApiArg = {
  body: {
    sessionId: string;
  };
};
export type GetCartSummaryApiResponse = unknown;
export type GetCartSummaryApiArg = {
  sessionId: string;
};
export type GetDjsApiResponse = unknown;
export type GetDjsApiArg = {
  page?: number;
  limit?: number;
  featured?: boolean;
};
export type PostDjsApiResponse = unknown;
export type PostDjsApiArg = {
  body: {
    name: string;
    slug: string;
    bio?: string;
    photoUrl?: string;
    socialLinks?: object;
    featured?: boolean;
  };
};
export type GetDjsByIdApiResponse = unknown;
export type GetDjsByIdApiArg = {
  /** DJ Profile ID */
  id: string;
};
export type PutDjsByIdApiResponse = unknown;
export type PutDjsByIdApiArg = {
  /** DJ Profile ID */
  id: string;
  body: {
    name?: string;
    slug?: string;
    bio?: string;
    photoUrl?: string;
    socialLinks?: object;
    featured?: boolean;
  };
};
export type DeleteDjsByIdApiResponse = unknown;
export type DeleteDjsByIdApiArg = {
  /** DJ Profile ID */
  id: string;
};
export type GetDjsSlugBySlugApiResponse = unknown;
export type GetDjsSlugBySlugApiArg = {
  /** DJ Profile slug */
  slug: string;
};
export type GetDjsFeaturedApiResponse = unknown;
export type GetDjsFeaturedApiArg = {
  /** Number of featured DJs to return */
  limit?: number;
};
export type GetDjsByDjIdMixesApiResponse = unknown;
export type GetDjsByDjIdMixesApiArg = {
  /** DJ Profile ID */
  djId: string;
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
};
export type GetDjsMixesByMixIdApiResponse = unknown;
export type GetDjsMixesByMixIdApiArg = {
  /** Mix ID */
  mixId: string;
};
export type PutDjsMixesByMixIdApiResponse = unknown;
export type PutDjsMixesByMixIdApiArg = {
  /** Mix ID */
  mixId: string;
  body: {
    title?: string;
    seriesNumber?: number;
    description?: string;
    embedUrl?: string;
    platform?: "SPOTIFY" | "APPLE_MUSIC" | "SOUNDCLOUD" | "YOUTUBE";
    duration?: number;
    releaseDate?: string;
  };
};
export type DeleteDjsMixesByMixIdApiResponse = unknown;
export type DeleteDjsMixesByMixIdApiArg = {
  /** Mix ID */
  mixId: string;
};
export type PostDjsMixesApiResponse = unknown;
export type PostDjsMixesApiArg = {
  body: {
    djProfileId: string;
    title: string;
    seriesNumber?: number;
    description?: string;
    embedUrl: string;
    platform: "SPOTIFY" | "APPLE_MUSIC" | "SOUNDCLOUD" | "YOUTUBE";
    /** Duration in seconds */
    duration?: number;
    releaseDate?: string;
  };
};
export type GetEventsApiResponse = unknown;
export type GetEventsApiArg = {
  page?: number;
  limit?: number;
  status?: "UPCOMING" | "PAST";
  featured?: boolean;
  city?: string;
  search?: string;
};
export type PostEventsApiResponse = unknown;
export type PostEventsApiArg = {
  body: {
    title: string;
    description?: string;
    flyerUrl?: string;
    eventDate: string;
    eventTime?: string;
    venue: string;
    location: string;
    city?: string;
    country?: string;
    ticketLink?: string;
    ticketPlatform?: string;
    ticketStatus?: string;
    type?: string;
    status?: "UPCOMING" | "PAST";
    featured?: boolean;
  };
};
export type GetEventsByIdApiResponse = unknown;
export type GetEventsByIdApiArg = {
  id: string;
};
export type PutEventsByIdApiResponse = unknown;
export type PutEventsByIdApiArg = {
  id: string;
  body: {
    title?: string;
    description?: string;
    flyerUrl?: string;
    eventDate?: string;
    eventTime?: string;
    venue?: string;
    location?: string;
    city?: string;
    country?: string;
    ticketLink?: string;
    ticketPlatform?: string;
    status?: "UPCOMING" | "PAST";
    featured?: boolean;
  };
};
export type DeleteEventsByIdApiResponse = unknown;
export type DeleteEventsByIdApiArg = {
  id: string;
};
export type GetEventsUpcomingApiResponse = unknown;
export type GetEventsUpcomingApiArg = {
  page?: number;
  limit?: number;
};
export type GetEventsPastApiResponse = unknown;
export type GetEventsPastApiArg = {
  page?: number;
  limit?: number;
};
export type GetEventsFeaturedApiResponse = unknown;
export type GetEventsFeaturedApiArg = {
  limit?: number;
};
export type PostEventsByEventIdMediaApiResponse = unknown;
export type PostEventsByEventIdMediaApiArg = {
  eventId: string;
  body: {
    mediaUrl: string;
    mediaType: "IMAGE" | "VIDEO";
    caption?: string;
    order?: number;
  };
};
export type DeleteEventsMediaByMediaIdApiResponse = unknown;
export type DeleteEventsMediaByMediaIdApiArg = {
  mediaId: string;
};
export type GetHomepageHeroSlidesApiResponse = unknown;
export type GetHomepageHeroSlidesApiArg = void;
export type PostHomepageHeroSlidesApiResponse = unknown;
export type PostHomepageHeroSlidesApiArg = {
  body: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    linkUrl?: string;
    linkText?: string;
    order: number;
    isActive?: boolean;
  };
};
export type GetHomepageHeroSlidesActiveApiResponse = unknown;
export type GetHomepageHeroSlidesActiveApiArg = void;
export type GetHomepageHeroSlidesByIdApiResponse = unknown;
export type GetHomepageHeroSlidesByIdApiArg = {
  id: string;
};
export type PutHomepageHeroSlidesByIdApiResponse = unknown;
export type PutHomepageHeroSlidesByIdApiArg = {
  id: string;
  body: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    linkUrl?: string;
    linkText?: string;
    order?: number;
    isActive?: boolean;
  };
};
export type DeleteHomepageHeroSlidesByIdApiResponse = unknown;
export type DeleteHomepageHeroSlidesByIdApiArg = {
  id: string;
};
export type PostHomepageHeroSlidesReorderApiResponse = unknown;
export type PostHomepageHeroSlidesReorderApiArg = {
  body: {
    slideOrders: {
      id?: string;
      order?: number;
    }[];
  };
};
export type PatchHomepageHeroSlidesByIdToggleApiResponse = unknown;
export type PatchHomepageHeroSlidesByIdToggleApiArg = {
  id: string;
};
export type PostMediaUploadApiResponse = unknown;
export type PostMediaUploadApiArg = {
  body: {
    file: Blob;
    folder?: string;
    type?: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
    useCloudinary?: boolean;
  };
};
export type GetMediaApiResponse = unknown;
export type GetMediaApiArg = {
  page?: number;
  limit?: number;
  type?: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
};
export type GetMediaByIdApiResponse = unknown;
export type GetMediaByIdApiArg = {
  id: string;
};
export type DeleteMediaByIdApiResponse = unknown;
export type DeleteMediaByIdApiArg = {
  id: string;
};
export type PostNewsletterSubscribeApiResponse = unknown;
export type PostNewsletterSubscribeApiArg = {
  body: {
    email: string;
    name?: string;
    source?: "HOMEPAGE" | "FOOTER" | "POPUP" | "EVENT";
  };
};
export type PostNewsletterUnsubscribeApiResponse = unknown;
export type PostNewsletterUnsubscribeApiArg = {
  body: {
    email: string;
  };
};
export type GetNewsletterSubscribersApiResponse = unknown;
export type GetNewsletterSubscribersApiArg = {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "UNSUBSCRIBED";
};
export type GetNewsletterStatsApiResponse = unknown;
export type GetNewsletterStatsApiArg = void;
export type GetPlaylistsApiResponse = unknown;
export type GetPlaylistsApiArg = {
  page?: number;
  limit?: number;
  platform?: "SPOTIFY" | "APPLE_MUSIC" | "SOUNDCLOUD" | "YOUTUBE";
  featured?: boolean;
  seriesName?: string;
  search?: string;
};
export type PostPlaylistsApiResponse = unknown;
export type PostPlaylistsApiArg = {
  body: object;
};
export type GetPlaylistsByIdApiResponse = unknown;
export type GetPlaylistsByIdApiArg = {
  id: string;
};
export type PutPlaylistsByIdApiResponse = unknown;
export type PutPlaylistsByIdApiArg = {
  id: string;
};
export type DeletePlaylistsByIdApiResponse = unknown;
export type DeletePlaylistsByIdApiArg = {
  id: string;
};
export type GetPlaylistsFeaturedApiResponse = unknown;
export type GetPlaylistsFeaturedApiArg = {
  limit?: number;
};
export type GetPlaylistsPlatformByPlatformApiResponse = unknown;
export type GetPlaylistsPlatformByPlatformApiArg = {
  platform: "SPOTIFY" | "APPLE_MUSIC" | "SOUNDCLOUD" | "YOUTUBE";
};
export type GetPlaylistsSeriesBySeriesNameApiResponse = unknown;
export type GetPlaylistsSeriesBySeriesNameApiArg = {
  seriesName: string;
};
export type GetProductsApiResponse = unknown;
export type GetProductsApiArg = {
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Filter by category */
  category?: string;
  /** Filter by status */
  status?: "ACTIVE" | "SOLD_OUT" | "ARCHIVED";
  /** Filter by featured */
  featured?: boolean;
  /** Search in product name and description */
  search?: string;
  /** Minimum price filter */
  minPrice?: number;
  /** Maximum price filter */
  maxPrice?: number;
};
export type PostProductsApiResponse = unknown;
export type PostProductsApiArg = {
  body: {
    name: string;
    slug: string;
    description?: string;
    category: string;
    basePrice: number;
    currency?: string;
    featured?: boolean;
    status?: "ACTIVE" | "SOLD_OUT" | "ARCHIVED";
  };
};
export type GetProductsByIdApiResponse = unknown;
export type GetProductsByIdApiArg = {
  /** Product ID */
  id: string;
};
export type PutProductsByIdApiResponse = unknown;
export type PutProductsByIdApiArg = {
  /** Product ID */
  id: string;
  body: {
    name?: string;
    slug?: string;
    description?: string;
    category?: string;
    basePrice?: number;
    featured?: boolean;
    status?: "ACTIVE" | "SOLD_OUT" | "ARCHIVED";
  };
};
export type DeleteProductsByIdApiResponse = unknown;
export type DeleteProductsByIdApiArg = {
  /** Product ID */
  id: string;
};
export type GetProductsSlugBySlugApiResponse = unknown;
export type GetProductsSlugBySlugApiArg = {
  /** Product slug */
  slug: string;
};
export type GetProductsFeaturedApiResponse = unknown;
export type GetProductsFeaturedApiArg = {
  /** Number of featured products to return */
  limit?: number;
};
export type GetProductsCategoryByCategoryApiResponse = unknown;
export type GetProductsCategoryByCategoryApiArg = {
  /** Product category */
  category: string;
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
};
export type PostProductsVariantsApiResponse = unknown;
export type PostProductsVariantsApiArg = {
  body: {
    productId: string;
    sku: string;
    size?: string;
    color?: string;
    price: number;
    stockQuantity?: number;
  };
};
export type PutProductsVariantsByVariantIdApiResponse = unknown;
export type PutProductsVariantsByVariantIdApiArg = {
  /** Variant ID */
  variantId: string;
  body: {
    size?: string;
    color?: string;
    price?: number;
    stockQuantity?: number;
  };
};
export type DeleteProductsVariantsByVariantIdApiResponse = unknown;
export type DeleteProductsVariantsByVariantIdApiArg = {
  /** Variant ID */
  variantId: string;
};
export type PostProductsByProductIdImagesApiResponse = unknown;
export type PostProductsByProductIdImagesApiArg = {
  /** Product ID */
  productId: string;
  body: {
    imageUrl: string;
    isPrimary?: boolean;
    order?: number;
  };
};
export type DeleteProductsImagesByImageIdApiResponse = unknown;
export type DeleteProductsImagesByImageIdApiArg = {
  /** Image ID */
  imageId: string;
};
export type PostProductsByProductIdRecommendationsAndRecommendedProductIdApiResponse =
  unknown;
export type PostProductsByProductIdRecommendationsAndRecommendedProductIdApiArg =
  {
    /** Product ID */
    productId: string;
    /** Recommended Product ID */
    recommendedProductId: string;
  };
export type PostSubmissionsContactApiResponse = unknown;
export type PostSubmissionsContactApiArg = {
  body: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    submissionType?: "GENERAL" | "ARTIST" | "DJ" | "DESIGNER";
  };
};
export type GetSubmissionsContactApiResponse = unknown;
export type GetSubmissionsContactApiArg = {
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Filter by status */
  status?: "NEW" | "REVIEWED" | "ARCHIVED";
};
export type GetSubmissionsContactByIdApiResponse = unknown;
export type GetSubmissionsContactByIdApiArg = {
  /** Submission ID */
  id: string;
};
export type DeleteSubmissionsContactByIdApiResponse = unknown;
export type DeleteSubmissionsContactByIdApiArg = {
  /** Submission ID */
  id: string;
};
export type PatchSubmissionsContactByIdStatusApiResponse = unknown;
export type PatchSubmissionsContactByIdStatusApiArg = {
  /** Submission ID */
  id: string;
  body: {
    status: "NEW" | "REVIEWED" | "ARCHIVED";
  };
};
export type PostSubmissionsArtistApiResponse = unknown;
export type PostSubmissionsArtistApiArg = {
  body: {
    name: string;
    email: string;
    /** artist, dj, designer */
    role: string;
    bio?: string;
    /** JSON object with portfolio URLs */
    portfolioLinks?: object;
    /** JSON object with social media handles */
    socialMedia?: object;
    pitchMessage: string;
    /** Array of attachment URLs */
    attachments?: string[];
  };
};
export type GetSubmissionsArtistApiResponse = unknown;
export type GetSubmissionsArtistApiArg = {
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Filter by status */
  status?: "NEW" | "REVIEWED" | "ARCHIVED";
  /** Search by name or email */
  search?: string;
};
export type GetSubmissionsArtistByIdApiResponse = unknown;
export type GetSubmissionsArtistByIdApiArg = {
  /** Submission ID */
  id: string;
};
export type DeleteSubmissionsArtistByIdApiResponse = unknown;
export type DeleteSubmissionsArtistByIdApiArg = {
  /** Submission ID */
  id: string;
};
export type PatchSubmissionsArtistByIdStatusApiResponse = unknown;
export type PatchSubmissionsArtistByIdStatusApiArg = {
  /** Submission ID */
  id: string;
  body: {
    status: "NEW" | "REVIEWED" | "ARCHIVED";
  };
};
export type GetSubmissionsStatsApiResponse = unknown;
export type GetSubmissionsStatsApiArg = void;
export const {
  useGetArticlesQuery,
  useLazyGetArticlesQuery,
  usePostArticlesMutation,
  useGetArticlesBySlugQuery,
  useLazyGetArticlesBySlugQuery,
  useGetArticlesIdByIdQuery,
  useLazyGetArticlesIdByIdQuery,
  usePutArticlesByIdMutation,
  useDeleteArticlesByIdMutation,
  useGetArticlesFeaturedQuery,
  useLazyGetArticlesFeaturedQuery,
  usePostArticlesByArticleIdRelatedAndRelatedArticleIdMutation,
  useGetArticlesCategoryByCategoryQuery,
  useLazyGetArticlesCategoryByCategoryQuery,
  usePostAuthRegisterMutation,
  usePostAuthLoginMutation,
  usePostAuthRefreshMutation,
  useGetAuthMeQuery,
  useLazyGetAuthMeQuery,
  useGetCartQuery,
  useLazyGetCartQuery,
  usePostCartItemsMutation,
  usePutCartItemsByItemIdMutation,
  useDeleteCartItemsByItemIdMutation,
  usePostCartClearMutation,
  useGetCartSummaryQuery,
  useLazyGetCartSummaryQuery,
  useGetDjsQuery,
  useLazyGetDjsQuery,
  usePostDjsMutation,
  useGetDjsByIdQuery,
  useLazyGetDjsByIdQuery,
  usePutDjsByIdMutation,
  useDeleteDjsByIdMutation,
  useGetDjsSlugBySlugQuery,
  useLazyGetDjsSlugBySlugQuery,
  useGetDjsFeaturedQuery,
  useLazyGetDjsFeaturedQuery,
  useGetDjsByDjIdMixesQuery,
  useLazyGetDjsByDjIdMixesQuery,
  useGetDjsMixesByMixIdQuery,
  useLazyGetDjsMixesByMixIdQuery,
  usePutDjsMixesByMixIdMutation,
  useDeleteDjsMixesByMixIdMutation,
  usePostDjsMixesMutation,
  useGetEventsQuery,
  useLazyGetEventsQuery,
  usePostEventsMutation,
  useGetEventsByIdQuery,
  useLazyGetEventsByIdQuery,
  usePutEventsByIdMutation,
  useDeleteEventsByIdMutation,
  useGetEventsUpcomingQuery,
  useLazyGetEventsUpcomingQuery,
  useGetEventsPastQuery,
  useLazyGetEventsPastQuery,
  useGetEventsFeaturedQuery,
  useLazyGetEventsFeaturedQuery,
  usePostEventsByEventIdMediaMutation,
  useDeleteEventsMediaByMediaIdMutation,
  useGetHomepageHeroSlidesQuery,
  useLazyGetHomepageHeroSlidesQuery,
  usePostHomepageHeroSlidesMutation,
  useGetHomepageHeroSlidesActiveQuery,
  useLazyGetHomepageHeroSlidesActiveQuery,
  useGetHomepageHeroSlidesByIdQuery,
  useLazyGetHomepageHeroSlidesByIdQuery,
  usePutHomepageHeroSlidesByIdMutation,
  useDeleteHomepageHeroSlidesByIdMutation,
  usePostHomepageHeroSlidesReorderMutation,
  usePatchHomepageHeroSlidesByIdToggleMutation,
  usePostMediaUploadMutation,
  useGetMediaQuery,
  useLazyGetMediaQuery,
  useGetMediaByIdQuery,
  useLazyGetMediaByIdQuery,
  useDeleteMediaByIdMutation,
  usePostNewsletterSubscribeMutation,
  usePostNewsletterUnsubscribeMutation,
  useGetNewsletterSubscribersQuery,
  useLazyGetNewsletterSubscribersQuery,
  useGetNewsletterStatsQuery,
  useLazyGetNewsletterStatsQuery,
  useGetPlaylistsQuery,
  useLazyGetPlaylistsQuery,
  usePostPlaylistsMutation,
  useGetPlaylistsByIdQuery,
  useLazyGetPlaylistsByIdQuery,
  usePutPlaylistsByIdMutation,
  useDeletePlaylistsByIdMutation,
  useGetPlaylistsFeaturedQuery,
  useLazyGetPlaylistsFeaturedQuery,
  useGetPlaylistsPlatformByPlatformQuery,
  useLazyGetPlaylistsPlatformByPlatformQuery,
  useGetPlaylistsSeriesBySeriesNameQuery,
  useLazyGetPlaylistsSeriesBySeriesNameQuery,
  useGetProductsQuery,
  useLazyGetProductsQuery,
  usePostProductsMutation,
  useGetProductsByIdQuery,
  useLazyGetProductsByIdQuery,
  usePutProductsByIdMutation,
  useDeleteProductsByIdMutation,
  useGetProductsSlugBySlugQuery,
  useLazyGetProductsSlugBySlugQuery,
  useGetProductsFeaturedQuery,
  useLazyGetProductsFeaturedQuery,
  useGetProductsCategoryByCategoryQuery,
  useLazyGetProductsCategoryByCategoryQuery,
  usePostProductsVariantsMutation,
  usePutProductsVariantsByVariantIdMutation,
  useDeleteProductsVariantsByVariantIdMutation,
  usePostProductsByProductIdImagesMutation,
  useDeleteProductsImagesByImageIdMutation,
  usePostProductsByProductIdRecommendationsAndRecommendedProductIdMutation,
  usePostSubmissionsContactMutation,
  useGetSubmissionsContactQuery,
  useLazyGetSubmissionsContactQuery,
  useGetSubmissionsContactByIdQuery,
  useLazyGetSubmissionsContactByIdQuery,
  useDeleteSubmissionsContactByIdMutation,
  usePatchSubmissionsContactByIdStatusMutation,
  usePostSubmissionsArtistMutation,
  useGetSubmissionsArtistQuery,
  useLazyGetSubmissionsArtistQuery,
  useGetSubmissionsArtistByIdQuery,
  useLazyGetSubmissionsArtistByIdQuery,
  useDeleteSubmissionsArtistByIdMutation,
  usePatchSubmissionsArtistByIdStatusMutation,
  useGetSubmissionsStatsQuery,
  useLazyGetSubmissionsStatsQuery,
} = injectedRtkApi;
