// Define some variables to hold the data we're retrieving from the server.
var m_accountTypes = {};
var m_serviceProvider = {};
var m_restriction = {};
var m_submit_type = null;
var m_account_id = null;

// urls for retrieving data from the server
const url_accountTypes = "http://localhost:8090/dashboard/query/account_types";
const url_serviceProvider = "http://localhost:8090/dashboard/query/service_providers";
const url_restriction = "http://localhost:8090/dashboard/query/restriction";

// When the user clicks on the button, open the modal, add or edit the account information.
const url_addAccount = "http://localhost:8090/dashboard/accounts/add";
const url_editAccount = "http://localhost:8090/dashboard/accounts/edit";

// Upload and search the data from the server.
const url_upload = "http://localhost:8090/dashboard/accounts/upload";
const url_search = "http://localhost:8090/dashboard/accounts/search";


/**
 * auto update the options of the select elements.
 */
function autoDeriveDataFromServer() {
    // Retrieve the data from the server.
    $.ajax({
        url: url_accountTypes,
        type: "GET",
        dataType: "json",
        success: function (data) {
            // update the account type dropdown
            if (data.length > 0) {
                var accountTypeDropdown = document.getElementById("account_type");
                for (var i = 0; i < data.length; i++) {
                    var option = document.createElement("option");
                    option.text = data[i].name;
                    option.value = data[i].id;
                    m_accountTypes[data[i].name] = data[i].id;
                    accountTypeDropdown.add(option);
                }
            }
        }
    });

    $.ajax({
        url: url_serviceProvider,
        type: "GET",
        dataType: "json",
        success: function (data) {
            // update the service provider dropdown
            if (data.length > 0) {
                var serviceProviderDropdown = document.getElementById("service_provider");
                for (var i = 0; i < data.length; i++) {
                    var option = document.createElement("option");
                    option.text = data[i].name;
                    option.value = data[i].id;
                    m_serviceProvider[data[i].name] = data[i].id;
                    serviceProviderDropdown.add(option);
                }
            }
        }
    });

    $.ajax({
        url: url_restriction,
        type: "GET",
        dataType: "json",
        success: function (data) {
            // update the restriction dropdown
            if (data.length > 0) {
                var restrictionDropdown = document.getElementById("account_restriction");
                for (var i = 0; i < data.length; i++) {
                    var option = document.createElement("option");
                    option.text = data[i].name;
                    option.value = data[i].id;
                    m_restriction[data[i].name] = data[i].id;
                    restrictionDropdown.add(option);
                }
            }
        }
    });
}


/**
 * When the user clicks the button, open the modal to edit the account information.
 * @param {string} accountId - The account id.
 */
function editAccount(accountId) {

    // Convert the "accountId" to accountId.
    accountId = accountId.replace("\"", "").replace("\"", "");

    // get the parameters from the row
    var id = document.getElementById('account-' + accountId).innerHTML;
    var serviceProvider = document.getElementById('service_provider-' + accountId).innerHTML;
    var accountName = document.getElementById('account_name-' + accountId).innerHTML;
    var accountPassword = document.getElementById('account_password-' + accountId).innerHTML;
    var accountType = document.getElementById('account_type-' + accountId).innerHTML;
    var accountRestriction = document.getElementById('account_restriction-' + accountId).innerHTML;
    var note = document.getElementById('note-' + accountId).innerHTML;

    // fill the modal with the parameters
    document.getElementById('account_name').value = accountName;
    document.getElementById('account_password').value = accountPassword;
    document.getElementById('note').value = note;

    // fill the options of the dropdowns
    document.getElementById('service_provider').value = m_serviceProvider[serviceProvider];
    document.getElementById('account_type').value = m_accountTypes[accountType];
    document.getElementById('account_restriction').value = m_restriction[accountRestriction];

    // set the title of the modal
    document.getElementById('accountModalLabel').innerHTML = 'Edit Account';

    // update the submit type to "edit"
    m_submit_type = "edit";
    m_account_id = id;
}


/**
 * When the user clicks the button, open the modal to add a new account.
 */
function addAccount() {
    // set the title of the modal
    document.getElementById('accountModalLabel').innerHTML = 'Add Account';

    // clear the modal
    document.getElementById('service_provider').value = '';
    document.getElementById('account_name').value = '';
    document.getElementById('account_password').value = '';
    document.getElementById('account_type').value = '';
    document.getElementById('account_restriction').value = '';
    document.getElementById('note').value = '';

    // update the submit type to "add"
    m_submit_type = "add";
}


function searchFromDictionary(dictionary, value) {
    for (var key in dictionary) {
        if (dictionary[key] == value) {
            return key;
        }
    }
    return null;
}


/**
 * Save or update the account information.
 */
function submit() {

    // get the parameters from the modal
    var accountName = document.getElementById('account_name').value;
    var accountPassword = document.getElementById('account_password').value;
    var note = document.getElementById('note').value;

    // get the name of options
    var serviceProvider = document.getElementById('service_provider').value;
    var accountType = document.getElementById('account_type').value;
    var accountRestriction = document.getElementById('account_restriction').value;

    // Before submit, check the parameters.
    if (accountName == "") {
        alert("Please input the account name.");
        return;
    }
    if (accountPassword == "") {
        alert("Please input the account password.");
        return;
    }
    if (serviceProvider == null) {
        alert("Please select the service provider.");
        return;
    }
    if (accountType == null) {
        alert("Please select the account type.");
        return;
    }
    if (accountRestriction == null) {
        alert("Please select the account restriction.");
        return;
    }

    // convert the name of options to id
    serviceProvider = searchFromDictionary(m_serviceProvider, serviceProvider);
    accountType = searchFromDictionary(m_accountTypes, accountType);
    accountRestriction = searchFromDictionary(m_restriction, accountRestriction);

    // use ajax to send the data to the server
    if (m_submit_type == "add") {
        // set data
        var data = JSON.stringify({
            "service_provider": serviceProvider,
            "account_name": accountName,
            "account_password": accountPassword,
            "account_type": accountType,
            "account_restriction": accountRestriction,
            "note": note
        });

        // send the request
        $.ajax({
            url: url_addAccount,
            type: "POST",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            statusCode: {
                200: function() {
                    // show the success message
                    alert("Account added successfully.");
                    // hide the modal
                    $('#accountModal').modal('hide');
                    // reload the page
                    location.reload();
                },
            }
        });


    } else if (m_submit_type == "edit") {
        // set data
        var data = JSON.stringify({
            "id": m_account_id,
            "service_provider": serviceProvider,
            "account_name": accountName,
            "account_password": accountPassword,
            "account_type": accountType,
            "account_restriction": accountRestriction,
            "note": note
        });

        // send the request
        $.ajax({
            url: url_editAccount,
            type: "POST",
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            statusCode: {
                200: function() {
                    // show the success message
                    alert("Account updated successfully.");
                    // hide the modal
                    $('#accountModal').modal('hide');
                    // reload the page
                    location.reload();
                },
            }
        });
    }
}


/**
 * Import the csv file.
 */
function uploadFile() {
    // get the file
    var file = document.getElementById('uploadFileName').files[0];

    // check the file is selected and the file is csv
    if (file == null || file.type != "text/csv") {
        alert("Please select a csv file.");
        return;
    }

    // use ajax to send the data to the server
    var formData = new FormData();
    formData.append('file', file);

    // now use a rotating icon to show the user that the file is uploading or processing
    document.getElementById('uploadFileName').disabled = true;
    document.getElementById('uploadButton').disabled = true;
    document.getElementById('uploadButton').innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';

    // send the file to the server
    $.ajax({
        url: url_upload,
        type: "POST",
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,

        statusCode: {
            200: function() {
                // show the success message
                alert("File uploaded successfully.");

                // enable the buttons
                document.getElementById('uploadFileName').disabled = false;
                document.getElementById('uploadButton').disabled = false;
                document.getElementById('uploadButton').innerHTML = 'Upload';

                // reload the page
                location.reload();
            }
        }
    });
}


/**
 * Search the account.
 */
function searchAccount() {
    // get the search text
    let searchText = document.getElementById('searchText').value;

    // if search text is empty, do nothing
    if (searchText == "") {
        return;
    }

    // Use GET request to send the search text to the server
    // Jump to the search page like url_search?keyword=val
    window.location.href = url_search + "?keyword=" + searchText;
}


/**
 * Generate the password.
 */
function generatePassword() {
    // Generate a random password with 16 characters
    // The password contains lower case, upper case, number and bar
    // It is like "aBcD-eFgH-iJkL-mNoP"

    // letters and numbers
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // generate the password by random selection
    var password = "";
    for (var i = 0; i < 16; i++) {
        var index = Math.floor(Math.random() * chars.length);
        password += chars[index];

        // add a bar after 4 characters
        if (i == 3 || i == 7 || i == 11) {
            password += "-";
        }
    }

    // set the password to the input box
    document.getElementById('account_password').value = password;

    // set the focus to the password input box
    document.getElementById('account_password').focus();
}

/**
 * Show the account information in the modal.
 * @param {string} accountId 
 */
function showHiddenText(accountId) {

    // Convert the "accountId" to accountId.
    accountId = accountId.replace("\"", "").replace("\"", "");

    // get the note
    var serviceProvider = document.getElementById('service_provider-' + accountId).innerHTML;
    var accountName = document.getElementById('account_name-' + accountId).innerHTML;
    var accountPassword = document.getElementById('account_password-' + accountId).innerHTML;
    var accountType = document.getElementById('account_type-' + accountId).innerHTML;
    var accountRestriction = document.getElementById('account_restriction-' + accountId).innerHTML;
    var note = document.getElementById('note-' + accountId).innerHTML;

    // print out the account information and let it left align
    var accountInfo = "<div style='text-align: left;'>";
    accountInfo += "<b>Service Provider:</b> " + serviceProvider + "<br>";
    accountInfo += "<b>Account Name:</b> " + accountName + "<br>";
    accountInfo += "<b>Account Password:</b> " + accountPassword + "<br>";
    accountInfo += "<b>Account Type:</b> " + accountType + "<br>";
    accountInfo += "<b>Account Restriction:</b> " + accountRestriction + "<br>";

    // show the note
    accountInfo += "<b>Note:</b><br>";
    accountInfo += "<label style='white-space: pre-wrap;'>" + note + "</label>";

    // accountInfo += "<b>Note:</b><br>";
    // accountInfo += "<b>Note:</b> " + note + "<br>";

    // show the note in the modal
    document.getElementById('showText').innerHTML = accountInfo;

    // show the modal
    $('#showHiddenTextModal').modal('show');
}


// modal submit button
$('#submit').on('click', function () {
    submit();
});

// enter key to submit
$('#searchText').on('keypress', function (e) {
    if (e.which == 13) {
        searchAccount();
    }
});

// auto derive the data fromt the server
autoDeriveDataFromServer();