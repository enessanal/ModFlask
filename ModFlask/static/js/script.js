"use strict"


////////////////////////////////////////////
// $(document).ready BEGIN
$(document).ready(function()
{
	setDefaultValuesforInputs();
	checkClientStatus();
	var intervalID = setInterval(function(){ checkClientStatus()}, 3000);

	$("#btn_coilSet").click(function(event)
	{
		let coilAddress=parseInt($("#txt_coilAddress").val())
		let bit=1

		$.ajax(
			{
				url:"/api/writeSingleCoil",
				data: JSON.stringify({coilAddress,bit}),
				contentType: 'application/json',
				type: "POST",
				success: function(response) 
				{
					print(response)
				},
				error: function(error) 
				{
					print(error)
				},
			});
	});


	$("#btn_coilReset").click(function(event)
	{
		let coilAddress=parseInt($("#txt_coilAddress").val())
		let bit=0

		$.ajax(
			{
				url:"/api/writeSingleCoil",
				data: JSON.stringify({coilAddress,bit}),
				contentType: 'application/json',
				type: "POST",
				success: function(response) 
				{
					print(response)
				},
				error: function(error) 
				{
					print(error)
				},
			});
	});







	// Listener $("#chkbox_ClientStatus").change BEGIN
	$("#chkbox_ClientStatus").change(function(event)
	{
		let open_client=$(this).is(":checked")

		if (open_client) $(".txt_ipOctet, .txt_portNumber").prop('disabled', true);
		else $(".txt_ipOctet, .txt_portNumber").prop('disabled', false);
	

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
				try 
				{
					let responseObject = JSON.parse(response)
					let ip_address=responseObject["host"]
					let port_number=responseObject["port"]
					let message=responseObject["message"]
					print("%s:%d => %s",ip_address,port_number,message)
					
					if(message=="Client Opened" || message=="Already Opened" ) $("#div_Operations").show()
					if(message=="Client Closed" || message=="Already Closed") $("#div_Operations").hide()

				} 
				catch (exception) 
				{
					print("Can't parse JSON. Original response => "+response)
					print("Error Message => "+exception.message)
				}
			},
			error: function(error) 
			{
				print(error)
			},
		});
	});
	// Listener $("#chkbox_ClientStatus").change END


	// Listener $(".txt_ipOctet").focusout BEGIN
	$(".txt_ipOctet").focusout(function(event) 
	{
		$(this).val(parseInt($(this).val()==""?0:$(this).val()))
		if(parseInt($(this).val()) > 255 || parseInt($(this).val()) < 0 )
		{
			$(this).val(0);
		}
	});
	// Listener $(".txt_ipOctet").focusout END


	// Listener $(".txt_portNumber").focusout BEGIN
	$(".txt_portNumber").focusout(function(event) 
	{
		$(this).val(parseInt($(this).val()==""?0:$(this).val()))
		if(parseInt($(this).val()) > 65535 || parseInt($(this).val()) < 0 )
		{
			$(this).val(502);
		}
	});	
	// Listener $(".txt_portNumber").focusout END


$(".txt_ipOctet, .txt_portNumber").keyup(function(event) 
{
	if(event.which >=48 && event.which<=57)
	{
		if($(this).attr('id')=="txt_IPOctet1" && $(this).val().length > 1 && parseInt($(this).val()) > 25 ){$("#txt_IPOctet2").val(""); $("#txt_IPOctet2").focus(); }
		if($(this).attr('id')=="txt_IPOctet2" && $(this).val().length > 1 && parseInt($(this).val()) > 25 ){$("#txt_IPOctet3").val(""); $("#txt_IPOctet3").focus(); }
		if($(this).attr('id')=="txt_IPOctet3" && $(this).val().length > 1 && parseInt($(this).val()) > 25 ){$("#txt_IPOctet4").val(""); $("#txt_IPOctet4").focus();}
		if($(this).attr('id')=="txt_IPOctet4" && $(this).val().length > 1 && parseInt($(this).val()) > 25 ){$("#txt_portNumber").focus();}
		if($(this).attr('id')=="txt_portNumber" && $(this).val().length > 1 && parseInt($(this).val()) > 9000 ) $(this).blur();
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
				try 
				{
					let responseObject = JSON.parse(response)
					let ip_address=responseObject["host"]
					let port_number=responseObject["port"]
					let message=responseObject["message"]==	"true"?true:false
					

					if(message && ! $("#chkbox_ClientStatus").is(":checked"))
					{ 
						print("%s:%d => %s (Check:%o)",ip_address,port_number,message,$("#chkbox_ClientStatus").is(":checked"))
						$('#chkbox_ClientStatus').bootstrapToggle("on")
						
						
						$("#txt_IPOctet1").val(ip_address.split(".")[0]);
						$("#txt_IPOctet2").val(ip_address.split(".")[1]);
						$("#txt_IPOctet3").val(ip_address.split(".")[2]);
						$("#txt_IPOctet4").val(ip_address.split(".")[3]);
						$("#txt_portNumber").val(port_number);
					}
					if(! message && $("#chkbox_ClientStatus").is(":checked")) 
					{
						$('#chkbox_ClientStatus').bootstrapToggle("on")
						print("%s:%d => %s (Check:%o)",ip_address,port_number,message,$("#chkbox_ClientStatus").is(":checked"))
						$('#chkbox_ClientStatus').bootstrapToggle("off")
					}
				} 
				catch (exception) 
				{
					print("Can't parse JSON. Original response => "+response)
					print("Error Message => "+exception.message)
				}
			},
			error: function(error) 
			{
				print(error)
			},
		});
}
// Function checkClientStatus END




// Function setDefaultValuesforInputs BEGIN
function setDefaultValuesforInputs()
{
	$("#txt_coilAddress").val("0");
	$("#txt_IPOctet1").val("127");
	$("#txt_IPOctet2").val("0");
	$("#txt_IPOctet3").val("0");
	$("#txt_IPOctet4").val("1");
	$("#txt_portNumber").val("502");
}
// Function setDefaultValuesforInputs END


// Function print BEGIN
function print(...strings)
{
  console.log(...strings);
}
// Function print END


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
// 				print(error)
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
// 				print(error)
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
// 				print(error)
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

