const apiUrl = "https://usmanlive.com/wp-json/api/stories"; // Replace with your API endpoint

// Fetch and display stories
function displayStories() {
    $.ajax({
        url: apiUrl,
        method: "GET",
        dataType: "json",
        success: function (data) {
            renderStoryList(data);
        },
        error: function (error) {
            console.error("Error fetching stories:", error);
            alert("Error fetching stories. Check console for details.");
        },
    });
}

// Render the story list in the DOM
function renderStoryList(data) {
    const storyList = $("#storyList");
    storyList.empty();

    if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        return;
    }

    data.forEach((story, index) => {
        const { id, title, content } = story;

        storyList.append(`
            <div class="row mb-4">
                <h2 class="col-12 fw-bold">Story ${index + 1}</h2>
                <div class="col-4"><h4>Title:</h4> ${title}</div>
                <div class="col-8"><h4>Content:</h4> <p>${content}</p></div>
                <div class="col-12 mt-2">
                    <button class="btn btn-dark btn-edit" data-id="${id}">Edit</button>
                    <button class="btn btn-danger btn-delete" data-id="${id}">Delete</button>
                </div>
            </div>
            <hr />
        `);
    });
}

// Handle form submission for adding or updating stories
function handleFormSubmission(event) {
    event.preventDefault();

    const storyId = $("#createBtn").attr("data-id");
    const title = $("#enterTitle").val().trim();
    const content = $("#enterContent").val().trim();

    // Validate inputs
    if (!title || !content) {
        alert("Please fill out all required fields.");
        return;
    }

    const storyData = { title, content };

    if (storyId) {
        // Update existing story
        $.ajax({
            url: `${apiUrl}/${storyId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(storyData),
            success: function () {
                displayStories();
                clearForm();
            },
            error: function (error) {
                console.error("Error updating story:", error);
                alert("Error updating story. Check console for details.");
            },
        });
    } else {
        // Add new story
        $.ajax({
            url: apiUrl,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(storyData),
            success: function () {
                displayStories();
                clearForm();
            },
            error: function (error) {
                console.error("Error adding story:", error);
                alert("Error adding story. Check console for details.");
            },
        });
    }
}

// Handle story deletion
function handleDeleteStory() {
    const storyId = $(this).data("id");

    $.ajax({
        url: `${apiUrl}/${storyId}`,
        method: "DELETE",
        success: function () {
            displayStories();
        },
        error: function (error) {
            console.error("Error deleting story:", error);
            alert("Error deleting story. Check console for details.");
        },
    });
}

// Handle editing a story
function handleEditStory() {
    const storyId = $(this).data("id");

    $.ajax({
        url: `${apiUrl}/${storyId}`,
        method: "GET",
        success: function (story) {
            const { title, content } = story;

            $("#enterTitle").val(title);
            $("#enterContent").val(content);

            $("#createBtn").text("Update Story").attr("data-id", storyId);
            $("#clearBtn").show();
        },
        error: function (error) {
            console.error("Error fetching story:", error);
            alert("Error fetching story. Check console for details.");
        },
    });
}

// Clear form inputs
function clearForm() {
    $("#enterTitle, #enterContent").val("");
    $("#createBtn").text("Add Story").removeAttr("data-id");
    $("#clearBtn").hide();
}

// Initialize event listeners
$(document).ready(function () {
    displayStories();

    $("#createForm").submit(handleFormSubmission);
    $("#clearBtn").click(clearForm);
    $(document).on("click", ".btn-edit", handleEditStory);
    $(document).on("click", ".btn-delete", handleDeleteStory);
});
