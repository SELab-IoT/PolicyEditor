import React from 'react';
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

class RuleEffectTable extends React.Component {

    makeData() {
        let data = []
        data.push({'effect': 'Permit', 'condition': 'true', 'result': 'Permit'});
        data.push({'effect': 'Permit', 'condition': 'false', 'result': 'Not Applicable'});
        data.push({'effect': 'Deny', 'condition': 'true', 'result': 'Deny'});
        data.push({'effect': 'Deny', 'condition': 'false', 'result': 'Not Applicable'});
        return data;
    }

    render() {
        const data = this.makeData();
        return (
            <div>
                <p>
                    If condition result is True, Rule Result is same to Effect.
                </p>
                <p>
                    If condition result is False, Rule Result is Not Applicable.
                    (Not opposite of Effect)
                </p>
                <BootstrapTable data={data}>
                    <TableHeaderColumn isKey dataField="effect">
                        Effect
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='condition'>
                        ConditionResult
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='result'>
                        RuleResult
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}

export default RuleEffectTable;
