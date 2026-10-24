import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getcartpage } from "./cart.js";



function moneyms(amount, currency) {
    
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency,
    }).format(Number(amount));


}


function cartmsPage() {

    const [cartms, setmsCart] = useState(null);
    const [loadms, setmsLoad] = useState(true);
    const [errms, setmsErr] = useState(null);


    useEffect(() => {


        async function loadmsCart() {

            try {


                const datams = await getcartpage();

                setmsCart(datams);



            } catch (ee) {

                setmsErr(ee.message);   

            } finally {


                setmsLoad(false);

            }
            
        }


        loadmsCart();


    }, []);


        if (loadms) return <p>Loading cart...</p>;
    if (errms) return <p>Error: {error}</p>;

    if (!cartms || cartms.totalQuantity === 0) {
        return (
            <div>
                <p>Cart is empty</p>
                <Link to="/">Shopping</Link>
            </div>
        );
    }


    const  itemsms = cartms.lines.edges.map((edge) => edge.node);

        return(


            <div>
                <Link to="/"> Back To products </Link>

                <h1>Your Cart</h1>
                <div>

                {itemsms.map((cartitem) => (

                    <div key={cartitem.id}>

                        {cartitem.merchandise.image?.url && (

                              <img
                            src={cartitem.merchandise.image.url}
                            alt={cartitem.merchandise.image.altText || cartitem.merchandise.product.title}
                            width={80}
                        />
                        )}


                           <h3>{cartitem.merchandise.product.title}</h3>
                    <p>Variant: {cartitem.merchandise.title}</p>
                    <p>Quantity: {cartitem.quantity}</p>


                       <p>
                        {moneyms(
                            cartitem.cost.totalAmount.amount,
                            cartitem.cost.totalAmount.currencyCode
                        )}
                    </p>

                    </div>


                ))}

                <h2>
                    Total:{" "}

                    {moneyms (

                        cartms.cost.totalAmount.amount,
                        cartms.cost.totalAmount.currencyCode

                    )}
                </h2>


            <a href={cartms.checkoutUrl}>Checkout</a>



</div>
            </div>


        );




}



export default cartmsPage;