$(document).ready(function()
{
	checkClientStatus();
	var intervalID = setInterval(function(){ checkClientStatus()}, 3000);

	










	$("#chkbox_ClientStatus").change(function(event)
	{
		let open_client=$(this).is(":checked")
		// $(this).attr("disabled", true);
		// $(this).addClass("disabled")
		
	
		$.ajax(
		{
			url: "/api/clientstatus",
			type: "POST",
			data: JSON.stringify(open_client),
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
});


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

