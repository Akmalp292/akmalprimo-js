# AkmalPrimo

A simple web app to check if a number is prime.
If the number is not prime, it shows the smallest number that can divide it.
For example, '77 is not prime because 7 can divide it'.

Demo: https://akmalprimo-js.vercel.app

## How it works

A prime number is a number bigger than 1. Only 1 and the number itself can divide it.

This is how I check a number n:

1. If n is 0 or 1, it is not prime. If n is 2 or 3, it is prime.
2. If 2 or 3 can divide n, it is not prime.
3. Next, I only try numbers like 5, 7, 11, 13, 17, 19 and so on.
   They all look like 6k - 1 or 6k + 1. I skip the other numbers because 2 or 3 can already divide them.
4. I stop at √n. If n = a × b, one of them is always √n or smaller.
5. The first number that can divide n is the smallest factor.

If the number is very big, this loop is too slow.
So I use another method called the Miller-Rabin test. It is much faster for big numbers.

I also use BigInt for all numbers. Normal numbers in JavaScript are not correct after about 16 digits.

## The main code

This is the most important part of `script.js`:

```js
function checkPrime(n) {
  if (n < 2n) return { isPrime: false, smallestFactor: null };
  if (n < 4n) return { isPrime: true, smallestFactor: null };
  if (n % 2n === 0n) return { isPrime: false, smallestFactor: 2n };
  if (n % 3n === 0n) return { isPrime: false, smallestFactor: 3n };

  for (let i = 5n; i * i <= n; i += 6n) {
    if (i > TRIAL_LIMIT) return { isPrime: passesMillerRabin(n), smallestFactor: null };
    if (n % i === 0n) return { isPrime: false, smallestFactor: i };
    if (n % (i + 2n) === 0n) return { isPrime: false, smallestFactor: i + 2n };
  }

  return { isPrime: true, smallestFactor: null };
}
```

`i` starts at 5 and goes up by 6 each time (5, 11, 17, ...).
In each loop, I check `i` and `i + 2`.
`i * i <= n` means "stop at √n". I use it so I don't need decimal numbers.

## Tools

No library, no npm, no build step.

- `index.html` - the page
- `style.css` - the design
- `script.js` - the prime check and the code that changes the page

## How to run

Open `index.html` in your browser.
