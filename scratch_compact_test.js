const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2
});

console.log(formatter.format(1500));
console.log(formatter.format(150000));
console.log(formatter.format(15000000));
console.log(formatter.format(25600000));
