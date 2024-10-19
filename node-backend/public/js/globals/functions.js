let base_url = window.origin + '/';
$('#globalform').on('submit', async (e) => {
    e.preventDefault();
    $('.save').html('Please wait.....');

    let url = $(e.currentTarget).attr('action');
    // Convert form data to an object
    let formData = $(e.currentTarget).serializeArray().reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});

    // Send the form data as JSON
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),  // Send form data as JSON

    });


    let jsonResponse = await response.json();
    $('.save').html('Save');

    if (jsonResponse.statusCode == 400) {
        for (let i = 0; i < jsonResponse.error.errors.length; i++) {
            GlobalToast(jsonResponse.error.errors[i]['msg'], 'red');
        }
    } else {
        if (jsonResponse.statusCode == 200) {
            GlobalToast(jsonResponse.data, 'green');
            reloadpage();
            // window.location.href = window.location.href;

        }

    }

});





function GlobalToast(msg, colour) {
    Toastify({
        text: msg,
        duration: 3000,
        className: 'custom-toast',
        gravity: "top",  // Position of the toast ("top" or "bottom")
        position: "center",  // Position of the toast ("left", "center", or "right")
        backgroundColor: colour,  // Custom background color
        close: true  // Show close button
    }).showToast();
}

function reloadpage() {
    setTimeout(() => {
        window.location.reload();  // This reloads the current page

    }, 1000)
}


async function globalDelete(id, table) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete this'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let url = base_url + 'admin/global/delete';
            let result = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id, table: table })
            })
            let jsonres = await result.json();
            if (jsonres.statusCode == 200) {
                GlobalToast(jsonres.message, 'green');
                reloadpage();
            } else {
                GlobalToast(jsonres.message, 'red');
            }
        }
    });
}
