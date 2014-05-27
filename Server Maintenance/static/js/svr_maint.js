$(document).ready(function () {
	reset_times();

     // submit form info
    $('#update_button').bind('click', function(event) {
    	event.preventDefault();
      	submit_form();
    });

    $( "#datetimeWrapper" ).click(function() {
  		$('#datetimeWrapper :input').removeAttr('disabled');
  		$('#sliderWrapper :input').prop('disabled', true);
  		document.getElementById("currentValue").innerHTML='--';
	});

	$( "#sliderWrapper" ).click(function() {
  		$('#sliderWrapper :input').removeAttr('disabled');
  		$('#datetimeWrapper :input').prop('disabled', true);
	});
});


//reset date/time fields back to default
function reset_times(){
	//reenable all fields
	$('#datetimeWrapper :input').removeAttr('disabled');
	$('#sliderWrapper :input').removeAttr('disabled');

	var current_date = new Date();
	// set expiration an hour from now
	var default_date = new Date(current_date.setHours(current_date.getHours() + 1));

    //default date values (usually 'today')
    var day = ("0" + default_date.getDate()).slice(-2);
    var month = ("0" + (default_date.getMonth() + 1)).slice(-2);

    var today = default_date.getFullYear()+"-"+(month)+"-"+(day) ;
    $('#theDate').val(today);


	// current time values
	var hours = ("0" + default_date.getHours()).slice(-2);
	var minutes = ("0" + default_date.getMinutes()).slice(-2);

    
    var future_time = hours + ":" + minutes;

    //set default to 1 hour from current_date
    $('#time').val(future_time);

    $('#slider').val(60);
    document.getElementById("currentValue").innerHTML='60';
}	

function UpdateTime(slider_change){
	//enable datetimeWrapper to change
	$('#datetimeWrapper :input').removeAttr('disabled');

	//to really expand range, any minute value over 4 hours will be tripled. Over 24 hours, will be squared
  	if (slider_change > 240 && slider_change <= 480)
  		slider_change = slider_change * 3;
  	else if (slider_change > 480)
  		slider_change = slider_change * slider_change;

  	document.getElementById("currentValue").innerHTML=slider_change;

  	var new_date_obj = new Date();
  	//get current ms time
  	var ms_time = new_date_obj.getTime();

  	//get slider time in minutes, convert to ms
  	var ms_delta = slider_change * 60000;

  	//add total ms to new date
  	var final_time = ms_time + ms_delta;
  	new_date_obj.setTime(final_time);

  	//parse into appropriate values
  	var hours = ("0" + new_date_obj.getHours()).slice(-2);
  	var minutes = ("0" + new_date_obj.getMinutes()).slice(-2);

  	var new_time = hours + ":" + minutes;
  	$('#time').val(new_time);

  	//may need to update date as well
  	var day = ("0" + new_date_obj.getDate()).slice(-2);
  	var month = ("0" + (new_date_obj.getMonth() + 1)).slice(-2);

  	var new_date = new_date_obj.getFullYear()+"-"+(month)+"-"+(day);
  	$('#theDate').val(new_date);

  	//disable datetimeWapper
  	$('#datetimeWrapper :input').prop('disabled', true);
}

function selectAll(selectBox,selectAll) { 
    // have we been passed an ID 
    if (typeof selectBox === "string") { 
        selectBox = document.getElementById(selectBox);
    } 
    // is the select box a multiple select box? 
    if (selectBox.type === "select-multiple") { 
        for (var i = 0; i < selectBox.options.length; i++) { 
             selectBox.options[i].selected = selectAll; 
        } 
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

submit_form = function() {
	var duration;
	//'duration' is either #currentValue, or based off of datetime
	if ($('#slider').attr('disabled')) {
		var current_date = new Date();
		var current_time_ms = current_date.getTime();

		// read in changed date values into new date
		var future_date = new Date( parseInt($('#theDate').val().slice(0,4)), //year
									(parseInt($('#theDate').val().slice(5,7)) - 1), //month
									parseInt($('#theDate').val().slice(8,10)), //day
									parseInt($('#time').val().slice(0,2)), //hour
									parseInt($('#time').val().slice(3,5))); //minute

		var fut_ms = future_date.getTime(); //this puts duration into ms
		var ms_dur = fut_ms - current_time_ms; // get diff in times
		var min_dur = Math.round(ms_dur / 60000); // convert ms to whole minutes
		duration = min_dur.toString();
		if ( duration < 0) // if negative, don't send. Reload page
			location.reload();
	} else {
		duration = $('#currentValue').text();
	}

	// Build payload
	var formData = {
		'server_table': [],
		'duration': duration
	};

	$.each($('#server_table option:selected'), function(index, inputElement) {
		formData.server_table.push({
			'platform': $(inputElement).attr('platform'),
			'serverName': $(inputElement).val()
		});
	});
	
	console.log(formData);

	var csrftoken = getCookie('csrftoken');

	$.ajax({
		url: 'send/',	
		data: {'formJSON': JSON.stringify(formData)},
		dataType: 'json',
		crossDomain: false, // obviates need for sameOrigin test
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
