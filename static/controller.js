// function to update teh text input of the slider.
const CADDYDIR = "../"
function updateTextInput(slideAmount , sliderAmountVar) {
        var sliderInput = document.getElementById(sliderAmountVar);
        sliderInput.value = slideAmount;

}
// function to update the slider amount based on the text input
function updateSlider(slideAmount , sliderAmountVar) {
        var slider = document.getElementById(sliderAmountVar);
	slider.value = slideAmount;
}



// function to set all a tags to open in a new link
function setNewWindowToAllATags()
{
	var x = document.querySelectorAll("a");
    	for(i =0 ; i< x.length ; i++)
    	x[i].setAttribute("target", "_blank"); 
}

// method to create the json string that is sent to the call_cgi.py file
function createJson() {

// sample json string: json_input: {"tru":"11","next":"0","neb":"0","mtcrb":"0","mtcra":"0","htcrb":"0","htcra":"0","biooSm":"0","bioo6":"0","bioo":"0","amar":"0","barcodes":""}

        var myTable = document.getElementById("selectionTable1");
        var json_string = "{" ;
        for( i =0; i < myTable.rows.length -2; i++)
        {
                var name1 = document.getElementById("barcode_link"+i).href;
                var split = name1.split("=");
                var value1 = document.getElementById("sliderAmount"+i).value;
                json_string+= '"'+split[1]+'":"'+value1+'",' ;

        }
        var preselected = document.getElementById("Preselectedbarcodes").value.trim().replace(/(\s)/gm, ",");
        preselected=preselected.replace(/(,)+/gm, ",");
        json_string+='"barcodes":'+'"'+preselected+'"}' ;

        return json_string;

}

function createJsonDual()
{
	var myTable = document.getElementById("selectionTable1");
       	var myDualRow =  document.getElementById("sliderAmount02");
	var json_string = "[{" ;

	if(myDualRow != null){
		json_string += '"index":"1",';
	}

        for( i =0; i <= myTable.rows.length -3; i++)
        {
                var href = document.getElementById("barcode_link"+i).href;
                var parameters = href.split("?");
		var attributes = parameters[1].split("&");
		var name = attributes[0].split("=")[1] ;
                var value1 = document.getElementById("sliderAmount"+i).value;
                json_string+= '"'+name+'":"'+value1+'",' ;

        }

	var preselected = document.getElementById("Preselectedbarcodes").value.trim().replace(/(\s)/gm, ",");
        preselected=preselected.replace(/(,)+/gm, ",");
        json_string+='"barcodes":'+'"'+preselected+'"' ;
	json_string+="}"

	if(myDualRow != null){
		var myTable2 = document.getElementById("selectionTable2");
		json_string += ',{"index":"2",' ;
        	for( i =0; i <= myTable2.rows.length -3; i++)
        	{
			var href = document.getElementById("barcode_link"+i+"2").href;
                	var parameters = href.split("?");
                	var attributes = parameters[1].split("&");
                	var name = attributes[0].split("=")[1] ;
                	/*var name1 = document.getElementById("barcode_link"+i+"2").href;
                	var split = name1.split("=");*/
                	var value1 = document.getElementById("sliderAmount"+i+"2").value;
                	json_string+= '"'+name+'":"'+value1+'",' ;

        	}
		
		var preselected = document.getElementById("Preselectedbarcodes2").value.trim().replace(/(\s)/gm, ",");
        	preselected=preselected.replace(/(,)+/gm, ",");
       		json_string+='"barcodes":'+'"'+preselected+'"' ;
		json_string+="}"
		
	}
	json_string+="]"
        return json_string;
}

// function to set the reset action for reset button i.e clearing contents of the input table.
function resetAction()
{
        var myTable = document.getElementById("selectionTable1");
	var myTable2 = document.getElementById("selectionTable2");
        //var resetButton = document.getElementById("ResetButton");
	var dualIndex = $("#indexing")[0].checked;
    
        for ( i=0;i<=myTable.rows.length -3 ; i++)
        {
                var sliderAmount = document.getElementById("sliderAmount"+i);
                sliderAmount.value = 0 ;
                var myRange = document.getElementById("myRange"+i);
                myRange.value = 0;
		if(dualIndex == true && myTable2!=null && i<=myTable2.rows.length-3){
			document.getElementById("sliderAmount"+i+"2").value=0;
			document.getElementById("myRange"+i+"2").value=0;
		}
        }
        var preselected = document.getElementById("Preselectedbarcodes")
        preselected.value = "";
	if(dualIndex == true){
		$("#Preselectedbarcodes2")[0].value="";
		$("#barcodeLimitValue")[0].value="";
		$("#barcodeLimitCheck")[0].checked = false;
		enableReturnLimit()
	}
	var results = document.getElementById("results")
	results.innerHTML = "" ;
}


// Show feedback ()  to create the feedback form 
function showFeedback()
{	
// reading the Feedback form and rendering it in the results div.
//Form contents are in Feedback.html.
	$.ajax({
                url:CADDYDIR+ "../src/FeedbackReader.py",
                type: "GET",
                success: function(response){
                        $("#updateTableId").html(response);
                }
		});
	//$("#results").html(response) ;
	window.location.hash = "";
	window.location.hash = "#updateTableId";
}


// function to set the feedback for successful or unsuccessful form submission from mailer.php .
function thanksFeedbackMethod()
{	
	var $form = $('[name="feedbackform"]');

    // Let's select and cache all the fields
    	var $inputs = $form.find("input, textarea");
	var serializedData = $form.serialize();
	$.ajax({
                url:CADDYDIR+ "../php/mailer.php",
                type: "POST",
                data:serializedData , 
                success: function(response){
                        $("#updateTableId").html(response);
                }

            });

}

function redrawMainPanel(indexing){
    var dualIndex = indexing.checked;
    if(dualIndex == true){
    	$.ajax({
                url:CADDYDIR+ "../src/barcode_MainPanel_dual.py",
                type: "POST",
                datatype: "html",
                data:{ dualIndex : dualIndex},
                success: function(response){
                        $("#main-panel").html(response);
                }

            });    
    }
    else{
        $.ajax({
                url: CADDYDIR+"../src/barcode_MainPanel.py",
                type: "POST",
                datatype: "html",
                data:{ dualIndex : dualIndex},
                success: function(response){
                        $("#main-panel").html(response);
                }

            });
    }
}

function onSubmit(){
        var json_string = createJsonDual();
        if($("#Preselectedbarcodes").val().match("[0-9BD-FH-SU-Zbd-fh-su-z]")!=null){
                $("#results").html("<span class='error_message' style='margin:20px; max-width:400px;'>Invalid Input. Please check your input and try again. </span>")
                return null;
        }

	var limit = -1;
	var $limitCheck = document.getElementById("barcodeLimitCheck");
        var barcodeLimitValue =  document.getElementById("barcodeLimitValue");
        if(barcodeLimitValue!=null && $limitCheck.checked)
        {
                if(barcodeLimitValue.value != "" && barcodeLimitValue.value > 0){
                       try{ 
				limit=parseInt(barcodeLimitValue.value);
			}
			catch(err)
			{	
				                $("#results").html("<span class='error_message' style='margin:20px; max-width:400px;'>Invalid Limit Value. Please check your input and try again. </span>")
			}
                }
        }
        $.ajax({
                url:CADDYDIR+ "../src/call_cgi_dual.py",
                type: "POST",
                datatype: "html",
                data:{ json_input : json_string, 'barcodeLimitValue':limit},
                success: function(response){
                        $("#results").html(response);
                }

            });
// the below code is to shift focus to results in a mobile approach
        window.location.hash = "";
        window.location.hash = "#results";
}


function onSubmitDual(){
	
}

function enableReturnLimit(){
	document.getElementById('barcodeLimitValue').disabled = !document.getElementById('barcodeLimitCheck').checked;
	if(document.getElementById('barcodeLimitCheck').checked == true){
		barcodeLimitValue.style.color = "black";
	}
	else{
		barcodeLimitValue.style.color = "grey";
	}
}
