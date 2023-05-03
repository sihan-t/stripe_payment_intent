import express, { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
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

    const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: setupIntent.client_secret });
});

app.get("/success", (req: Request, res: Response) => {
    console.log(req.query);
    res.status(200).send({ message: "success" });
});

app.listen(8000, () => {
    console.log("App running on port 8000");
});
