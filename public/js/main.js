$(document).ready(function(){
    $('.deleteUser').on('click', deleteUser);
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

//Own your own, create a GUI for updating existing records