import { toSingularAction } from './singular';
import { nodeToType } from './structure';
import { Action, NodeType, StoreStructure } from './types/types';

export const generateSingle = (nodeName: string) => (
    state: Record<string, any> = {},
    action: Action
) => {
    switch (action.type) {
        case `SET_${nodeName.toUpperCase()}`:
            return action.payload;
        case `PATCH_${nodeName.toUpperCase()}`:
            return { ...state, ...action.payload };
        default:
            return state || {};
    }
};

export const generateQueue = (nodeName: string) => (
    state: Record<string, any>[] = [],
    action: Action
) => {
    let newState;

    switch (action.type) {
        case `SET_${nodeName.toUpperCase()}`:
            return action.payload;
        case `PUSH_${toSingularAction(nodeName)}`:
            return [...state, action.payload];
        case `POP_${toSingularAction(nodeName)}`:
            newState = [...state];
            newState.pop();
            return newState;
        case `CLEAR_${nodeName.toUpperCase()}`:
            return [];
        case `PUSH_MANY_${nodeName.toUpperCase()}`:
            const { items = [] } = action.payload || {};
            return [...state, ...(items || [])];
        default:
            return state || [];
    }
};

export const generateCollection = (nodeName: string) => {
    const item = (state: Record<string, any> = {}, action: Action) => {
        switch (action.type) {
            case `SET_${toSingularAction(nodeName)}`:
                return action.payload;
            case `PATCH_${toSingularAction(nodeName)}`:
                return {
                    ...state,
                    ...action.payload,
                };
        }
    };

    const items = (state: Record<string, any> = {}, action: Action) => {
        let newState;

        switch (action.type) {
            case `SET_${nodeName.toUpperCase()}`:
                return action.payload;
            case `SET_${toSingularAction(nodeName)}`:
            case `PATCH_${toSingularAction(nodeName)}`:
                if (!action.payload || !action.payload.id) {
                    return state;
                }
                return {
                    ...state,
                    [action.payload.id]: item(state[action.payload.id], action),
                };
            case `DELETE_${toSingularAction(nodeName)}`:
                if (!action.payload || !action.payload.id) {
                    return state;
                }
                newState = { ...state };
                delete newState[action.payload.id];
                return newState;
            case `SET_MANY_${nodeName.toUpperCase()}`:
                return {
                    ...state,
                    ...action.payload,
                };
            default:
                return state || {};
        }
    };

    return items;
};

export const generateGroupedList = (nodeName: string) => {
    const listItems = (state: any[], action: Action) => {
        let newState;

        const { items = [] } = action.payload || {};

        switch (action.type) {
            case `SET_${nodeName.toUpperCase()}_ITEMS`:
                return items;
            case `PUSH_${nodeName.toUpperCase()}_ITEM`:
            case `PUSH_MANY_${nodeName.toUpperCase()}_ITEMS`:
                return [...state, ...items];
            case `POP_${nodeName.toUpperCase()}_ITEM`:
                newState = [...state];
                newState.pop();
                return newState;
            case `CLEAR_${nodeName.toUpperCase()}_ITEMS`:
                return [];
            default:
                return state || [];
        }
    };

    const item = (state: Record<string, any> = {}, action: Action) => {
        switch (action.type) {
            case `SET_${toSingularAction(nodeName)}`:
                return action.payload;
            case `PATCH_${toSingularAction(nodeName)}`:
                return {
                    ...state,
                    ...action.payload,
                };
            case `SET_${nodeName.toUpperCase()}_ITEMS`:
            case `PUSH_${nodeName.toUpperCase()}_ITEM`:
            case `POP_${nodeName.toUpperCase()}_ITEM`:
            case `CLEAR_${nodeName.toUpperCase()}_ITEMS`:
            case `PUSH_MANY_${nodeName.toUpperCase()}_ITEMS`:
                return {
                    ...state,
                    items: listItems(state.items, action),
                };
        }
    };

    const items = (state: Record<string, any> = {}, action: Action) => {
        let newState;

        switch (action.type) {
            case `SET_${nodeName.toUpperCase()}`:
                return action.payload;
            case `SET_${toSingularAction(nodeName)}`:
            case `PATCH_${toSingularAction(nodeName)}`:
            case `SET_${nodeName.toUpperCase()}_ITEMS`:
            case `PUSH_${nodeName.toUpperCase()}_ITEM`:
            case `POP_${nodeName.toUpperCase()}_ITEM`:
            case `CLEAR_${nodeName.toUpperCase()}_ITEMS`:
            case `PUSH_MANY_${nodeName.toUpperCase()}_ITEMS`:
                if (!action.payload || !action.payload.id) {
                    return state;
                }
                return {
                    ...state,
                    [action.payload.id]: item(state[action.payload.id], action),
                };
            case `DELETE_${toSingularAction(nodeName)}`:
                if (!action.payload || !action.payload.id) {
                    return state;
                }
                newState = { ...state };
                delete newState[action.payload.id];
                return newState;
            case `SET_MANY_${nodeName.toUpperCase()}`:
                return {
                    ...state,
                    ...action.payload,
                };
            default:
                return state || {};
        }
    };

    return items;
};

export const generateReducersForStore = <T extends StoreStructure>(
    storeState: T
) => {
    let output = {} as any;

    const keys: Array<keyof T> = Object.keys(storeState);

    for (const key of keys) {
        const type = nodeToType(storeState[key]);

        switch (type) {
            case NodeType.SINGLE_NODE:
                output[key] = generateSingle(String(key)) as any;
                break;
            case NodeType.QUEUE_NODE:
                output[key] = generateQueue(String(key)) as any;
                break;
            case NodeType.COLLECTION_NODE:
                output[key] = generateCollection(String(key)) as any;
                break;
            case NodeType.GROUPED_LIST_NODE:
                output[key] = generateGroupedList(String(key)) as any;
                break;
        }
    }

    return output;
};
