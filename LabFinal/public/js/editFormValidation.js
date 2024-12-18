function validateEditForm() {
    let isValid = true;

    // Title Validation
    const title = document.getElementById("title");
    const titleError = title.nextElementSibling;
    if (title.value.trim().length < 3 || title.value.trim().length > 100) {
        title.classList.add("error");
        titleError.style.display = "block";
        isValid = false;
    } else {
        title.classList.remove("error");
        titleError.style.display = "none";
    }

    // Description Validation
    const description = document.getElementById("description");
    const descriptionError = description.nextElementSibling;
    if (description.value.trim().length < 10 || description.value.trim().length > 500) {
        description.classList.add("error");
        descriptionError.style.display = "block";
        isValid = false;
    } else {
        description.classList.remove("error");
        descriptionError.style.display = "none";
    }

    // Category Validation
    const category = document.getElementById("category");
    const categoryError = category.nextElementSibling;
    if (category.value.trim() === "") {
        category.classList.add("error");
        categoryError.style.display = "block";
        isValid = false;
    } else {
        category.classList.remove("error");
        categoryError.style.display = "none";
    }

    // Price Validation
    const price = document.getElementById("price");
    const priceError = price.nextElementSibling;
    if (price.value <= 0 || isNaN(price.value)) {
        price.classList.add("error");
        priceError.style.display = "block";
        isValid = false;
    } else {
        price.classList.remove("error");
        priceError.style.display = "none";
    }

    // Quantity Validation
    const quantity = document.getElementById("quantity");
    const quantityError = quantity.nextElementSibling;
    if (quantity.value <= 0 || isNaN(quantity.value)) {
        quantity.classList.add("error");
        quantityError.style.display = "block";
        isValid = false;
    } else {
        quantity.classList.remove("error");
        quantityError.style.display = "none";
    }

    // File Validation (Optional)
    const file = document.getElementById("file");
    const fileError = file.nextElementSibling;
    const validExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (file.files.length > 0 && !validExtensions.test(file.files[0].name)) {
        file.classList.add("error");
        fileError.style.display = "block";
        isValid = false;
    } else {
        file.classList.remove("error");
        fileError.style.display = "none";
    }

    // Scroll to first error for better UX
    if (!isValid) {
        const firstError = document.querySelector(".error");
        firstError.scrollIntoView({ behavior: "smooth" });
    }

    return isValid;
}