import { NodeID } from "../../templates/layoutIDs";
import { Anchor } from "../box/gridBoxTypes";
import { Coordinate } from "../../geometry/coordinateTypes"
import { GridBox } from "../box/gridBoxTypes";
import { DiagnosticEntry } from "../gridErrorShape";


// here the localIDS are the NodeIDs that I can use in my box layout
// type NotEqualIn<Universe extends NodeID, Base extends Universe> = Exclude<Universe, Base>;

// boxes have IDS I can choose from a pool of NOdeID, and I can apply transformations to boxes. Those transformations use a basic proposition
export type BoxPropBase<BoxIDFrom extends NodeID> = {
    boxId: BoxIDFrom;
    anchor: Anchor;
}


//I can do different things with my boxes. One, I can move a box from a position to the next "export type 
// BoxMoveToProps<BoxIDFrom extends NodeID> = { from: BoxPropBase<BoxIDFrom>; to: Coordinate | BoxPropBase<NotEqualBox<BoxIDFrom>>; gap?: Coordinate; }" 
// with "type NotEqualBox<BaseBoxId extends NodeID> = Exclude<NodeID, BaseBoxId>;",
//  which means that the next position can be the anchor of any other different box
export type BoxMoveToProps<BoxID extends NodeID> = {
    from: BoxPropBase<BoxID>;
    to: Coordinate | BoxPropBase<BoxID>;
    gap?: Coordinate;
}
// Next thing I can do, is to move a box by a given amount
export type BoxMoveByProps<BoxIDFrom extends NodeID> = {
    from: Omit<BoxPropBase<BoxIDFrom>, 'anchor'>;
    by: Coordinate | number;
    gap?: Coordinate;
}


// next thing I can do, is to align a box to a height, or a anchor of another box  
export type BoxAlignYProps<BoxID extends NodeID> = {
    from: BoxPropBase<BoxID>;
    to: number | BoxPropBase<BoxID>;
    gap?: number;
}

// same for x
export type BoxAlignXProps<BoxID extends NodeID> = {

    from: BoxPropBase<BoxID>;
    to: number | BoxPropBase<BoxID>;
    gap?: number;
}



// I define a type for use, maybe I need it later
export type BoxProps<BoxID extends NodeID> =
    | BoxMoveToProps<BoxID>
    | BoxMoveByProps<BoxID>
    | BoxAlignYProps<BoxID>
    | BoxAlignXProps<BoxID>



// at this point I can create the database of all possible box transformations 
// and I am making sure that all transformation IDS are corresponding to the
// meaningful transformation props
export type BoxMovesPropsObject<BoxID extends NodeID> = {
    moveTo: BoxMoveToProps<BoxID>;
    moveBy: BoxMoveByProps<BoxID>;
    alignToY: BoxAlignYProps<BoxID>;
    alignToX: BoxAlignXProps<BoxID>;
    alignAllToY: { to: number; anchor: Anchor }; 
    alignAllToX: { to: number; anchor: Anchor };
    stackVertically: { gap?: number };
    stackHorizontally: { gap?: number };

};

export type TransformationIDs<BoxID extends NodeID> = keyof BoxMovesPropsObject<BoxID>;

export const transformationIDs = [
    "moveTo",
    "moveBy",
    "alignToY",
    "alignToX",
    "alignAllToY",
    "alignAllToX",
    "stackVertically",
    "stackHorizontally"
] as const satisfies readonly TransformationIDs<any>[];


export type BoxMovesProps<BoxID extends NodeID> = {
    [M in keyof BoxMovesPropsObject<any>]: { [K in M]: BoxMovesPropsObject<BoxID>[M] };
}[keyof BoxMovesPropsObject<any>];


// I define a type that contains all possible box transformation IDS 
export type AllBoxMovesProps<BoxID extends NodeID> = keyof BoxMovesPropsObject<BoxID>;

// ... AND, now the interesting thing, I know I will need functions that will
// implement the transformations, so I define the props that those functions
// will receive
export type BoxMovesFunctionsProps<BoxID extends NodeID> = {
    [M in keyof BoxMovesPropsObject<any>]: {
        boxprops: BoxMovesPropsObject<BoxID>[M],
        boxes: Partial<Record<NodeID, GridBox>>,
        diagnostics: DiagnosticEntry[]
    };
}

// from here I define the function signatures for each transformation
// and what I am expecting as return value
// we will assume that each function will change the array of nodes,
// and replace in situ the transformed boxes
// if there is an error it will be recorded in the diagnostic.
// The function returns void always.
export type BoxMovesFunctions<BoxID extends NodeID> = {
    [M in keyof BoxMovesPropsObject<any>]: (props: BoxMovesFunctionsProps<BoxID>[M]) => GridBox | undefined | Partial<Record<NodeID, GridBox>>;
}

// and another usefule type  
// export type BoxMovesProps<BoxID extends NodeID> = Partial<BoxMovesPropsAll<BoxID>>;

// type ExactlyOne<T> = {
//   [K in keyof T]: { [P in K]: T[P] } & { [Q in Exclude<keyof T, K>]?: never }
// }[keyof T];

// export type SingleBoxMoveProps<BoxID extends NodeID> = ExactlyOne<BoxMovesPropsObject<BoxID>>;

//Example usages

// let kii: Array<BoxMovesProps<'block_1' | 'aside'>> = [
//     {
//         moveTo: {
//             from: {
//                 boxId: 'aside',
//                 anchor: 'center'
//             },
//             to: {
//                 boxId: 'block_1',
//                 anchor: 'topLeft'
//             }
//         }
//     },
//     {
//         moveBy: {
//             from: {
//                 boxId: 'aside',

//             },
//             by: {
//                 x: 100,
//                 y: 200
//             },
//         }
//     },
//     {
//         moveTo: {
//             from: {
//                 boxId: 'aside',
//                 anchor: 'center'
//             },
//             to: {
//                 boxId: 'block_1',
//                 anchor: 'topLeft'
//             }
//         }
//     },
// ];



// let rt:  Partial<BoxMovesProps<'block_1' | 'aside' | 'block_4'>> = {

//     moveBy: {
//         from: 'aside',
//         anchor: 'center',
//         by: {
//             x: 100,
//             y: 200
//         }
//     }

// } 
// let rt1: Partial<BoxMovesProps<'block_1' | 'aside' | 'block_4'>> = {
//     alignToY: {
//         from: 'block_4',
//         anchor: 'bottomLeft',
//         to: 300
//     }
// }



// type kk1<BaseBoxID extends NodeID> = {
//     [M in keyof MovesProp1<any>]: MovesProp1< BaseBoxID>[M];
// }[keyof MovesProp1<any>]; ;


