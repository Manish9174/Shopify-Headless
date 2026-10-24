import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Link } from "react-router-dom";

function CollectionSlider() {
    const [collcts, setColl] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getCollect() {
            try {
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
                                query {
                                    collections(first: 50) {
                                        edges {
                                            node {
                                                id
                                                title
                                                handle
                                                image {
                                                    url
                                                    altText
                                                }
                                            }
                                        }
                                    }
                                }
                            `,
                        }),
                    }
                );

                const rslt = await rsp.json();

                if (rslt.errors) {
                    throw new Error(rslt.errors[0].message);
                }

                const lst = rslt.data.collections.edges.map((edge) => edge.node);
                setColl(lst);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        getCollect();
    }, []);

    if (loading) return <p>Loading collections...</p>;
    if (error) return <p>Error: {error}</p>;
    if (collcts.length === 0) return <p>No collections found</p>;

    return (
        <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={10}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
        >
            {collcts.map((coll) => (
                <SwiperSlide key={coll.id}>
                    <Link to={`/collections/${coll.handle}`}>
                    {coll.image?.url && (
                        <img
                            src={coll.image.url}
                            alt={coll.image.altText || coll.title}
                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                        />
                    )}
                    <h3>{coll.title}</h3>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default CollectionSlider;