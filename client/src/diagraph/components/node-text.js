// @flow
/*
  Copyright(c) 2018 Uber Technologies, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import * as React from 'react';
import GraphUtils from './graph-util';

class NodeText extends React.Component {
  getTypeText(data, nodeTypes) {
    if (data.type && nodeTypes[data.type]) {
      return nodeTypes[data.type].typeText;
    } else if (nodeTypes.emptyNode) {
      return nodeTypes.emptyNode.typeText;
    } else {
      return null;
    }
  }

  render() {
    const { data, nodeTypes, isSelected } = this.props;
    const lineOffset = 18;
    const title = data.title;
    const className = GraphUtils.classNames('node-text', { selected: isSelected });
    const typeText = this.getTypeText(data, nodeTypes);

    return (
      <text className={className} textAnchor="middle">
        {!!typeText && (
          <tspan opacity="0.5" fontSize="8px" dy={-10}>{typeText}</tspan>
        )}
        {title && (
          <tspan x={0} dy={lineOffset} fontSize="12px">
            {title}
          </tspan>
        )}
        {title && <title>{title}</title>}
      </text>
    );
  }
}


class RuleNodeText extends React.Component {
  getTypeText(data, nodeTypes) {
    if (data.type && nodeTypes[data.type]) {
      return nodeTypes[data.type].typeText;
    } else if (nodeTypes.emptyNode) {
      return nodeTypes.emptyNode.typeText;
    } else {
      return null;
    }
  }

  render() {
    const { data, nodeTypes, isSelected } = this.props;
    const lineOffset = 18;
    const title = data.title;
    const className = GraphUtils.classNames('node-text', { selected: isSelected });
    const typeText = this.getTypeText(data, nodeTypes);
    const functionTitle = data.function;

    return (
        <text className={className} textAnchor="middle">
          {!!typeText && (
              <tspan opacity="0.5" y={-10}>{typeText}</tspan>
          )}
          {title && (
              <tspan x={0} dy={lineOffset} fontSize="12px">
                {title}
              </tspan>
          )}
          {functionTitle && (
              <tspan x={0} dy={lineOffset+2} fontSize="10px">
                {functionTitle}
              </tspan>
          )}
          {title && <title>{title}</title>}
        </text>
    );
  }
}

class PolicyNodeText extends React.Component {
  getTypeText(data, nodeTypes) {
    if (data.type && nodeTypes[data.type]) {
      return nodeTypes[data.type].typeText;
    } else if (nodeTypes.emptyNode) {
      return nodeTypes.emptyNode.typeText;
    } else {
      return null;
    }
  }

  test() {
    console.debug('hi')
  }


  render() {
    const { data, nodeTypes, isSelected } = this.props;
    const lineOffset = 18;
    const title = data.title;
    const className = GraphUtils.classNames('node-text', { selected: isSelected });
    const typeText = this.getTypeText(data, nodeTypes);
    const combineAlg = data.combineAlg;
    return (
        <text className={className} textAnchor="middle">
          {!!typeText && (
              <tspan opacity="0.5" y={-13}>{typeText}</tspan>
          )}
          {title && (
              <tspan onClick={this.test} x={0} dy={lineOffset} fontSize="12px">
                {title}
              </tspan>
          )}
          {combineAlg && (
              <tspan x={0} dy={lineOffset+2} fontSize="10px">
                {combineAlg}
              </tspan>
          )}
          {title && <title>{title}</title>}
        </text>
    );
  }
}

export {RuleNodeText, PolicyNodeText};

export default NodeText;
