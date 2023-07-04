/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function func1<Type, A, B extends readonly number[]>(arg: Type): Type {
    return arg;
}

function func2<A extends { a: number, b: string }>() { }

function func3<A extends keyof { a: { b: number, c: boolean }, b: [number, string] }>(a: A, b: string): number | boolean {
    return true;
}

declare type PromiseConstructorLike = new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) => PromiseLike<T>;

interface R<K extends [number, string], T = string> {
    a: number,
    [x: string]: boolean | number,
}

interface U<A extends readonly [number, number, { a: number, b: string }], Z = boolean> extends R<[number, string]> {
    <A>(): number,
    readonly<A extends number>(): [boolean, number[]];
}

func1<number, string, [1, 2, 3]>()
func2<<A>() => {}>();

var o = {
    a: function <B, C extends typeof func1>() { },
    b: function <D = number, T = string>() { },
    c<E, F extends readonly []>() { }
}

class A<T extends B, Z = { a: number, b: string }> {
    public a<T, R>() { };
    private b<E extends (a: number, b: string) => any[]>() { }
}

class W extends T<<B> () => number, [number | string][]> {

}

class X extends Q<number> implements S<<R>(a:number, b:string) => [number]>, A {

}

var a: new <A>() => <B>() => string;
var b: <A extends T, U = 5>(a: number | string) => { a: number };

var c: B.T<A<C<number>>>[0];
var d: A<number, { a: number, b: string }, [number, string]>;
var e: T<<A>() => {}>;

type E<R extends B, C, T = number> = number | T | string;
type P<K, Q = [number, number, string] | any[]> = {a:K, b:Q};

async<<A>() => {}>();
async<number>();
<A extends B>():number => true;
async<A extends readonly [number, string]>() => {return "foo";};