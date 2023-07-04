import hello from "./recordexport"
import {a as x, b as y, c, d, Calculator, add} from "./recordexport"
import * as calculator from "./recordexport"
import {A, B} from "./recordexport"

let greeting = hello(d);
let ret: A = calculator.minus(add(x, y), c);
let cal = new Calculator();
