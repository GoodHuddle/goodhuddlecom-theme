$(document).ready(function() {

    function showError() {
        var errorMarker = $('#global-error');
        errorMarker.show();
        var offset = errorMarker.offset();
        offset.left -= 20;
        offset.top -= 20;
        $('html, body').animate({
            scrollTop: offset.top,
            scrollLeft: offset.left
        });
    }

    $('.signup-field').popover({
        container: 'body',
        trigger: 'hover',
        placement: 'right'
    });

    $('#name').on("input", null, null, function () {
        var slug = $('#name').val();
        slug = slug.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '');
        $('#slug').val(slug);
    });

    $('#sign-up-button').click(function(event) {
        event.preventDefault();

        $('.error-block').hide();

        var saveButton = $(this);
        var loadingIndicator = $('#loading-indicator');

        var nameField = $('#name');
        var slugField = $('#slug');
        var invitationCodeField = $('#invitationCode');
        var firstNameField = $('#adminFirstName');
        var lastNameField = $('#adminLastName');
        var emailField = $('#adminEmail');
        var usernameField = $('#adminUsername');
        var passwordField = $('#adminPassword');
        var confirmPasswordField = $('#confirmPassword');
        var tandcField = $('#tandc');

        var name = nameField.val();
        var slug = slugField.val();
        var baseUrl = 'https://' + slug + '.goodhuddle.com';
        var invitationCode = invitationCodeField.val();
        var firstName = firstNameField.val();
        var lastName = lastNameField.val();
        var email = emailField.val();
        var username = usernameField.val();
        var password = passwordField.val();
        var confirmPassword = confirmPasswordField.val();
        var tandc = tandcField.val();

        var hasError = false;

        if (!$.trim(name)) {
            var errorMarker = $('#name-error');
            errorMarker.text('Please provide a name for your huddle');
            errorMarker.show();
            hasError = true;
        }

        if (!$.trim(slug)) {
            var errorMarker = $('#huddleUrl-error');
            errorMarker.text('Please provide a URL for your huddle');
            errorMarker.show();
            hasError = true;
        }

        if (!$.trim(invitationCode)) {
            var errorMarker = $('#invitationCode-error');
            errorMarker.text('Please provide an invitation code');
            errorMarker.show();
            hasError = true;
        }

        if (!$.trim(firstName)) {
            var errorMarker = $('#adminFirstName-error');
            errorMarker.text('Please provide your first name');
            errorMarker.show();
            hasError = true;
        }

        if (!$.trim(lastName)) {
            var errorMarker = $('#adminLastName-error');
            errorMarker.text('Please provide your last name');
            errorMarker.show();
            hasError = true;
        }

        if (!$.trim(email)) {
            var errorMarker = $('#adminEmail-error');
            errorMarker.text('Please provide your email address');
            errorMarker.show();
            hasError = true;
        }

        if (!$.trim(username)) {
            var errorMarker = $('#adminUsername-error');
            errorMarker.text('Please provide a username');
            errorMarker.show();
            hasError = true;
        }

        if (!$.trim(password)) {
            var errorMarker = $('#adminPassword-error');
            errorMarker.text('Please provide a password');
            errorMarker.show();
            hasError = true;
        }

        if (!tandcField.is(':checked')) {
            $('#tandc-error').show();
            hasError = true;
        }

        if (password != confirmPassword) {
            $('#confirmPassword-error').show();
            hasError = true;
        }

        if (hasError) {
            showError();
            return false;
        }

        saveButton.attr('disabled', 'true');
        loadingIndicator.show();

        $.ajax({
            type: "POST",
            url: '/huddles/create.do',
            data: JSON.stringify({
                slug: slug,
                name: name,
                baseUrl: baseUrl,
                invitationCode: invitationCode,
                adminFirstName: firstName,
                adminLastName: lastName,
                adminUsername: username,
                adminEmail: email,
                adminPassword: password
            }),
            success: function(result) {
                window.location.href = '/signup-success';
            },
            error: function (request, status, errorCode) {
                console.log("Error: " + request.responseText);

                saveButton.removeAttr('disabled');
                loadingIndicator.hide();

                var error = JSON.parse(request.responseText);
                if (error.code == 'invalid_huddle_invitation_code') {
                    var errorMarker = $('#invitation-code-error');
                    errorMarker.text(error.message);
                    errorMarker.show();
                } else if (error.code == 'invalid-huddle-slug') {
                    var errorMarker = $('#huddleUrl-error');
                    errorMarker.text("Your URL must contain no spaces and only letters and numbers");
                    errorMarker.show();
                } else if (error.code == 'huddle_exists') {
                    var errorMarker = $('#huddleUrl-error');
                    errorMarker.text(error.message);
                    errorMarker.show();
                } else if (error.code == 'validation_error') {
                    var length = error.fieldErrors.length;
                    for (var i = 0; i < length; i++) {
                        var fieldError = error.fieldErrors[i];
                        var field = fieldError.field;
                        var code = fieldError.code;

                        if (field == 'slug') { field= 'huddleUrl'; }
                        if (field == 'baseUrl') { field= 'huddleUrl'; }

                        var message = fieldError.message;
                        console.log('Error in field "' + field + '": ' + message);
                        var errorMarker = $('#' + field + '-error');
                        errorMarker.text(message);
                        errorMarker.show();
                    }
                }
                showError();
            },
            dataType: "json",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return false;
    });
});