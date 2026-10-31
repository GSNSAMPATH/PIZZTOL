import PerfumeDetails from "@/app/components/Products/PerfumeDetails";
import ProductDetails from "@/app/components/Products/ProductDetails";


const API_URL = "http://localhost:3000";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: Props) {
  const { id } = await params;

  const response = await fetch(
    `${API_URL}/api/products?id=${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          Product not found.
        </p>
      </div>
    );
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          Product not found.
        </p>
      </div>
    );
  }

  const product = result.data;

  // Perfume page
  if (
    product.category?.slug ===
    "perfumes"
  ) {
    return (
      <PerfumeDetails
        product={product}
      />
    );
  }

  // T-Shirt page
  return (
    <ProductDetails
      product={product}
    />
  );
}