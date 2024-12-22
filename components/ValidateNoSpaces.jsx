import { toast } from "react-toastify";

export default function validateNoLeadingOrTrailingSpaces(formData) {
    let isValid = true;
    
    for (let key in formData) {
        if (typeof formData[key] === 'string') {
            // Trim spaces and update formData with the trimmed value
            const trimmedValue = formData[key].trim();
            
            if (formData[key] !== trimmedValue) {
                formData[key] = trimmedValue; // Remove spaces
                isValid = true;
            }
        }
    }

    // Notify user if any field was trimmed
    if (isValid) {
        toast.info("Spaces were removed from the beginning or end of some fields.");
    }
    
    return isValid;
};
