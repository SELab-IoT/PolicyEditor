import * as React from 'react';

export const NODE_KEY = 'id'; // Key used to identify nodes

// These keys are arbitrary (but must match the config)
// However, GraphView renders text differently for empty types
// so this has to be passed in if that behavior is desired.
export const EMPTY_TYPE = 'customEmpty'; // Empty node type

export const TARGET_TYPE = "target";
export const SUBJECT_TYPE = 'subject';
export const RESOURCE_TYPE = 'resource';
export const ACTION_TYPE = 'action';

export const POLICY_TYPE = 'policy';

export const RULE_TYPE = 'rule';
export const CONDITION_TYPE = "condition";
export const VALUE_TYPE = "value";
export const INPUT_TYPE = "input";

export const EMPTY_EDGE_TYPE = 'emptyEdge';
export const SPECIAL_EDGE_TYPE = 'specialEdge';
export const SKINNY_TYPE = 'skinny';

export const nodeTypes = [EMPTY_TYPE, TARGET_TYPE, SUBJECT_TYPE, POLICY_TYPE, RESOURCE_TYPE, ACTION_TYPE, SKINNY_TYPE, RULE_TYPE, CONDITION_TYPE, VALUE_TYPE, INPUT_TYPE];
export const edgeTypes = [EMPTY_EDGE_TYPE, SPECIAL_EDGE_TYPE];


const EmptyNodeShape = (
    <symbol viewBox="0 0 154 154" width="154" height="154" id="emptyNode">
        <circle cx="77" cy="77" r="76"/>
    </symbol>
);

const CustomEmptyShape = (
    <symbol viewBox="0 0 100 100" id="customEmpty">
        <circle cx="50" cy="50" r="45"/>
    </symbol>
);

const PolicyShape = (
    <symbol viewBox="-27 0 154 154" id="policy" width="154" height="154">
        <rect transform="translate(50) rotate(45)" width="109" height="109"/>
    </symbol>
);

const SubjectShape = (
    <symbol viewBox="0 0 80 80" width="80" height="80" id="subject">
        <circle cx="40" cy="40" r="40"/>
    </symbol>
);

const ResourceShape = (
    <symbol viewBox="0 0 80 80" width="80" height="80" id="resource">
        <circle cx="40" cy="40" r="40"/>
    </symbol>
);

const TargetShape = (
    <symbol viewBox="0 0 88 72" id="target" width="88" height="88">
        <path d="M 0 36 18 0 70 0 88 36 70 72 18 72Z"></path>
    </symbol>
);

const ActionShape = (
    <symbol viewBox="0 0 80 80" width="80" height="80" id="action">
        <circle cx="40" cy="40" r="40"/>
    </symbol>
);

const RuleShape = (
    <symbol viewBox="0 0 154 80" width="154" height="80" id="rule">
        <rect x="0" y="0" rx="2" ry="2" width="154" height="80"/>
    </symbol>
);

const ConditionShape = (
    <symbol viewBox="0 0 89 80" width="88" height="80" id="condition">
        <path d="M 44 0 2 34 22 80 66 80 86 34 44 0Z"></path>
    </symbol>
);

const ValueShape = (
    <symbol viewBox="0 0 80 80" width="80" height="80" id="value">
        <circle cx="40" cy="40" r="39"/>
    </symbol>
);

const InputShape = (
    <symbol viewBox="0 0 80 80" width="80" height="80" id="input">
        <circle cx="40" cy="40" r="39"/>
    </symbol>
);


const SkinnyShape = (
    <symbol viewBox="0 0 154 54" width="154" height="54" id="skinny">
        <rect x="0" y="0" rx="2" ry="2" width="154" height="54"/>
    </symbol>
);

const SpecialChildShape = (
    <symbol viewBox="0 0 154 154" id="specialChild">
        <rect x="2.5" y="0" width="154" height="154" fill="rgba(30, 144, 255, 0.12)"/>
    </symbol>
);

const EmptyEdgeShape = (
    <symbol viewBox="0 0 50 50" id="emptyEdge">
        <circle cx="25" cy="25" r="8" fill="currentColor"/>
    </symbol>
);

const SpecialEdgeShape = (
    <symbol viewBox="0 0 50 50" id="specialEdge">
        <rect transform="rotate(45)" x="27.5" y="-7.5" width="15" height="15" fill="currentColor"/>
    </symbol>
);

export default {
    EdgeTypes: {
        emptyEdge: {
            shape: EmptyEdgeShape,
            shapeId: '#emptyEdge'
        },
        specialEdge: {
            shape: SpecialEdgeShape,
            shapeId: '#specialEdge'
        }
    },
    NodeSubtypes: {
        specialChild: {
            shape: SpecialChildShape,
            shapeId: '#specialChild'
        }
    },
    NodeTypes: {
        emptyNode: {
            shape: EmptyNodeShape,
            shapeId: '#emptyNode',
            typeText: 'None'
        },
        empty: {
            shape: CustomEmptyShape,
            shapeId: '#empty',
            typeText: 'None'
        },
        policy: {
            shape: PolicyShape,
            shapeId: '#policy',
            typeText: 'Policy'
        },
        skinny: {
            shape: SkinnyShape,
            shapeId: '#skinny',
            typeText: 'Skinny'
        },
        target: {
            shape: TargetShape,
            shapeId: '#target',
            typeText: 'Target'
        },
        subject: {
            shape: SubjectShape,
            shapeId: "#subject",
            typeText: 'Subject'
        },
        resource: {
            shape: ResourceShape,
            shapeId: "#resource",
            typeText: "Resource"
        },
        action: {
            shape: ActionShape,
            shapeId: "#action",
            typeText: "Action"
        },
        rule: {
            shape: RuleShape,
            shapeId: "#rule",
            typeText: "Rule"
        },
        condition: {
            shape: ConditionShape,
            shapeId: "#condition",
            typeText: "Condition"
        },
        value: {
            shape: ValueShape,
            shapeId: "#value",
            typeText: "Value"
        },
        input: {
            shape: InputShape,
            shapeId: "#input",
            typeText: "Input"
        }
    }
};
