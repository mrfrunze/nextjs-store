import { fetchUserFavorites } from '@/utils/actions';
import SectionTitle from '@/components/global/SectionTitle';
import ProductsGrid from '@/components/products/ProductsGrid';


async function FavoritesPage() {
  const favorites = await fetchUserFavorites();
  if (favorites.length === 0) return <SectionTitle text='You have no favorites yet.' />;

  const titleText = favorites.length === 1
      ? `Favorite ${favorites.length} product`
      : `Favorites ${favorites.length} products`;
  return (
    <div>
       <SectionTitle text={titleText} />
       <ProductsGrid products={favorites.map((favorite) => favorite.product)} />
    </div>
  )
}

export default FavoritesPage