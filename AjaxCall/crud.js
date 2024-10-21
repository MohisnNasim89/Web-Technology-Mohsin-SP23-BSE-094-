function displayUsers() {
    $.ajax({
        url: "https://gorest.co.in/public/v2/users",
        method: "GET",
        dataType: "json",
        success: handleResponse,
        error: function (error) {
            console.error("Error Fetching Users", error);
        },
    });
}

function handleResponse(data) {
    var users = $("#userList");
    users.empty();
    $.each(data, function (index, user) {
        if (user && user.id) { // Ensure user and user.id exist
            users.append(`
                <div class="row mb-4">
                    <h2 class="fw-bold col-12">USER ${index + 1}</h2>
                    
                    <div class="col-4 mb-2">
                        <h4 class="d-inline">Name:</h4>
                    </div>
                    <div class="col-8 mb-2">
                        <span>${user.name || 'N/A'}</span>
                    </div>

                    <div class="col-4 mb-2">
                        <h4 class="d-inline">Email:</h4>
                    </div>
                    <div class="col-8 mb-2">
                        <span>${user.email || 'N/A'}</span>
                    </div>

                    <div class="col-4 mb-2">
                        <h4 class="d-inline">Gender:</h4>
                    </div>
                    <div class="col-8 mb-2">
                        <span>${user.gender || 'N/A'}</span>
                    </div>

                    <div class="col-4 mb-2">
                        <h4 class="d-inline">Status:</h4>
                    </div>
                    <div class="col-8 mb-2">
                        <span>${user.status || 'N/A'}</span>
                    </div>

                    <div class="mt-3">
                        <button class="btn col-md-1 btn-dark me-2 btn-edit" data-id="${user.id}">Edit</button>
                        <button class="btn col-md-1 btn-danger btn-del" data-id="${user.id}">Delete</button>
                    </div>
                </div>
                <hr>
            `);
        } else {
            console.warn(`Invalid user data at index ${index}`, user);
        }
    });
}

function deleteStory() {
    let userId = $(this).attr("data-id");
    $.ajax({
        url: "https://gorest.co.in/public/v2/users/" + userId,
        method: "DELETE",
        success: function () {
            displayStories();
        },
        error: function (error) {
            console.error("Error deleting story:", error);
            console.log(userId);
        },
    });
}

$(document).ready(function () {
    displayUsers();
    $(document).on("click", ".btn-del", deleteStory);
});
