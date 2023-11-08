export const addSpacesToNumberWithDecimal = (number: number | (() => number)): string => {
    const actualNumber = typeof number === 'function' ? number() : number;
    const roundedNumber = actualNumber.toFixed(2);
    const parts = roundedNumber.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const decimalPart = parts[1];
    const formattedDecimalPart = decimalPart === '00' ? '' : `.${decimalPart}`;
    return `${integerPart}${formattedDecimalPart}`;
}