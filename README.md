Nothing really special, just another random project that uses Typescript and NextJS (actually, I am learning Typescript here) because [@mamane19](https://github.com/mamane19) is advocating way too much for typescript and I want to see what's so special about this language.

---

_<p align='center'> This app is deployed on vercel, you can check it [here](https://currencies-swart.vercel.app).</p>_

---
## What is this ?
This is a not so special React app that provides the user with an interface where they can make currency conversions and also get the exchange rates between two currencies for the last 30 days in a chart cause charts are beautiful.

## How does it work ?
The app is using [Alphavantage](https://alphavantage.co)'s API to make the conversions and get the exchange rates; good old [localStorage](https://javascript.info/localstorage) to cache the data cause we don't wanna make too many requests to the API; and [ChartJS](https://www.chartjs.org/) to display the data in a stunning graph(again because charts are gorgeous).

We are using [NextJS](https://nextjs.org/) cause it's super fast and easy to use, and Typescript cause it reminds me of the perfect language which is [Dart](https://dart.dev).

## Getting Started
After cloning the repository, you will need to create  a `.env` file in the root directory of the project and create the environment variables specified in the `.env.example` file.


>Note: You can get an API key on [Alphavantage](https://alphavantage.co)'s website.

**Install the dependencies:**
```bash
npm install
#or
yarn
```

**Run the development server:**


```bash
npm run dev
# or
yarn dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
