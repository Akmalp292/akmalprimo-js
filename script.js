// ---------- Logic ----------

const MAX_DIGITS = 24;
const TRIAL_LIMIT = 1000000n;
const MILLER_RABIN_BASES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n];

function validate(rawInput) {
  const text = rawInput.trim();

  if (text === '') return { ok: false, message: 'Please enter a number.' };
  if (text.startsWith('-')) return { ok: false, message: 'Negative numbers are not allowed.' };
  if (/[.,]/.test(text)) {
    return { ok: false, message: 'Please enter a whole number without decimals.' };
  }
  if (!/^\d+$/.test(text)) return { ok: false, message: 'Only digits 0-9 are allowed.' };

  const digits = text.replace(/^0+(?=\d)/, '');
  if (digits.length > MAX_DIGITS) {
    return { ok: false, message: `Please enter at most ${MAX_DIGITS} digits.` };
  }

  return { ok: true, value: BigInt(digits) };
}

function modPow(base, exponent, modulus) {
  let result = 1n;
  let b = base % modulus;
  let e = exponent;

  while (e > 0n) {
    if (e % 2n === 1n) result = (result * b) % modulus;
    b = (b * b) % modulus;
    e /= 2n;
  }

  return result;
}

function passesMillerRabin(n) {
  let d = n - 1n;
  let s = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    s++;
  }

  for (const base of MILLER_RABIN_BASES) {
    let x = modPow(base, d, n);
    if (x === 1n || x === n - 1n) continue;

    let isComposite = true;
    for (let round = 1; round < s; round++) {
      x = (x * x) % n;
      if (x === n - 1n) {
        isComposite = false;
        break;
      }
    }

    if (isComposite) return false;
  }

  return true;
}

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

function explain(n, { isPrime, smallestFactor }) {
  if (isPrime) {
    return { title: `${n} is prime`, detail: 'It is only divisible by 1 and itself.' };
  }
  if (n < 2n) {
    return { title: `${n} is not prime`, detail: 'Prime numbers must be greater than 1.' };
  }
  if (smallestFactor === null) {
    return {
      title: `${n} is not prime`,
      detail: 'It has no small factor, but the Miller-Rabin test shows it is not prime.',
    };
  }
  return {
    title: `${n} is not prime`,
    detail: `It is divisible by ${smallestFactor} (${n} = ${smallestFactor} × ${n / smallestFactor})`,
  };
}

// ---------- Page ----------

const input = document.getElementById('number');
const clearButton = document.getElementById('clear');
const mascot = document.getElementById('mascot');
const idleText = document.getElementById('idle');
const errorText = document.getElementById('error');
const doneBox = document.getElementById('done');
const answerText = document.getElementById('answer');
const detailText = document.getElementById('detail');
const copyButton = document.getElementById('copy');

function show(state) {
  idleText.hidden = state !== 'idle';
  errorText.hidden = state !== 'error';
  doneBox.hidden = state !== 'done';
}

function update() {
  const raw = input.value;
  clearButton.hidden = raw === '';
  mascot.src = 'logo.png';
  copyButton.textContent = 'Copy result';

  if (raw.trim() === '') {
    show('idle');
    return;
  }

  const validation = validate(raw);
  if (!validation.ok) {
    errorText.textContent = validation.message;
    show('error');
    return;
  }

  const result = checkPrime(validation.value);
  const { title, detail } = explain(validation.value, result);

  answerText.textContent = title;
  answerText.className = result.isPrime ? 'answer answer--prime' : 'answer';
  detailText.textContent = detail;
  if (result.isPrime) mascot.src = 'check.png';
  show('done');
}

input.addEventListener('input', update);

clearButton.addEventListener('click', () => {
  input.value = '';
  update();
  input.focus();
});

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(`${answerText.textContent}\n${detailText.textContent}`);
    copyButton.textContent = 'Copied';
    setTimeout(() => {
      copyButton.textContent = 'Copy result';
    }, 1500);
  } catch {
    copyButton.textContent = 'Copy result';
  }
});