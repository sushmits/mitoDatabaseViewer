//import './index.css';
//import ReactTable from 'react-table'

class ButtonRequired extends React.Component {
	render(){
		return (
			<button className={this.props.className} onClick={this.props.onClick}>
				{this.props.value}
			</button>
		);
	}
}

class TextInput extends React.Component {
	render(){
		return (
			<input type="text" className={this.props.className} placeholder={this.props.placeholder} onChange={this.handleChange}>

			</input>
		);
	}

	handleChange = (e) => {
                this.props.onChange(this.props.id, this.props.defaultLabel, e.target.value);
        }
}

class CreationOfButtons extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		
			tableNames: [],
			attributes: [],
			operatorAndOr: ['And', 'Or'],
			condition: ['=','like','!=','<=','>=','<','>'],
			queryData:{
				tableName: null,
				filters: null
			}
		};
		this.getExistingTables()
		this.changeTableName = this.changeTableName.bind(this);
		this.updateFilter = this.updateFilter.bind(this); 
		//this.baseState = this.state
		// Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
	}


	renderTextArea( className){
		return <TextBox className={className} /> ;
	}


	updateFilter(id, inputType, value){
		const fid = "id"+id
		this.setState(prevState => ({
    			...prevState,
    				queryData: {
        				...prevState.queryData,
        					filters: {
            						...prevState.queryData.filters, 
            							[fid]: {
               								...prevState.queryData.filters[fid],
               									[inputType]: value
								            }
        						}
    						}
					}))		

	}


        getExistingTables(){

                axios.post('/getTables')
                        .then(response => {
                               	this.setState({
                                        tableNames:response.data.tables
                                })

                        })
                        .catch(error => console.log("Error in fetching existing tables:", error));

        }


	changeTableName(id, tableList, newTableName){
		
		const queryJson = this.state.queryData	
		var updatedTable = Object.assign({}, queryJson, {tableName:newTableName});
		this.setState({queryData:updatedTable});
		this.resetFunctionality();

		axios.post('/renderAttributeNames/'+newTableName)
                        .then(response => {
                                console.log("attributes",response.data.columns)
                                this.setState({
                                        attributes:response.data.columns
                                })

                        })
                        .catch(error => console.log("Error in fetching attributes:", error));
	
	}

	render(){

		return (
			<div>
				<span className="label_show">Choose table:</span> {this.renderSelectionBox(this.state.tableNames, "Select a table", "tableNamesId", this.changeTableName)}
				<br/><br/>
				<ButtonRequired className="btn btn-primary" value="add Filter" onClick={() => this.addFilterMethod()} /> {' '}
				<ButtonRequired className="btn btn-primary" value="Submit" onClick={() => this.updateDiv()}/> {' '}
				<ButtonRequired className="btn btn-primary" value="Reset" onClick={() => this.resetFunctionality()}/> {' '}
				<br/>
				<br/>
				<div id="filterDiv" >
				</div>
			</div>
		);

	}

	showTableData(){
	
		const tableData = this.state.tableData
		ReactDOM.render(<ReactTable data={tableData["content"]} columns={tableData["columns"]} defaultPageSize={10}/> , document.getElementById('updateTableId')) ;
	
	}

	updateDiv(){

	console.log(this.state.queryData)	
		
		const table = this.state.queryData.tableName

		if(table){

		axios.post('/renderTableContents/'+table, this.state.queryData)
                        .then(response => {
                                this.setState({
					tableData: response.data
                                })
				this.showTableData();
                        })
                        .catch(error => console.log("Error in fetching table contents:", error));


		}
		else{
			alert('Please select a table first!')
		}


	}

	 resetFunctionality(){

	 	const filterDivChildren = document.getElementById("filterDiv")
	 	while(filterDivChildren.hasChildNodes()){
			 filterDivChildren.removeChild(filterDivChildren.firstChild);
		 }

                this.setState(prevState => ({
                        ...prevState,
                                queryData: {
                                        ...prevState.queryData,
                                                filters: null
                                                }
                                        , tableData:null }))

		ReactDOM.unmountComponentAtNode(document.getElementById("updateTableId"))
 	}

	 removeFilter(id){

		const fid = "id"+id
                this.setState(prevState => ({
                        ...prevState,
                                queryData: {
                                        ...prevState.queryData,
                                                filters: {
                                                        ...prevState.queryData.filters,
                                                                [fid]: null
                                                        }
                                                }
                                        }))

		 ReactDOM.unmountComponentAtNode(document.getElementById(id))

	 }	
	
	addFilterToState(id){
		
		const fid = "id"+id
        	this.setState(prevState => ({
                        ...prevState,
                                queryData: {
                                        ...prevState.queryData,
                                                filters: {
                                                        ...prevState.queryData.filters,
                                                                [fid]: {
                                                                        operator:null, attr:null, condition:null, text:null
                                                                            }
                                                        }
                                                }
                                        }))


	}

	addFilterMethod() {

		if(this.state.queryData.tableName){

			const id = Math.random()
			const newdiv = (<div>

				<br/>
				{this.renderSelectionBox(this.state.operatorAndOr, "operator",id, this.updateFilter)}
				{' '}
				{this.renderSelectionBox(this.state.attributes, "attr", id, this.updateFilter)}
				{' '}
				{this.renderSelectionBox(this.state.condition, "condition",id, this.updateFilter)}
				{' '}
				{/*this.renderTextArea("condition")*/}
				<TextInput className="condition" placeholder="Give condition" id={id} defaultLabel="text" onChange={this.updateFilter}/>
				{' '}
				<ButtonRequired className="btn btn-danger" value="&times;" onClick={() => this.removeFilter(id)}/> {' '}
			</div>)
			const d = document.createElement("div")
			d.id = id
			document.getElementById("filterDiv").appendChild(d)

			this.addFilterToState(id);

		ReactDOM.render(newdiv, document.getElementById(id));
		}
		else{
			alert('Please select a table first!')
		}

	}

	renderSelectionBox(optionsToShow, defaultLabel , id, onChangeFn){
		return <SelectionBox value={optionsToShow} defaultLabel={defaultLabel} id={id} onChange={onChangeFn}/>
	}
}

class TextBox extends React.Component {
	render(){
		return (
			<textarea placeholder={"Your query will be built here"}>
			</textarea>
		);
	}


}


// changes on friday

function Option(props) {
	return (
		<option className="options" >
			{props.value}
		</option>
	);
}

class SelectionBox extends React.Component{

	constructor(props) {
        	super(props);
        	this.state = {
            		selectValue: null
		}

    	}

	createOptions = (valuePassed) => {
		let optionsList = []

		// Outer loop to create parent
		for (let i = 0; i < valuePassed.length; i++) {


			optionsList.push(this.renderOption(valuePassed[i]))
		}

		return optionsList ;
	}



	renderOption(i) {
		return (
			<Option
				value={i}
				//onClick={() => this.handleClick(i)}
			/>
		);
	}

	handleChange = (e) => {
		{/*this.setState({selectValue:e.target.value});*/}
		this.props.onChange(this.props.id, this.props.defaultLabel, e.target.value);
	}

	render(){

		return (
			<select onChange={this.handleChange}>
			
				<option selected disabled>{this.props.defaultLabel}</option>
				{this.createOptions(this.props.value)}
			</select>

		);
	}

}

ReactDOM.render(<CreationOfButtons/>, document.getElementById('queryCreationDivId'));
