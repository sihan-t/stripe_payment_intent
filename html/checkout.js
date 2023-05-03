// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
(async () => {
    const response = await fetch("http://localhost:8000/test", {
        method: "POST",
        body: {
            email: "sihantawsik@gmail.com",
        },
    });
    const { clientSecret } = await response.json();
    // Render the form using the clientSecret
    const stripe = Stripe(
        "pk_test_51LeeVOEZvu2PhHkDvDWvKDzUeETEvYP2V6Y3sVyOZ0MIK5C6h0qCt4NlpFTOeiCr9uT3iVV45bX3Z3ZJJ7ODhYxw00sYpl6UlP"
    );

    const options = {
        clientSecret: clientSecret,
        // Fully customizable with appearance API.
        appearance: {
            theme: "night",
            labels: "floating",
        },
    };

    // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 3
    const elements = stripe.elements(options);

    // Create and mount the Payment Element
    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");

    const form = document.getElementById("payment-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const { error } = await stripe.confirmSetup({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: "http://localhost:8000/success",
            },
        });

        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            const messageContainer = document.querySelector("#error-message");
            messageContainer.textContent = error.message;
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    });
})();
