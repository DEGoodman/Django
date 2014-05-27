$(document).ready(function () {
	reset_times();
    
    // document.getElementById('slider').bind('slide', function (event, ui) {
    //     $('#time').val(minutes + ui.value);
    //     document.getElementById('time').val.val(ui.value);
    //   	}
    // );

     // submit form info
    $('#update_button').bind('click', function(event) {
    	event.preventDefault();
      	submit_form();
    });
});


//reset date/time fields back to default
function reset_times(){
	var current_date = new Date();
	// set expiration an hour from now
	var default_date = new Date(current_date.setHours(current_date.getHours() + 1));

    //default date values (usually 'today')
    var day = ("0" + default_date.getDate()).slice(-2);
    var month = ("0" + (default_date.getMonth() + 1)).slice(-2);

    var today = default_date.getFullYear()+"-"+(month)+"-"+(day) ;
    $('#theDate').val(today);


	// current time values
	var hours = default_date.getHours();
	var minutes = default_date.getMinutes();
    
    var future_time = hours + ":" + minutes;

    //set default to 1 hour from current_date
    $('#time').val(future_time);
}

function SetSliderValue(future_time){
	//need the differece b/w 'future_time' and now in minutes, 
	// assign that value to slider

	var temp_time = future_time.value;

	/*
			get difference between temp_time and current time, in minutes.
			set slider value to ^
	*/
}

function selectAll(selectBox,selectAll) { 
    // have we been passed an ID 
    if (typeof selectBox == "string") { 
        selectBox = document.getElementById(selectBox);
    } 
    // is the select box a multiple select box? 
    if (selectBox.type == "select-multiple") { 
        for (var i = 0; i < selectBox.options.length; i++) { 
             selectBox.options[i].selected = selectAll; 
        } 
    }
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

submit_form = function() {

	// Build payload
	formData = {'servers': []}

	$.each($('.input-container'), function(index, inputElement) {

		formData['servers'].push({
			/**
			* These are no longer checkboxes. So what are they?
			*/
			'serverName': $('input[type=checkbox]', inputElement).val(),
			'maintMode': $('input[type=checkbox]', inputElement).is(':checked'),
			'duration': $('input[type=text]', inputElement).val() //default time
		});
	});
	
	csrftoken = $.cookie('csrftoken');

	$.ajax({
		url: 'send/',	
		data: {'formJSON': JSON.stringify(formData)},
		dataType: 'json',
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type)) {
				xhr.setRequestHeader('X-CSRFToken', csrftoken);
			}
		},

		success: function(response) {
			if (response['status'] != 'success') {
				window.alert('Something went wrong. Status: ' + response['status']);
			}

			else {
				location.reload();
			}
		},

		error: function(response) {
			window.alert("Something with the server went wrong.  Please try again or contact the help desk.");
 		},

 		type: 'POST'
	});
}
