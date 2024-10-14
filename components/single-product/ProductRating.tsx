import { FaStar } from 'react-icons/fa';
import { fetchProductRating } from '@/utils/actions';


const ProductRating = async ({ productId }: { productId: string }) => {
  
  const {count, rating} = await fetchProductRating(productId)

  // const rating = 4.2;
  // const count = 25;

  const className = `flex gap-1 items-center text-md mt-1 mb-4`;
  const countValue = `(${count}) reviews`;

  return (
    <span className={className}>
      <FaStar className='w-3 h-3' />
      {rating} {countValue}
    </span>
  )
}

export default ProductRating