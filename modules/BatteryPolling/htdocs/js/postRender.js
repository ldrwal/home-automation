function modulePostRender(control) {
	var id = 0;
	var mail_exists = false;

	$(document).find(".not_message").children().prop('disabled', true);

	$.ajax("/ZAutomation/api/v1/instances/MailNotifier")
		.done(function () {
			mail_exists = true;
			$.ajax("/ZAutomation/api/v1/profiles")
				.done(function (profilesResponse) {
					var moduleId = parseInt(window.location.href.substring(window.location.href.lastIndexOf("/") + 1));
					if (!isNaN(moduleId)) {
						$.ajax("/ZAutomation/api/v1/instances/" + moduleId)
							.done(function (response) {
								if(typeof response.data.params === 'undefined') {
									fillDropDown(profilesResponse.data, false, id);
								} else if (typeof response.data.params.notification.target !== 'undefined') {
									fillDropDown(profilesResponse.data, response.data.params.notification.target, id);
									$(document).find(".not_message").children().prop('disabled', false);
								}
							});
					} else {
						fillDropDown(profilesResponse.data, false, id);
					}
				})
				.fail(function () {
					showInputField();
				});
		})
		.fail(function () {
			var info = $(document).find(".mail_input");
			$(info[id]).parent().append('<div class="alert alert-warning">'+control.data.mail_helper+'<br /><br /><button class="btn btn-default install_mail">'+control.data.mail_button+'</button></div>');
			$(".mail_input").hide();
		});

	$(document).on("click", ".install_mail", function() {
		alertify.confirm(control.data.mail_confirm, function () {
			window.location.replace("/smarthome/#/module/post/MailNotifier");
		});
	});

	$(document).on("change", "select[name=notification_target]", function () {
		$(this).parent().parent().parent().find(".not_message").children().prop('disabled', ($(this).val() === ''));
	});
}

function fillDropDown(profiles, selectedMail, notificationID) {
	var select = $(".target_select").find('select');
	var added = false;

	profiles.forEach(function (singleProfile) {
		if ((typeof singleProfile.email !== 'undefined') && (singleProfile.email !== "")) {
			if (singleProfile.email === selectedMail) {
				$(select[notificationID]).append($('<option></option>').val(singleProfile.email).html(singleProfile.email));
			} else {
				$(select[notificationID]).append($('<option></option>').val(singleProfile.email).html(singleProfile.email));
			}
			added = true;
		}
	});

	if (!added){
		showInputField();
	} else {
		if (selectedMail) {
			$(select[notificationID]).val(selectedMail);
		}

		$(".mail_input").hide();
	}
}

function showInputField() {
	$(".mail_input").show();
}
