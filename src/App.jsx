import Headms from "./head.jsx";
import Productcard from "./productcard.jsx";
import {useEffect, useState} from "react";
import { Routes, Route, Link} from "react-router-dom";
import ProductDetails from "./ProductDetails.jsx";
import CollectionSlider from "./CollectionSlider.jsx";
import "./App.css";
import CollectionPage from "./CollectionPage.jsx";
import CartmsPage from "./CartPage.jsx";

function App() {

    const namems = "DemoMS";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {

        async function getProducts(){

            try{


                const resp = await fetch(
                    `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2026-10/graphql.json`,

                    {

                        method:"POST",
                        headers:{
                            "Content-Type":"application/json",
                            "X-Shopify-Storefront-Access-Token": import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
                        },

                        body:JSON.stringify({

                           query: `
    query {
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
`

                        })
                    }
                );


                const relt = await resp.json();

        if (!resp.ok || relt.errors) {
                    throw new Error(
                        relt.errors?.[0]?.message ||
                        "Shopify API request failed"
                    );
                }


                const shopifyProd = relt.data.products.edges.map((edge) => edge.node);

                setProducts(shopifyProd);

                

            }

            catch (error) {
                setError(error.message);
            } finally {

                setLoading(false);
        }
    }


    getProducts();



    }, []);



    return (
       



        <Routes>

            <Route 

            path="/"
            element={

                <div>
                    <Headms maintitle="My headless Shopify Store" namettle="Shopify Product fetching"
                    
                    />

                    <h1>
                        Hello{namems}
                        
                    </h1>
                    <p>Welcome to our app!</p>
                    <Link to="/cart">Go to Cart</Link>

                    <CollectionSlider/>

                    {loading && <p>Loading products...</p>}

                    {error && <p>Error :{error}</p>}

                    {!loading && !error && products.length === 0 &&  (
                        <p>No Products found</p>
                    )}


                    <div className="product-list">
                        {products.map(prodnew => (

                            <Productcard
                            key={prodnew.id}
                            ttle={prodnew.title}
                            prc={prodnew.priceRange.minVariantPrice.amount}
                            currency={prodnew.priceRange.minVariantPrice.currencyCode}
                            img={prodnew.featuredImage?.url}
                            alt={prodnew.featuredImage?.altText || prodnew.title}
                            handle={prodnew.handle}
                            variantId={prodnew.variants.edges[0].node.id}
                            />
                        ))}
                    </div>

                </div>
            }
            
            />


            <Route
            
            path="/products/:handle"
            element={
            
            <ProductDetails products={products}
            loading={loading}
            error={error}
            />
        
        
        }

            />



            <Route path="/collections/:handle" element={<CollectionPage />} />


            <Route path="/cart" element={<CartmsPage />} />



        </Routes>
    );
}

export default App;