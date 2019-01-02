
// Define basic type definitions interfaces.
// This is the place to write interop code for the different "at the boundary" type checking libraries like "runtypes".

// Currently supported runtime type checking libraries:
// - runtypes

import * as rt from 'runtypes';

export type Dictionary<T> = { [_: string]: T };

export type ArrayDefinition<T> = T extends rt.Runtype ? rt.Array<T> | Array<T> : Array<T>;

export type StringDefinition = rt.String | string;
export type NumberDefinition = rt.Number | number;
export type RecordDefinition<T> = T extends rt.Runtype ? rt.Record<Dictionary<T>> | Dictionary<T> : Dictionary<T>;

export type DTO_Type = rt.Runtype<any> | RecordDefinition<any> | NumberDefinition | StringDefinition;

export type ExtractBaseType<T> = T extends rt.Runtype ? rt.Static<T>
        : T extends { new(...args: any[]): infer T } ? T
        : T extends { [k: string]: any } ? { [K in keyof T]: ExtractBaseType<T[K]> }
        : T;

/**
 * Checks input data against the DTO schema definition.
 * 
 * If using a supported DTO library (currently, only runtypes is supported), then this function
 * checks that the input data matches the runtype definition.
 * 
 * Otherwise, this function is a no-op.
 * 
 * @param definition The DTO definition
 * @param data The input data
 */
export function deserialize<T extends DTO_Type>(definition: T, data: unknown): unknown {
    if (isRuntype(definition)) {
        return definition.check(data);
    } else {
        return data;
    }
}

function isRuntype(input: any): input is rt.Runtype {
    return '_falseWitness' in input;
}