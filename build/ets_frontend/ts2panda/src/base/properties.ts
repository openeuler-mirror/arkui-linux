/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as ts from "typescript";
import { isValidIndex } from "../expression/memberAccessExpression";
import * as jshelpers from "../jshelpers";

export enum PropertyKind {
    Variable,
    Constant,
    Computed, // Property with computed value (execution time).
    Prototype,
    Accessor,
    Spread
}

export class Property {
    private propKind: PropertyKind;
    private valueNode: ts.Node | undefined;
    private setterNode: ts.SetAccessorDeclaration | undefined;
    private getterNode: ts.GetAccessorDeclaration | undefined;
    private compiled: boolean = false;
    private redeclared: boolean = false;
    private name: string | number | ts.ComputedPropertyName | undefined;

    constructor(propKind: PropertyKind, name: string | number | ts.ComputedPropertyName | undefined) {
        this.propKind = propKind;
        if (typeof (name) != 'undefined') {
            this.name = name;
        }
    }

    setCompiled() {
        this.compiled = true;
    }

    setRedeclared() {
        this.redeclared = true;
    }

    isCompiled() {
        return this.compiled;
    }

    isRedeclared() {
        return this.redeclared;
    }

    getName() {
        if (typeof (this.name) == 'undefined') {
            throw new Error("this property doesn't have a name");
        }
        return this.name;
    }

    getKind() {
        return this.propKind;
    }

    getValue() {
        if (this.propKind == PropertyKind.Accessor) {
            throw new Error("Accessor doesn't have valueNode")
        }
        return this.valueNode!;
    }

    getGetter() {
        return this.getterNode;
    }

    getSetter() {
        return this.setterNode;
    }

    setValue(valueNode: ts.Node) {
        this.valueNode = valueNode;
        this.getterNode = undefined;
        this.setterNode = undefined;
    }

    setGetter(getter: ts.GetAccessorDeclaration) {
        if (this.propKind != PropertyKind.Accessor) {
            this.valueNode = undefined;
            this.setterNode = undefined;
            this.propKind = PropertyKind.Accessor;
        }
        this.getterNode = getter;
    }

    setSetter(setter: ts.SetAccessorDeclaration) {
        if (this.propKind != PropertyKind.Accessor) {
            this.valueNode = undefined;
            this.getterNode = undefined;
            this.propKind = PropertyKind.Accessor;
        }
        this.setterNode = setter;
    }

    setKind(propKind: PropertyKind) {
        this.propKind = propKind;
    }
}


export function generatePropertyFromExpr(expr: ts.ObjectLiteralExpression): Property[] {
    let hasProto: boolean = false;
    let properties: Property[] = [];
    let namedPropertyMap: Map<string, number> = new Map<string, number>();

    expr.properties.forEach(property => {
        switch (property.kind) {
            case ts.SyntaxKind.PropertyAssignment: {
                if (property.name.kind == ts.SyntaxKind.ComputedPropertyName) {
                    defineProperty(property.name, property, PropertyKind.Computed, properties, namedPropertyMap);
                    break;
                }

                let propName: number | string = <number | string>getPropName(property.name);
                if (propName == "__proto__") {
                    if (!hasProto) {
                        defineProperty(propName, property.initializer, PropertyKind.Prototype, properties, namedPropertyMap);
                        hasProto = true;
                        break;
                    } else {
                        throw new Error("__proto__ was set multiple times in the object definition.");
                    }
                }

                if (isConstantExpr(property.initializer)) {
                    defineProperty(propName, property.initializer, PropertyKind.Constant, properties, namedPropertyMap);
                } else {
                    defineProperty(propName, property.initializer, PropertyKind.Variable, properties, namedPropertyMap);
                }
                break;
            }
            case ts.SyntaxKind.ShorthandPropertyAssignment: {
                // ShorthandProperty's name always be Identifier
                let propName = jshelpers.getTextOfIdentifierOrLiteral(property.name);
                defineProperty(propName, property.name, PropertyKind.Variable, properties, namedPropertyMap);
                break;
            }
            case ts.SyntaxKind.SpreadAssignment: {
                defineProperty(undefined, property.expression, PropertyKind.Spread, properties, namedPropertyMap);
                break;
            }
            case ts.SyntaxKind.MethodDeclaration: {
                let propName = getPropName(property.name);
                if (typeof (propName) == 'string' || typeof (propName) == 'number') {
                    defineProperty(propName, property, PropertyKind.Variable, properties, namedPropertyMap);
                } else {
                    defineProperty(propName, property, PropertyKind.Computed, properties, namedPropertyMap);
                }
                break;
            }
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor: {
                let propName = getPropName(property.name);
                if (typeof (propName) == 'string' || typeof (propName) == 'number') {
                    defineProperty(propName, property, PropertyKind.Accessor, properties, namedPropertyMap);
                } else {
                    defineProperty(propName, property, PropertyKind.Computed, properties, namedPropertyMap);
                }
                break;
            }
            default:
                throw new Error("Unreachable Kind");
        }
    });

    return properties;
}

function defineProperty(
    propName: string | number | ts.ComputedPropertyName | undefined,
    propValue: ts.Node,
    propKind: PropertyKind,
    properties: Property[],
    namedPropertyMap: Map<string, number>) {
    if (propKind == PropertyKind.Computed || propKind == PropertyKind.Spread) {
        let prop = new Property(propKind, <ts.ComputedPropertyName | undefined>propName);
        prop.setValue(propValue);
        properties.push(prop);
    } else {
        let prop = new Property(propKind, propName);
        let name_str = propertyKeyAsString(<string | number>propName);

        if (namedPropertyMap.has(name_str)) {
            let prevProp = properties[namedPropertyMap.get(name_str)!];

            if ((prevProp.getKind() == PropertyKind.Accessor || prevProp.getKind() == PropertyKind.Constant)
                && (propKind == PropertyKind.Accessor || propKind == PropertyKind.Constant)) {
                if (propKind == PropertyKind.Accessor) {
                    if (ts.isGetAccessorDeclaration(propValue)) {
                        prevProp!.setGetter(propValue);
                    } else if (ts.isSetAccessorDeclaration(propValue)) {
                        prevProp!.setSetter(propValue);
                    }
                } else {
                    prevProp!.setValue(propValue);
                    prevProp!.setKind(PropertyKind.Constant);
                }
                return;
            }

            prop.setRedeclared();
        }

        namedPropertyMap.set(name_str, properties.length);
        if (propKind == PropertyKind.Accessor) {
            if (ts.isGetAccessorDeclaration(propValue)) {
                prop.setGetter(propValue);
            } else if (ts.isSetAccessorDeclaration(propValue)) {
                prop.setSetter(propValue);
            }
        } else {
            prop.setValue(propValue);
        }
        properties.push(prop);
    }
}

export function isConstantExpr(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NumericLiteral:
        case ts.SyntaxKind.NullKeyword:
        case ts.SyntaxKind.TrueKeyword:
        case ts.SyntaxKind.FalseKeyword:
            return true;
        default:
            return false;
    }
}

export function propertyKeyAsString(propName: string | number) {
    if (typeof (propName) == 'number') {
        return propName.toString();
    }
    return propName;
}

export function getPropName(propertyName: ts.PropertyName) {
    if (ts.isComputedPropertyName(propertyName)) {
        return propertyName;
    }

    let propName: number | string = jshelpers.getTextOfIdentifierOrLiteral(propertyName);

    if (propertyName.kind == ts.SyntaxKind.NumericLiteral) {
        propName = Number.parseFloat(propName);
        if (!isValidIndex(propName)) {
            propName = propName.toString();
        }
    } else if (propertyName.kind == ts.SyntaxKind.StringLiteral) {
        let temp = Number(propName);
        if (!isNaN(Number.parseFloat(propName)) && !isNaN(temp) && isValidIndex(temp) && String(temp) == propName) {
            propName = temp;
        }
    }

    return propName;
}