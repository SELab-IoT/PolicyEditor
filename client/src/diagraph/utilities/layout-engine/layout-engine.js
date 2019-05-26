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

// import { type IGraphViewProps } from '../../components/graph-view';

export default class LayoutEngine {
  constructor(graphViewProps) {
    this.graphViewProps = graphViewProps;
  }

  calculatePosition(node) {
    return node;
  }

  adjustNodes(nodes, nodesMap) {
    let node = null;
    let position = {
      x: 0,
      y: 0
    }
    for (let i = 0; i < nodes.length; i++){
      node = nodes[i];
      const position = this.calculatePosition({
        x: node.x || 0,
        y: node.y || 0
      });
      node.x = position.x;
      node.y = position.y;
    }
    return nodes;
  }

  getPositionForNode(node) {
    return this.calculatePosition(node);
  }
}
