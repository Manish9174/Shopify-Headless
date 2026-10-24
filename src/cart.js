

export async function shopifyFetch(query, variables) {

    

        const resp = await fetch(

        `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2026-10/graphql.json`,

                {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token":
                    import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
            },

                        body: JSON.stringify({ query, variables }),
        }
    );


        const result = await resp.json();

            if (result.errors) {
        throw new Error(result.errors[0].message);
    }

        return result.data;


}


export async function createCart(variantId) {


    const query = `
    
        mutation cartCreate($input: CartInput) {
        
         cartCreate(input: $input) {

            cart {
            
                id
                checkoutUrl      
                totalQuantity      
            }

            

            userErrors {

                field
                message
            
            }
        
        }
        
    }
    
    `;


        const variables = {
        input: {
            lines: [{ merchandiseId: variantId, quantity: 1 }],
        },
    };


        const data = await shopifyFetch(query, variables);


            const errors = data.cartCreate.userErrors;
    if (errors.length > 0) {
        throw new Error(errors[0].message);
    }


        const cart = data.cartCreate.cart;
    localStorage.setItem("cartId", cart.id);
    return cart;
}


export async function addLines(cartId, variantId) {



    const query = `
    
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        
            cartLinesAdd(cartId: $cartId, lines: $lines) {
            
                cart {
                
                    id
                    checkoutUrl
                    totalQuantity
                
                }

                userErrors {
                
                    field
                    message
                
                }
            
            }

        }

    `;


        const variables = {
        cartId: cartId,
        lines: [{ merchandiseId: variantId, quantity: 1 }],
    };

        const data = await shopifyFetch(query, variables);

    const errors = data.cartLinesAdd.userErrors;
    if (errors.length > 0) {
        throw new Error(errors[0].message);
    }

    return data.cartLinesAdd.cart;
}


export async function addToCart(variantId) {
    const cartId = localStorage.getItem("cartId");



        if (!cartId) {
        return await createCart(variantId);
    }



        try {
        return await addLines(cartId, variantId);
    } catch (e) {
        localStorage.removeItem("cartId");
        return await createCart(variantId);
    }
}



export async function getcartpage() {

    const cartmsId = localStorage.getItem("cartId");


    if(!cartmsId) return null;



    const querycart = `
    
        query getCart($cartmsId: ID!) {
        
            cart(id: $cartmsId) {
            
                id
                checkoutUrl
                totalQuantity

                 cost {
                
                    totalAmount {
                    
                        amount
                        currencyCode
                    
                    }
                
                 }


                 lines(first: 50) {

                    edges {
                    
                        node {
                        
                            id
                            quantity
                            cost {
                            
                            totalAmount {
                            
                                amount
                                currencyCode
                                
                            
                            }
                            
                        }

                        merchandise {
                        
                        ... on ProductVariant {
                        
                                    id
                                    title
                                    image {
                                    
                                        url
                                        altText
                                    
                                    }

                                    product {
                                    
                                        title
                                        handle
                                    
                                    }
                                                     
                        
                        }
                        
                    }
                        
                  }
                    
                }

                 
             }

            
            }
        
        }  
    
    `;


const datams = await shopifyFetch(querycart, { cartmsId: cartmsId });

    return datams.cart;



}