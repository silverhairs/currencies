An app to check exchange rates for currencies.
Nothing really special, just a fun project to learn Typescript + NextJS because [@mamane19](https://github.com/mamane19) is advocating way too much for typescript and I want to see what's so special about this language.

---

_<p align='center'> This app is deployed on vercel, you can check it [here](https://currencies-swart.vercel.app).</p>_

---
## How it works:
We are using [Alphavantage](https://alphavantage.co)'s API to get live exchange rates; and local storage to minimise the amount of requests sent. For the chart(or incoming chart depending on when you are reading this), well, I don't know yet... we'll see.

The app is currently live on https://currencies-swart.vercel.app.

## Getting Started
This is a basic NextJS App; after cloning the repository, you will need to create  a `.env` file in the root directory of the project and create the environment variables specified in the `.env.example` file.


>Note: To get an API key, you need to go on [Alphavantage](https://alphavantage.co)'s website; it's free(I think 🤔).


**Run the development server:**


```bash
npm run dev
# or
yarn dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

