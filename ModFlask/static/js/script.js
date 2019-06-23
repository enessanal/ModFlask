"use strict"

const txtID_PortNumber="#txt_portNumber";
const txtIDs_IPOctets=["#txt_IPOctet1","#txt_IPOctet2","#txt_IPOctet3","#txt_IPOctet4"]
const chkBxID_clientStatus="#chkbox_ClientStatus"
const txtClass_IpOctets=".txt_ipOctet";








////////////////////////////////////////////
// $(document).ready BEGIN
$(document).ready(function()
{

	setDefaultValuesforInputs();
	checkClientStatus();
	var intervalID = setInterval(function(){ checkClientStatus()}, 3000);
	

	$(merge_selectors(txtClass_IpOctets, txtID_PortNumber)).keyup(function(event) 
	{
		if(event.which >=48 && event.which<=57)
		{
			let ID_this="#"+$(this).attr('id');
			let value_this=$(this).val();

			if(ID_this==txtIDs_IPOctets[0] && value_this.length > 1 && parseInt(value_this) > 25 ) { $(txtIDs_IPOctets[1]).val(""); $(txtIDs_IPOctets[1]).focus(); }
			if(ID_this==txtIDs_IPOctets[1] && value_this.length > 1 && parseInt(value_this) > 25 ) { $(txtIDs_IPOctets[2]).val(""); $(txtIDs_IPOctets[2]).focus(); }
			if(ID_this==txtIDs_IPOctets[2] && value_this.length > 1 && parseInt(value_this) > 25 ) { $(txtIDs_IPOctets[3]).val(""); $(txtIDs_IPOctets[3]).focus(); }
			if(ID_this==txtIDs_IPOctets[3] && value_this.length > 1 && parseInt(value_this) > 25 ) { $(txtID_PortNumber).focus(); }
			if(ID_this==txtID_PortNumber && value_this.length > 1 && parseInt(value_this) > 9000 ) { $(this).blur(); }
		}

	});


	$(merge_selectors(txtClass_IpOctets,txtID_PortNumber)).keypress(function(event) 
	{
		if(!(event.which >=48 && event.which<=57))
		{
			event.preventDefault();
		}
	});

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
					let console_message=`${ip_address}:${port_number} => ${message}, response:${responseData}`
					print(console_message)
					if(responseObject["statusCode"]==1500)
					{
						$("#div_Results_Input_Registers").text(console_message);
						$("#div_Results_Input_Registers").addClass("alert-warning");
						$("#div_Results_Input_Registers").slideDown();
					}
					else
					{
						$("#div_Results_Input_Registers").text(responseData);
						$("#div_Results_Input_Registers").addClass("alert-success");
						$("#div_Results_Input_Registers").slideDown();
					}
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
					let console_message=`${ip_address}:${port_number} => ${message}, response:${responseData}`
					print(console_message)
					if(responseObject["statusCode"]==1500)
					{
						$("#div_Results_Contacts").text(console_message);
						$("#div_Results_Contacts").addClass("alert-warning");
						$("#div_Results_Contacts").slideDown();
					}
					else
					{
						$("#div_Results_Contacts").text(responseData);
						$("#div_Results_Contacts").addClass("alert-success");
						$("#div_Results_Contacts").slideDown();
					}
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
					let console_message=`${ip_address}:${port_number} => ${message}, response:${responseData}`
					print(console_message)
					if(responseObject["statusCode"]==1500)
					{
						$("#div_Results_Registers").text(console_message);
						$("#div_Results_Registers").addClass("alert-warning");
						$("#div_Results_Registers").slideDown();
					}
					else
					{
						$("#div_Results_Registers").text(responseData);
						$("#div_Results_Registers").addClass("alert-success");
						$("#div_Results_Registers").slideDown();
					}
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
					let console_message=`${ip_address}:${port_number} => ${message}, response:${responseData}`
					print(console_message)
					if(responseObject["statusCode"]==1500)
					{
						$("#div_Results_Coils").text(console_message);
						$("#div_Results_Coils").addClass("alert-warning");
						$("#div_Results_Coils").slideDown();
					}
					else
					{
						$("#div_Results_Coils").text(responseData);
						$("#div_Results_Coils").addClass("alert-success");
						$("#div_Results_Coils").slideDown();
					}
				} 
				catch(exception) 
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



	$(chkBxID_clientStatus).change(function(event)
	{
		let open_client=$(this).is(":checked")
		
		if (open_client) 
		{
			print(open_client)
			$("#img_connectionSpinner").show()
			$(txtClass_IpOctets).prop('disabled', true);
			$(txtID_PortNumber).prop('disabled', true);
			
		
		}
		else 
		{
			$(txtClass_IpOctets).prop('disabled', false);
			$(txtID_PortNumber).prop('disabled', false);
			$(".div_result").hide()
			$("#div_Operations").fadeOut()
		}

		let ip_address=$(txtIDs_IPOctets[0]).val()+"."+$(txtIDs_IPOctets[1]).val()+"."+$(txtIDs_IPOctets[2]).val()+"."+$(txtIDs_IPOctets[3]).val();
		let port=parseInt($(txtID_PortNumber).val());
		
		$.ajax(
		{
			url: "/api/clientstatus",
			type: "POST",
			data: JSON.stringify({open_client,ip_address,port}),
			contentType: 'application/json',
			success: function(response) 
			{
				$("#img_connectionSpinner").hide()
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
				$("#img_connectionSpinner").hide()
				print(error)
			},
		});
	});



	$(txtClass_IpOctets).focusout(function(event) 
	{
		$(this).val(parseInt($(this).val()==""?0:$(this).val()))
		if(parseInt($(this).val()) > 255 || parseInt($(this).val()) < 0 )
		{
			$(this).val(0);
		}
	});



	$(txtID_PortNumber).focusout(function(event) 
	{
		$(this).val(parseInt($(this).val()==""?0:$(this).val()))
		if(parseInt($(this).val()) > 65535 || parseInt($(this).val()) < 0 )
		{
			$(this).val(502);
		}
	});	

	// $(document).on('keypress) BEGIN
	$(document).on('keypress',function(e) 
	{
		if(e.which == 13) 
		{
			if(!$(chkBxID_clientStatus).is(":checked")) 
			{ 
				$(chkBxID_clientStatus).bootstrapToggle("on")
			}
		}
});
	// $(document).on('keypress) END


	jQuery("#txt_IPOctet1").on('paste', function(e)
	{
		$("#txt_IPOctet1").attr("maxlength",40);
		setTimeout(function() 
		{
			let textValue=$("#txt_IPOctet1").val();

			if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(textValue))
			{
				
				let octets = textValue.split(".");
				$("#txt_IPOctet1").val(octets[0]);
				$("#txt_IPOctet2").val(octets[1]);
				$("#txt_IPOctet3").val(octets[2]);
				$("#txt_IPOctet4").val(octets[3]);
				$("#txt_IPOctet1").attr("maxlength",3);
			}
			else
			{
				$("#txt_IPOctet1").val(127);
				$("#txt_IPOctet1").attr("maxlength",3);
			}
			$("#txt_IPOctet1").attr("maxlength",3);
		},10);
});








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
					

					if(message && ! $(chkBxID_clientStatus).is(":checked"))
					{ 
						print(`${ip_address}:${port_number} => ${message} (Check:${$(chkBxID_clientStatus).is(":checked")})`)
						$(chkBxID_clientStatus).bootstrapToggle("on")

						$(txtIDs_IPOctets[0]).val(ip_address.split(".")[0]);
						$(txtIDs_IPOctets[1]).val(ip_address.split(".")[1]);
						$(txtIDs_IPOctets[2]).val(ip_address.split(".")[2]);
						$(txtIDs_IPOctets[3]).val(ip_address.split(".")[3]);
						$(txtID_PortNumber).val(port_number);
					}
					if(! message && $(chkBxID_clientStatus).is(":checked")) 
					{
						$(chkBxID_clientStatus).bootstrapToggle("on")
						print(`${ip_address}:${port_number} => ${message} (Check:${$(chkBxID_clientStatus).is(":checked")})`)
						$(chkBxID_clientStatus).bootstrapToggle("off")
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

	
	$(txtIDs_IPOctets[0]).val("127");
	$(txtIDs_IPOctets[1]).val("0");
	$(txtIDs_IPOctets[2]).val("0");
	$(txtIDs_IPOctets[3]).val("1");
	$(txtID_PortNumber).val("502");
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


// Function merge_selectors BEGIN
function merge_selectors(...selectors)
{
	let merged="";
	selectors.forEach(function(selector){merged+=selector+", ";});

	return merged.substring(0, merged.length - 2);
}
// Function merge_selectors END


// HelperFunctions END	
////////////////////////////////////////////