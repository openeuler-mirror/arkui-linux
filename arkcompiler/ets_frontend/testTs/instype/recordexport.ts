export default function hello(str: string) {
    return str;
}

export var a: number = 1;
export let b: number = 2;
export const c: number = 3;
export let d: string = "world";

export class Calculator{}

export function add(x: number, y: number) {
    return x + y;
}

export function minus(x: number, y: number) {
    return x - y;
}

export type A = number;
export interface B {
    name: string;
    ids: number[];
}

hello(d);
hello("test");
let ret: A = minus(add(a, b), c);
let cal = new Calculator();
