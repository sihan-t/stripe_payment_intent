import express, { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2022-11-15",
});

app.post("/test", async (req: Request, res: Response) => {
    let customer = null;
    let customers = (
        await stripe.customers.search({ query: `email:"${req.body.email}"` })
    ).data;
    if (customers.length === 0) {
        customer = await stripe.customers.create({
            email: req.body.email,
            source: "tok_visa",
        });
    } else {
        customer = customers[0];
    }
    res.status(200).json(customer);
});

app.listen(8000, () => {
    console.log("App running on port 8000");
});
