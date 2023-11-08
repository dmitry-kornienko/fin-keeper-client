export const getDate = (date: string): string => {
    const formatedDate = date.split('-').reverse().join('.');
    return formatedDate
}