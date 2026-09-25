import CollectionsPage from '../page';

export default function CollectionSlugPage({ params, searchParams }) {
  const categorySlug = params?.slug;
  const mergedParams = {
    ...searchParams,
    category: categorySlug || searchParams?.category || 'all'
  };

  return <CollectionsPage searchParams={mergedParams} />;
}
