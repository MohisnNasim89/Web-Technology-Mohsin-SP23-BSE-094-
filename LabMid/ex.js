document.addEventListener('DOMContentLoaded', function () {
    const seeProjectButtons = document.querySelectorAll('.see-project');

    seeProjectButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const projectId = this.getAttribute('data-project-id');

            // AJAX request to fetch the project description
            $.ajax({
                url: `project${projectId}.txt`,
                type: 'GET',
                dataType: 'text',
                success: function(description) {
                    $('#projectDescription').text(description);

                    const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
                    projectModal.show();
                },
                error: function(error) {
                    console.error('Error fetching project description:', error);
                    $('#projectDescription').text('Failed to load project description.');
                }
            });
        });
    });
});
