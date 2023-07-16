export const rand = (items: string[]) => {
    // "~~" for a closest "int"
    return items[~~(items.length * Math.random())];
}
