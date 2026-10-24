import { useState } from "react";
import { Link } from "react-router-dom";

import { addToCart } from "./cart.js";


function Productcard({ ttle, prc, img, alt, currency, handle, variantId }) {
const [count, setCount] = useState(0);


//alert(variantId);





//cart function

    async function custatc() {

        try{


            const cartms = await addToCart(variantId);

            console.log("cart is ready", cartms.totalQuantity, cartms);


        } catch(e){

            console.log(e.message);

        }


        
    }

//cart function





    return (

        <div>

            
{img && (

<img src={img} alt={alt} width={200} height={200} />

)}

           
            <h2>{ttle}</h2>

            <p>
                {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: currency || "INR"
                }).format(Number(prc))}
            </p>

            
      <button onClick={custatc}>
    Add ({count})
</button>
<Link to={`/products/${handle}`}>

View Details</Link>

        </div>

    );






    

}



export default Productcard;