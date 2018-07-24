
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
			<input type="text" className={this.props.className} placeholder={this.props.placeholder}>

			</input>
		);
	}
}

class CreationOfButtons extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			tableNames: ['patient_nucleobase','pathogenic_prob'],
			attributes:['patient_id','seq','pos','left_flank','ref_allele','right_flank','Variant','Cov_variant_minus','Cov_minus','Cov_variant_plus','Cov_plus','freq_variant_minus','freq_variant_plus'],
			operatorAndOr: ['And', 'Or'],
			condition: ['=','like','!=','<=','>=','<','>'],
			data: '[{"seq":"ATP6","patient_id":"8527"},{"seq":"ATP8","patient_id":"8366"},{"seq":"ZTP12" , "patient_id":"2334"} , {"seq":"Bdfd","patient_id":"1000000"}]',
//		columns: [{
//    Header: 'Sequence',
//    accessor: 'seq' // String-based value accessors!
//  }, {
//    Header: 'Patient_Id',
//    accessor: 'patient_id',
//    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
//  }]

		};

 
		//this.baseState = this.state
	}


	renderTextArea( className){
		return <TextBox className={className} /> ;
	}

	render(){

		return (
			<div>
				<span className="label_show">Choose table:</span> {this.renderSelectionBox(this.state.tableNames, "Select a table", "tableNamesId")}
				<br/>
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
//	{/*updateDiv(){
//		let jsonParsedData = JSON.parse(this.state.data)
//		ReactDOM.render(<ReactTable data={jsonParsedData} columns={this.state.columns} defaultPageSize={5}/> , document.getElementById('updateTableId')) ;

//	}*/}

	updateDiv(){
	$.ajax({
                 url: "/renderTableContents/patient_nucleobase",
                 type: "POST",
                 datatype: "text/html",
                 data:"",
                 success: function(response){
		//console.log(response["content"])
		let jsonParsedData = JSON.parse(response)
		console.log(jsonParsedData["content"])
		//let jsonParsedData = response
		ReactDOM.render(<ReactTable data={jsonParsedData["content"]} columns={jsonParsedData["columns"]} defaultPageSize={10}/> , document.getElementById('updateTableId')) ;
                 }
});

	}

 resetFunctionality(){

	// const filterDivChildren = document.getElementById("filterDiv").childNodes
	{/*const filterDivChildren = document.getElementById("filterDiv")
	// let childrenlen = filterDivChildren.length
	 for (let i = 0; i < filterDivChildren.length; i++) {

		 //document.getElementById("filterDiv").removeChild(filterDivChildren[i])
		 filterDivChildren.removeChild(filterDivChildren.childNodes[i])
		 //ReactDOM.unmountComponentAtNode(document.getElementById(filterDivChildren[i].id))
	 }
	 */}

	 const filterDivChildren = document.getElementById("filterDiv")
	 while(filterDivChildren.hasChildNodes()){
		 filterDivChildren.removeChild(filterDivChildren.firstChild);
	 }

	ReactDOM.unmountComponentAtNode(document.getElementById("updateTableId"))

 }

 removeFilter(id){

	 ReactDOM.unmountComponentAtNode(document.getElementById(id))

 }


	addFilterMethod() {

			const id = Math.random()
			const newdiv = (<div>

				<br/>
				{this.renderSelectionBox(this.state.operatorAndOr, "Select operator","operatorsId")}
				{' '}
				{this.renderSelectionBox(this.state.attributes, "Select attribute", "attributesId")}
				{' '}
				{this.renderSelectionBox(this.state.condition, "Select condition","conditionsId")}
				{' '}
				{/*this.renderTextArea("condition")*/}
				<TextInput className="condition" placeholder="Give condition"/>
				{' '}
				<ButtonRequired className="btn btn-danger" value="&times;" onClick={() => this.removeFilter(id)}/> {' '}
			</div>)
			const d = document.createElement("div")
			d.id = id
			document.getElementById("filterDiv").appendChild(d)

		ReactDOM.render(newdiv, document.getElementById(id));

	}

	renderSelectionBox(optionsToShow, defaultLabel , id){
		return <SelectionBox value={optionsToShow} defaultLabel={defaultLabel} id={id}/>
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

	render(){
		return (
			<select>
				<option selected disabled>{this.props.defaultLabel}</option>
				{this.createOptions(this.props.value)}
			</select>

		);
	}

}




ReactDOM.render(<CreationOfButtons/>, document.getElementById('queryCreationDivId'));
