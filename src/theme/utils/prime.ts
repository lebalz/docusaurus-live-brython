const isPrime = (number: number): boolean => {
    if (number <= 3) {
        return number > 1;
    }

    if (number % 2 === 0 || number % 3 === 0) {
        return false;
    }

    const boundary = Math.floor(Math.sqrt(number));

    for (let idx = 5; idx <= boundary; idx += 6) {
        if (number % idx === 0 || number % (idx + 2) === 0) {
            return false;
        }
    }
    return true;
};

const randomPrime = (min: number, max: number): number => {
    if (!max && !min) {
        return Number.MIN_SAFE_INTEGER;
    }
    if (max === undefined) {
        max = min;
        min = 0;
    }

    min = Math.ceil(min || 0);
    max = Math.floor(max);

    const range = max - min + 1;
    const randomNumber = Math.floor(Math.random() * range) + min;

    if (isPrime(randomNumber)) {
        return randomNumber;
    }

    let i = randomNumber - 1;
    let j = randomNumber + 1;
    while (i >= min && j <= max) {
        if (isPrime(i)) {
            return i;
        }
        if (isPrime(j)) {
            return j;
        }
        i -= 1;
        j += 1;
    }
    while (i >= min) {
        if (isPrime(i)) {
            return i;
        }
        i -= 1;
    }
    while (j <= max) {
        if (isPrime(j)) {
            return j;
        }
        j += 1;
    }

    return null;
};

export { isPrime, randomPrime };
