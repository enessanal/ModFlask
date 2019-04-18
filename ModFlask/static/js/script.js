"use strict"

////////////////////////////////////////////
// $(document).ready BEGIN
$(document).ready(function()
{
	$(document).on('keypress',function(e) 
	{
		if(e.which == 13) 
		{
			if(!$("#chkbox_ClientStatus").is(":checked")) 
			{ 
				$('#chkbox_ClientStatus').bootstrapToggle("on")
			}
		}
});

	setDefaultValuesforInputs();
	checkClientStatus();
	var intervalID = setInterval(function(){ checkClientStatus()}, 3000);



	// $(".input-strict-digit").keypress(function(event)
	// {
		
	// 	if(!(event.which >=48 && event.which<=57))
	// 	{
	// 		event.preventDefault();
	// 	}
	// });


	
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
	
	$("#txt_quantityCoils").keypress(function(event) 
	{
		if(!(event.which >=48 && event.which<=57))
		{
			event.preventDefault();
		}
	});		

	$("#txt_coilsArray").keypress(function(event) 
	{
		if(event.which != 48 && event.which != 49)
		{
			event.preventDefault();
		}
	});	

	$("#txt_coilStartAddress, #txt_readCoilStartAddress, #txt_coilAddress, #txt_registerAddress, #txt_registerValue").keypress(function(event) 
	{
		if(!(event.which >=48 && event.which<=57))
		{
			event.preventDefault();
		}
	});	

///////////////////////////////////////////////////////////////////////////////////////////


	$("#btn_receiveInputRegisters").click(function(event)
	{
		$("#div_Results_Input_Registers").removeClass("alert-primary alert-secondary alert-success alert-danger alert-warning alert-info alert-light alert-dark");
		$("#div_Results_Input_Registers").slideUp();
		$("#div_Results_Input_Registers").text("");

		let registerAddress=parseInt($("#txt_readInputRegisterStartAddress").val())
		let quantity=parseInt($("#txt_readQuantityInputRegisters").val())

		$.ajax(
		{
			url:"/api/readInputRegisters",
			data: JSON.stringify({registerAddress,quantity}),
			contentType: 'application/json',
			type: "POST",
			success: function(response) 
			{
				try 
				{
					let responseObject = JSON.parse(response)
					let ip_address=responseObject["host"]
					let port_number=responseObject["port"]
					let message=responseObject["message"]
					let responseData=responseObject["response"]
					print(`${ip_address}:${port_number} => ${message}, response:${responseData}`)

					$("#div_Results_Input_Registers").text(responseData);
					$("#div_Results_Input_Registers").addClass("alert-success");
					$("#div_Results_Input_Registers").slideDown();
				} 
				catch (exception)
				{
					let r1=`Can't parse JSON. Original response => ${response}`;
					let r2=`Error Message => +${exception.message}`;
					print(r1)
					print(r2)
					let r3=r1+"<br>"+r2
				
					$("#div_Results_Input_Registers").text(r3);
					$("#div_Results_Input_Registers").addClass("alert-warning");
					$("#div_Results_Input_Registers").slideDown();

				}
			},
			error: function(error) 
			{				
				print(error)
				$("#div_Results_Input_Registers").text(error);
				$("#div_Results_Input_Registers").addClass("alert-danger");
				$("#div_Results_Input_Registers").slideDown();
			},
		});
	});

	$("#btn_receiveContacts").click(function(event)
	{
		$("#div_Results_Contacts").removeClass("alert-primary alert-secondary alert-success alert-danger alert-warning alert-info alert-light alert-dark");
		$("#div_Results_Contacts").slideUp();
		$("#div_Results_Contacts").text("");


		let contactAddress=parseInt($("#txt_readContactStartAddress").val())
		let quantity=parseInt($("#txt_readQuantityContacts").val())

		$.ajax(
		{
			url:"/api/readContacts",
			data: JSON.stringify({contactAddress,quantity}),
			contentType: 'application/json',
			type: "POST",
			success: function(response) 
			{
				try 
				{
					let responseObject = JSON.parse(response)
					let ip_address=responseObject["host"]
					let port_number=responseObject["port"]
					let message=responseObject["message"]
					let responseData=responseObject["response"]
					print(`${ip_address}:${port_number} => ${message}, response:${responseData}`)


					$("#div_Results_Contacts").text(responseData);
					$("#div_Results_Contacts").addClass("alert-success");
					$("#div_Results_Contacts").slideDown();
				} 
				catch (exception) 
				{
					let r1=`Can't parse JSON. Original response => ${response}`;
					let r2=`Error Message => +${exception.message}`;
					print(r1)
					print(r2)
					let r3=r1+"<br>"+r2
				
					$("#div_Results_Contacts").text(r3);
					$("#div_Results_Contacts").addClass("alert-warning");
					$("#div_Results_Contacts").slideDown();
				}
			},
			error: function(error) 
			{
				print(error)
				$("#div_Results_Contacts").text(error);
				$("#div_Results_Contacts").addClass("alert-danger");
				$("#div_Results_Contacts").slideDown();
			},
		});
	});

	$("#btn_receiveRegisters").click(function(event)
	{		
		$("#div_Results_Registers").removeClass("alert-primary alert-secondary alert-success alert-danger alert-warning alert-info alert-light alert-dark");
		$("#div_Results_Registers").slideUp();
		$("#div_Results_Registers").text("");

		let registerAddress=parseInt($("#txt_readRegisterStartAddress").val())
		let quantity=parseInt($("#txt_readQuantityRegisters").val())

		$.ajax(
		{
			url:"/api/readRegisters",
			data: JSON.stringify({registerAddress,quantity}),
			contentType: 'application/json',
			type: "POST",
			success: function(response) 
			{
				try 
				{
					let responseObject = JSON.parse(response)
					let ip_address=responseObject["host"]
					let port_number=responseObject["port"]
					let message=responseObject["message"]
					let responseData=responseObject["response"]
					print(`${ip_address}:${port_number} => ${message}, response:${responseData}`)

					$("#div_Results_Registers").text(responseData);
					$("#div_Results_Registers").addClass("alert-success");
					$("#div_Results_Registers").slideDown();
				} 
				catch (exception) 
				{					
					let r1=`Can't parse JSON. Original response => ${response}`;
					let r2=`Error Message => +${exception.message}`;
					print(r1)
					print(r2)
					let r3=r1+"<br>"+r2
				
					$("#div_Results_Registers").text(r3);
					$("#div_Results_Registers").addClass("alert-warning");
					$("#div_Results_Registers").slideDown();
				}
			},
			error: function(error) 
			{
				print(error)
				$("#div_Results_Registers").text(error);
				$("#div_Results_Registers").addClass("alert-danger");
				$("#div_Results_Registers").slideDown();
			},
		});
	});

	$("#btn_sendRegisters").click(function(event)
	{
		let registerStartAddress =	parseInt($("#txt_registerStartAddress").val());
		let quantityRegisters =	parseInt($("#txt_quantityRegisters").val());
		let registersArray=[];
		$("#txt_registersArray").val(replace_all($("#txt_registersArray").val()," ",""));

		$("#txt_registersArray").val().split(",").forEach(value => {registersArray.push(parseInt(value));});
		$.ajax(
			{
				url:"/api/writeMultipleRegisters",
				type:"POST",
				contentType:"application/json",
				data:JSON.stringify({registerStartAddress,quantityRegisters,registersArray}),
				success: function(response)
				{
					try 
					{
						let responseObject = JSON.parse(response)
						let ip_address=responseObject["host"]
						let port_number=responseObject["port"]
						let message=responseObject["message"]
						print(`${ip_address}:${port_number} => ${message}`)
						
					} 
					catch (exception) 
					{
						let r1=`Can't parse JSON. Original response => ${response}`;
						let r2=`Error Message => +${exception.message}`;
						print(r1)
						print(r2)
					}
				},
				error: function(error)
				{
					print(error.message)
				}
		});
	});

	$("#btn_sendRegister").click(function(event)
	{
		let registerAddress =	parseInt($("#txt_registerAddress").val());
		let registerValue =	parseInt($("#txt_registerValue").val());

		$.ajax(
			{
				url:"/api/writeRegister",
				type:"POST",
				contentType:"application/json",
				data:JSON.stringify({registerAddress,registerValue}),
				success: function(response)
				{
					try 
					{
						let responseObject = JSON.parse(response)
						let ip_address=responseObject["host"]
						let port_number=responseObject["port"]
						let message=responseObject["message"]
						print(`${ip_address}:${port_number} => ${message}`)
					} 
					catch (exception) 
					{
						print(`Can't parse JSON. Original response => ${response}`)
						print(`Error Message => +${exception.message}`)
					}
				},
				error: function(error)
				{
					print(error.message)
				}
		});
	});

	$("#btn_sendCoils").click(function(event)
	{
		let coilStartAddress =	parseInt($("#txt_coilStartAddress").val());
		let quantityCoils =	parseInt($("#txt_quantityCoils").val());
		let coilsArray=[];
		$("#txt_coilsArray").val().split("").forEach(char => {coilsArray.push(parseInt(char));});

		$.ajax(
			{
				url:"/api/writeMultipleCoils",
				type:"POST",
				contentType:"application/json",
				data:JSON.stringify({coilStartAddress,quantityCoils,coilsArray}),
				success: function(response)
				{
					try 
					{
						let responseObject = JSON.parse(response)
						let ip_address=responseObject["host"]
						let port_number=responseObject["port"]
						let message=responseObject["message"]
						print(`${ip_address}:${port_number} => ${message}`)
					} 
					catch (exception) 
					{
						print(`Can't parse JSON. Original response => ${response}`)
						print(`Error Message => +${exception.message}`)
					}
				},
				error: function(error)
				{
					print(error.message)
				}
		});
	});

	$(".btn_singleCoil").click(function(event)
	{
		let coilAddress=parseInt($("#txt_coilAddress").val())
		let bit = 0
		if($(this).attr("id") == "btn_coilSet") bit = 1

		$.ajax(
			{
				url:"/api/writeSingleCoil",
				data: JSON.stringify({coilAddress,bit}),
				contentType: 'application/json',
				type: "POST",
				success: function(response) 
				{
					try 
					{
						let responseObject = JSON.parse(response)
						let ip_address=responseObject["host"]
						let port_number=responseObject["port"]
						let message=responseObject["message"]
						print(`${ip_address}:${port_number} => ${message}`)
					} 
					catch (exception) 
					{
						print(`Can't parse JSON. Original response => ${response}`)
						print(`Error Message => +${exception.message}`)
					}
				},
				error: function(error) 
				{
					print(error)
				},
			});
	});
	
	$("#btn_receiveCoils").click(function(event)
	{
		$("#div_Results_Coils").removeClass("alert-primary alert-secondary alert-success alert-danger alert-warning alert-info alert-light alert-dark");
		$("#div_Results_Coils").slideUp();
		$("#div_Results_Coils").text("");


		let coilAddress=parseInt($("#txt_readCoilStartAddress").val())
		let quantity=parseInt($("#txt_readQuantityCoils").val())

		$.ajax(
		{
			url:"/api/readCoils",
			data: JSON.stringify({coilAddress,quantity}),
			contentType: 'application/json',
			type: "POST",
			success: function(response) 
			{
				try 
				{
					let responseObject = JSON.parse(response)
					let ip_address=responseObject["host"]
					let port_number=responseObject["port"]
					let message=responseObject["message"]
					let responseData=responseObject["response"]
					print(`${ip_address}:${port_number} => ${message}, response:${responseData}`)

					$("#div_Results_Coils").text(responseData);
					$("#div_Results_Coils").addClass("alert-success");
					$("#div_Results_Coils").slideDown();

				} 
				catch (exception) 
				{
					let r1=`Can't parse JSON. Original response => ${response}`;
					let r2=`Error Message => +${exception.message}`;
					print(r1)
					print(r2)
					let r3=r1+"<br>"+r2
					
					$("#div_Results_Coils").text(r3);
					$("#div_Results_Coils").addClass("alert-danger");
					$("#div_Results_Coils").slideDown();
				}
			},
			error: function(error) 
			{
				print(error)
				$("#div_Results_Coils").text(error);
				$("#div_Results_Coils").addClass("alert-warning");
				$("#div_Results_Coils").slideDown();
			},
		});
	});
	
	$("#txt_quantityCoils").focusout(function(event) 
	{
		$("#txt_coilsArray").attr("maxlength",$(this).val());
		$("#txt_coilsArray").val("0".repeat($(this).val()))
	});	

	// Listener $("#chkbox_ClientStatus").change BEGIN
	$("#chkbox_ClientStatus").change(function(event)
	{
		let open_client=$(this).is(":checked")

		if (open_client) $(".txt_ipOctet, .txt_portNumber").prop('disabled', true);
		else 
		{
			$(".txt_ipOctet, .txt_portNumber").prop('disabled', false);
			$(".div_result").hide()
			$("#div_Operations").fadeOut()
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
				try 
				{
					let responseObject = JSON.parse(response)
					let ip_address=responseObject["host"]
					let port_number=responseObject["port"]
					let message=responseObject["message"]
					print(`${ip_address}:${port_number} => ${message}`)
					
					if(message=="Client Opened" || message=="Already Opened" ) $("#div_Operations").fadeIn()
					if(message=="Client Closed" || message=="Already Closed") $("#div_Operations").fadeOut()
					// if(message=="Client Opened" || message=="Already Opened" ) $("#div_Operations").slideDown()
					// if(message=="Client Closed" || message=="Already Closed") $("#div_Operations").slideUp()

				} 
				catch (exception) 
				{
					print(`Can't parse JSON. Original response => ${response}`)
					print(`Error Message => +${exception.message}`)
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
						print(`${ip_address}:${port_number} => ${message} (Check:${$("#chkbox_ClientStatus").is(":checked")})`)
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
						print(`${ip_address}:${port_number} => ${message} (Check:${$("#chkbox_ClientStatus").is(":checked")})`)
						$('#chkbox_ClientStatus').bootstrapToggle("off")
					}
				} 
				catch (exception) 
				{
					print(`Can't parse JSON. Original response => ${response}`)
					print(`Error Message => +${exception.message}`)
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
	$("#txt_readContactStartAddress").val(0)
	$("#txt_readQuantityContacts").val(10)

	$("#txt_readInputRegisterStartAddress").val(0)
	$("#txt_readQuantityInputRegisters").val(10)

	
	$("#txt_readRegisterStartAddress").val(0)
	$("#txt_readQuantityRegisters").val(10)

	$("#txt_registerStartAddress").val(0)
	$("#txt_quantityRegisters").val(10)

	$("#txt_registersArray").val("0,0,0,0,0,0,0,0,0,0")
	$("#txt_registerAddress").val(0)
	$("#txt_registerValue").val(65535)

	$("#txt_readCoilStartAddress").val(0)
	$("#txt_readQuantityCoils").val(10)

	$("#txt_coilsArray").val("1111100000");
	$("#txt_quantityCoils").val("10");
	$("#txt_coilsArray").attr("maxlength",$("#txt_quantityCoils").val());

	$("#txt_coilStartAddress").val("0");
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

// Function replace_all BEGIN
function replace_all(string, old_phrase, new_phrase)
{
	return string.replace(new RegExp(old_phrase,"g"),new_phrase)
}
// Function replace_all END




// HelperFunctions END
////////////////////////////////////////////
