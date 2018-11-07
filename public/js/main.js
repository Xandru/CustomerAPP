$(document).ready(function(){
    $('.deleteUser').on('click', deleteUser);
});

$(document).ready(function(){
    $('.editUser').on('click', editUser);
});

function deleteUser(){
    var confirmation = confirm('Are You Sure?');

    if (confirmation){
        $.ajax({
            type:'DELETE',
            url: '/users/delete/' +$(this).data('id')
        });
        console.log('Deleted') // not logging
        window.location.replace('/');
    } else {
        return false;
    }
}

//On your own, create a GUI for updating existing records

function editUser(){
    //alert($(this).data('id'));
    // load db info to edit page
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url:'/users/get/' +$(this).data('id'),
        success: function(data){
            var jsonstr = JSON.stringify(data);
            //alert(jsonstr);
            //alert(data['0'].first_name);
            // why is the json data object in an aobject array?
            $('#edit-first-name').attr('value',data['0'].first_name);
            $('#edit-last-name').attr('value',data['0'].last_name);
            $('#edit-email').attr('value',data['0'].email);
            $('#userId').attr('value',data['0']._id);
        }
    });
    $('#updateForm').attr('hidden',false);
    $('#addForm').attr('hidden',true);
}

function confirmUpdate(){
    var data = $('#updateForm').serializeArray();

    //Compare old data with new input data before confirming update
    var str = 'Updating new info to...\n';
    str += 'First Name: ' + $('#edit-first-name').val() + '\n';
    str += 'Last Name: ' + $('#edit-last-name').val() + '\n';
    str += 'Email Name: ' + $('#edit-email').val() + '\n';
    $('.display').append(str);

    var confirmation = confirm(str + "Is the information correct?");

    if (confirmation) {
        $.ajax({
            type:'POST',
            url: '/users/update',
            data: data
        });
        console.log('Updated') //not loggin
        window.location.replace('/');
    } else {
        return false;
    }
}