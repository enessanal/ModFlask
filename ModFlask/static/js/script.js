"use strict"


////////////////////////////////////////////
// $(document).ready BEGIN
$(document).ready(function()
{
	setDefaultValuesforInputs()
	checkClientStatus();
	var intervalID = setInterval(function(){ checkClientStatus()}, 3000);




	// Listener $("#chkbox_ClientStatus").change BEGIN
	$("#chkbox_ClientStatus").change(function(event)
	{
		let open_client=$(this).is(":checked")

		if(open_client)
		{
			$(".txt_ipOctet, .txt_portNumber").prop('disabled', true);
		}
		else
		{
			$(".txt_ipOctet, .txt_portNumber").prop('disabled', false);
		}

		let ip_address=$("#txt_IPOctet1").val()+"."+$("#txt_IPOctet2").val()+"."+$("#txt_IPOctet3").val()+"."+$("#txt_IPOctet4").val();
		let port=parseInt($("#txt_portNumber").val())
		
		$.ajax(
		{
			url: "/api/clientstatus",
			type: "POST",
			data: JSON.stringify({open_client,ip_address,port}),
			contentType: 'application/json',
			success: function(response) 
			{
				console.log(response)
			},
			error: function(error) 
			{
				console.log(error)
			},
		});
	});
	// Listener $("#chkbox_ClientStatus").change END



	$(".txt_ipOctet").focusout(function(event) 
	{
		$(this).val(parseInt($(this).val()==""?0:$(this).val()))
		if(parseInt($(this).val()) > 255 || parseInt($(this).val()) < 0 )
		{
			$(this).val(0);
		}
	});

	$(".txt_portNumber").focusout(function(event) 
	{
		$(this).val(parseInt($(this).val()==""?0:$(this).val()))
		if(parseInt($(this).val()) > 65535 || parseInt($(this).val()) < 0 )
		{
			$(this).val(502);
		}
	});






	// Listener $(".txt_ipOctet, .txt_portNumber").keypress BEGIN
	$(".txt_ipOctet, .txt_portNumber").keypress(function(event) 
	{
		if(!(event.which >=48 && event.which<=57))
		{
			event.preventDefault();
		}
	});
	// Listener $(".txt_ipOctet, .txt_portNumber").keypress END



});
// $(document).ready END
////////////////////////////////////////////



////////////////////////////////////////////
// HelperFunctions BEGIN

// Function checkClientStatus BEGIN
function checkClientStatus()
{
	$.ajax(
		{
			url: "/api/clientstatus",
			type: "GET",
			success: function(response) 
			{
				if(JSON.parse(response) && ! $("#chkbox_ClientStatus").is(":checked")) $('#chkbox_ClientStatus').bootstrapToggle("on")
				if(!JSON.parse(response)&& $("#chkbox_ClientStatus").is(":checked")) $('#chkbox_ClientStatus').bootstrapToggle("off")
			},
			error: function(error) 
			{
				console.log(error)
			},
		});
}
// Function checkClientStatus END




// Function setDefaultValuesforInputs BEGIN
function setDefaultValuesforInputs()
{
	$("#txt_IPOctet1").val("127");
	$("#txt_IPOctet2").val("0");
	$("#txt_IPOctet3").val("0");
	$("#txt_IPOctet4").val("1");
	$("#txt_portNumber").val("502");
}
// Function setDefaultValuesforInputs END




// HelperFunctions END
////////////////////////////////////////////






// $(document).ready(function()
// {
// 	$( "#readHRegisterForm" ).submit(function( event ) 
// 	{
// 		$("#btnReadHRegister").attr("disabled", true);
// 		$.ajax(
// 		{
// 			data:JSON.stringify({inputAddress:$("#hregisterAddress").val(),inputQuantity:$("#hregisterQuantity").val()}),
// 			url: '/api/readHRegisters',
// 			type: 'POST',
// 			contentType: 'application/json',
// 			dataType: "json",
// 			success: function(response) 
// 			{
// 				$("#readHRegisterResult").show();
// 				$("#btnReadHRegister").attr("disabled", false);
// 				if(response.bits)
// 				{
// 					$("#readHRegisterResult").html(response.text+"<br>"+response.bits);
// 				}
// 				else
// 				$("#readHRegisterResult").html("Unknown Error");
				
// 			},
// 			error: function(error) 
// 			{
// 				console.log(error)
// 				$("#readHRegisterResult").show();
// 				$("#btnReadHRegister").attr("disabled", false);
// 				$("#readHRegisterResult").html(JSON.stringify(error));
// 			}
// 		});
// 		event.preventDefault();
// 	});




// 	$( "#readInputsForm" ).submit(function( event ) 
// 	{
// 		$("#btnReadInput").attr("disabled", true);
// 		$.ajax(
// 		{
// 			data:JSON.stringify({inputAddress:$("#inputAddress").val(),inputQuantity:$("#inputQuantity").val()}),
// 			url: '/api/readInputs',
// 			type: 'POST',
// 			contentType: 'application/json',
// 			dataType: "json",
// 			success: function(response) 
// 			{
// 				$("#readInputResult").show();
// 				$("#btnReadInput").attr("disabled", false);
// 				if(response.bits)
// 				{
// 					bits=response.bits.map(function(bit){if(bit) return 1; else return 0;});
// 					$("#readInputResult").html(response.text+"<br>"+bits);
// 				}
// 				else
// 				$("#readInputResult").html("Unknown Error");
				
// 			},
// 			error: function(error) 
// 			{
// 				console.log(error)
// 				$("#readInputResult").show();
// 				$("#btnReadInput").attr("disabled", false);
// 				$("#readInputResult").html(JSON.stringify(error));
// 			}
// 		});
// 		event.preventDefault();
// 	});



// 	$( "#readCoilsForm" ).submit(function( event ) 
// 	{
// 		$("#btnReadCoils").attr("disabled", true);
// 		$.ajax(
// 		{
// 			data:JSON.stringify({coilAddress:$("#coilAddress").val(),coilQuantity:$("#quantity").val()}),
// 			url: '/api/readCoils',
// 			type: 'POST',
// 			contentType: 'application/json',
// 			dataType: "json",
// 			success: function(response) 
// 			{
// 				$("#readCoilsResult").show();
// 				$("#btnReadCoils").attr("disabled", false);
// 				if(response.bits)
// 				{
// 					bits=response.bits.map(function(bit){if(bit) return 1; else return 0;});
// 					$("#readCoilsResult").html(response.text+"<br>"+bits);
// 				}
// 				else
// 				$("#readCoilsResult").html("Unknown Error");
				
// 			},
// 			error: function(error) 
// 			{
// 				console.log(error)
// 				$("#readCoilsResult").show();
// 				$("#btnReadCoils").attr("disabled", false);
// 				$("#readCoilsResult").html(JSON.stringify(error));
// 			}
// 		});
// 		event.preventDefault();
// 	});



// 	$( "#writeToCoilsForm" ).submit(function( event ) 
// 	{
// 		$("#btnWriteCoils").attr("disabled", true);
// 		$.ajax(
// 		{
// 			url: '/api/writeCoils',
// 			type: 'POST',
// 			success: function(response) 
// 			{
// 				$("#writeToCoilsResult").show();
// 				$("#writeToCoilsResult").html(response);
// 				$("#btnWriteCoils").attr("disabled", false);
				
// 			},
// 			error: function(error) 
// 			{
// 				$("#writeToCoilsResult").show();
// 				$("#btnWriteCoils").attr("disabled", false);
// 				$("#writeToCoilsResult").html(error);
// 			}
// 		});
// 		event.preventDefault();
// 	});
// });

