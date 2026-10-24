import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Productcard from "./productcard.jsx";

function CollectionPage() {
    const { handle } = useParams();

    const [collect, setCollect] = useState(null);
    const [load, setLoad] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        async function getCollpage() {
            try {
                setLoad(true);

                const rsp = await fetch(
                    `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2026-10/graphql.json`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Shopify-Storefront-Access-Token":
                                import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
                        },
                        body: JSON.stringify({
                            query: `
                                query ($handle: String!) {
                                    collection(handle: $handle) {
                                        title
                                        products(first: 50) {
                                            edges {
                                                node {
                                                    id
                                                    title
                                                    handle
                                                    featuredImage {
                                                        url
                                                        altText
                                                    }
                                                    priceRange {
                                                        minVariantPrice {
                                                            amount
                                                            currencyCode
                                                        }
                                                    }

                                                    variants(first: 1) {
    edges {
        node {
            id
        }
    }
}

                                                }
                                            }
                                        }
                                    }
                                }
                            `,
                            variables: { handle: handle },
                        }),
                    }
                );

                const rslt = await rsp.json();

                if (rslt.errors) {
                    throw new Error(rslt.errors[0].message);
                }

                setCollect(rslt.data.collection);
            } catch (e) {
                setErr(e.message);
            } finally {
                setLoad(false);
            }
        }

        getCollpage();
    }, [handle]);

    if (load) return <p>Loading...</p>;
    if (err) return <p>Error: {err}</p>;
    if (!collect) return <p>Collection not found</p>;

    const prdcts = collect.products.edges.map((edge) => edge.node);

    return (
        <div>
            <Link to="/">Back to Home</Link>

            <h1>{collect.title}</h1>

            {prdcts.length === 0 && <p>Is collection me koi product nahi</p>}

            <div className="product-list">
                {prdcts.map((prod) => (
                    <Productcard
                        key={prod.id}
                        ttle={prod.title}
                        prc={prod.priceRange.minVariantPrice.amount}
                        currency={prod.priceRange.minVariantPrice.currencyCode}
                        img={prod.featuredImage?.url}
                        alt={prod.featuredImage?.altText || prod.title}
                        handle={prod.handle}
                        variantId={prod.variants.edges[0].node.id}
                    />
                ))}
            </div>
        </div>
    );
}

export default CollectionPage;