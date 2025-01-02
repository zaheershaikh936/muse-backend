export const slugHelper = (value: string) => {
    return value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}