export {
    generateActionTypesDictionaryForStore,
    generateActionTypesForStore,
} from './actionTypes';
export { generateActionsForStore, collection_all, single_all } from './actions';
export { generateReducersForStore, generateSingle } from './reducers';
export { nodeToType, analyzeStructure, clearNodes } from './structure';
export { toSingularAction } from './singular';

export { NodeType } from './types/types';

export type {
    ApiInfo,
    ApiInfoPerType,
    ApiVerb,
    Action,
    ActionBag,
    ActionCreatorEmpty,
    ActionCreatorId,
    ActionCreatorIdAndPayload,
    ActionCreatorPayload,
    CollectionBag,
    CollectionNode,
    Item,
    Json,
    SingleBag,
    SingleNode,
    StoreNode,
    StoreStructure,
    StoreActions,
    StoreNodeTypes,
    Value,
    QueueBag,
    QueueNode,
} from './types/types';
