import { analyzeStructure } from './structure';
import { NodeType, StoreStructure, CollectionNode } from './types/types';

export const cleanInitialState = (state: StoreStructure): StoreStructure => {
    let output = { ...state };

    const nodeTypes = analyzeStructure(state);

    Object.keys(nodeTypes).forEach((nodeName) => {
        const nodeType = nodeTypes[nodeName];

        if (nodeType === NodeType.COLLECTION_NODE) {
            if (isCollectionNodeBlank(state[nodeName] as CollectionNode)) {
                output[nodeName] = {};
            }
        }
    });

    return output;
};

export const isCollectionNodeBlank = (collectionNode: CollectionNode) => {
    const values = Object.values(collectionNode);

    if (values.length > 1) {
        return false;
    }

    const fields = Object.keys(values[0]);
    return fields.length === 1 && fields[0] === 'id';
};
