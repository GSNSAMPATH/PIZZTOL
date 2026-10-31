import ProductForm from "@/app/components/admin/ProductForm";


interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  return (
    <ProductForm
      productId={Number(id)}
    />
  );
}