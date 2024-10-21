document.getElementById("gform").addEventListener("submit", function (event) {
    event.preventDefault(); 
    
    const fields = [
        { id: "firstName", message: "Please enter your first name" },
        { id: "lastName", message: "Please enter your last name" },
        { 
            id: "email", 
            message: "Please enter a valid email address", 
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
        },
        { 
            id: "phoneNumber", 
            message: "Phone number must be 10 digits", 
            pattern: /^\d{10}$/ 
        },
        { id: "address", message: "Please enter your address" },
        { id: "city", message: "Please enter your city" },
    ];

    let formIsValid = true; 

    fields.forEach(function (field) {
        const inputElement = document.getElementById(field.id);
        const errorElement = inputElement.nextElementSibling;
        const value = inputElement.value.trim();

        const isInvalid = value === "" || (field.pattern && !field.pattern.test(value));

        if (isInvalid) {
            errorElement.textContent = field.message; 
            errorElement.style.display = "block"; 
            inputElement.classList.add("error");
            formIsValid = false; 
        } else {
            errorElement.style.display = "none"; 
            inputElement.classList.remove("error"); 
        }
    });

    if (formIsValid) {
        alert("Order submitted successfully!");
        location.reload(); 
    }
});
