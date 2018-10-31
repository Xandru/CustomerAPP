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
        }).done(function(response){
            //console.log('Deleted')
            //window.location.replace('/');
        });
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
        }
    });

    $('#updateForm').attr('hidden',false);
}