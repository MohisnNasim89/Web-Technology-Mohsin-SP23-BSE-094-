document.addEventListener('DOMContentLoaded', function () {
    const seeProjectButtons = document.querySelectorAll('.see-project');

    // Add click event listener to all "See Project" buttons
    seeProjectButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const projectId = this.getAttribute('data-project-id');

            // Fetch the project description from a file (e.g., project1.txt, project2.txt)
            fetch(`project${projectId}.txt`)
                .then(response => response.text())
                .then(description => {
                    // Update the modal content with the fetched description
                    document.getElementById('projectDescription').innerText = description;

                    // Show the modal
                    const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
                    projectModal.show();
                })
                .catch(error => {
                    console.error('Error fetching project description:', error);
                    document.getElementById('projectDescription').innerText = 'Failed to load project description.';
                });
        });
    });
});
