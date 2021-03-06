import React from 'react';
import {
    BootstrapTable,
    TableHeaderColumn
} from 'react-bootstrap-table';

import 'react-bootstrap-table/css/react-bootstrap-table.css'

class CombineAlgTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alg: 'permit-unless-deny'
        };

    }

    makeTableData(alg) {
        let data = []
        switch (alg) {
            case 'permit-unless-deny':
                data.push({'rule1': 'Permit', 'rule2': 'Permit', 'result': 'Permit'});
                data.push({'rule1': 'Permit', 'rule2': 'Deny', 'result': 'Deny'});
                data.push({'rule1': 'Deny', 'rule2': 'Deny', 'result': 'Deny'});
                data.push({'rule1': 'Not applicable', 'rule2': 'Permit/Deny', 'result': 'Permit/Deny'});
                data.push({'rule1': 'Not applicable', 'rule2': 'Not applicable', 'result': 'Permit'});
                data.push({'rule1': 'Indeterminate', 'rule2': 'Indeterminate', 'result': 'Permit'});
                break;
            case 'deny-unless-permit':
                data.push({'rule1': 'Permit', 'rule2': 'Permit', 'result': 'Permit'});
                data.push({'rule1': 'Permit', 'rule2': 'Deny', 'result': 'Permit'});
                data.push({'rule1': 'Deny', 'rule2': 'Deny', 'result': 'Deny'});
                data.push({'rule1': 'Not applicable', 'rule2': 'Permit/Deny', 'result': 'Permit/Deny'});
                data.push({'rule1': 'Not applicable', 'rule2': 'Not applicable', 'result': 'Deny'});
                data.push({'rule1': 'Indeterminate', 'rule2': 'Indeterminate', 'result': 'Deny'});
                break;
            case 'permit-overrides':
                data.push({'rule1': 'Permit', 'rule2': 'Permit', 'result': 'Permit'});
                data.push({'rule1': 'Permit', 'rule2': 'Deny', 'result': 'Permit'});
                data.push({'rule1': 'Deny', 'rule2': 'Deny', 'result': 'Deny'});
                data.push({'rule1': 'Not applicable', 'rule2': 'Permit/Deny', 'result': 'Permit/Deny'});
                data.push({'rule1': 'Permit/Deny', 'rule2': 'Indeterminate', 'result': 'Indeterminate'});
                data.push({'rule1': 'Indeterminate', 'rule2': 'Indeterminate', 'result': 'Indeterminate'});
                break;
            case 'deny-overrides':
                data.push({'rule1': 'Permit', 'rule2': 'Permit', 'result': 'Permit'});
                data.push({'rule1': 'Permit', 'rule2': 'Deny', 'result': 'Deny'});
                data.push({'rule1': 'Deny', 'rule2': 'Deny', 'result': 'Deny'});
                data.push({'rule1': 'Not applicable', 'rule2': 'Permit/Deny', 'result': 'Permit/Deny'});
                data.push({'rule1': 'Permit/Deny', 'rule2': 'Indeterminate', 'result': 'Indeterminate'});
                data.push({'rule1': 'Indeterminate', 'rule2': 'Indeterminate', 'result': 'Indeterminate'});
                break;
        }


        return data;
    }


    onChange = (event) => {
        this.setState({alg: event.target.value});
    }

    render() {
        const data = this.makeTableData(this.state.alg);

        return (
            <div>
                <select className="select-view"
                        style={{marginBottom: '3px'}}
                    name="combine-algorithm"
                    defaultValue={this.state.alg}
                    onChange={event => this.onChange(event)}
                >
                    <option value={'permit-unless-deny'}>PermitUnlessDeny</option>
                    <option value={'deny-unless-permit'}>DenyUnlessPermit</option>
                    <option value={'permit-overrides'}>PermitOverrides</option>
                    <option value={'deny-overrides'}>DenyOverrides</option>
                </select>
                <div>
                    <BootstrapTable data={data}>
                        <TableHeaderColumn isKey dataField='rule1'>
                            Rule1
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='rule2'>
                            Rule2
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='result'>
                            CombineResult
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

export default CombineAlgTable;
