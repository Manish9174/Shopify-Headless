import { Link, useParams } from "react-router-dom";

function ProductDetails({ products, loading, error }) {
    const { handle } = useParams();

    if (loading) {
        return <p>Loading product details...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const product = products.find(
        (prod) => prod.handle === handle
    );

    

    if (!product) {
        return (
            <div>
                <h2>Product not found</h2>
                <Link to="/">Back to products</Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/">← Back to products</Link>

            {product.featuredImage?.url && (
                <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    width={300}
                />
            )}

            <h1>{product.title}</h1>

            <p>
                {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: product.priceRange.minVariantPrice.currencyCode
                }).format(
                    Number(product.priceRange.minVariantPrice.amount)
                )}
            </p>

            <p>Product handle: {product.handle}</p>
        </div>
    );
}

export default ProductDetails;