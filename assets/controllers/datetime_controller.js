import {Controller} from '@hotwired/stimulus';


export default class extends Controller {
    // Define the targets used within the Stimulus controller
    static targets = ["startDate", "endDate", "startDisplay", "endDisplay", "startError", "endError", "submit"];

    // When the controller connects, call the function to check if the submit button should be visible
    connect() {
        this.checkSubmitVisibility();
    }

    // Function that's called whenever an input value changes
    validate(event) {
        // Determine which input (start or end date) triggered the event
        const whichDate = event.currentTarget.dataset.whichDate;
        // Get the value of the input
        const value = event.currentTarget.value;

        // Check if the input value matches the required format
        if (!this.isValidFormat(value)) {
            // Display an error if the format is incorrect
            this[`${whichDate}ErrorTarget`].textContent = "Invalid format. Use the format YYYY-MM-DD HH:MM or DD-MM-YYYY HH:MM";
            // Clear the display target
            this[`${whichDate}DisplayTarget`].textContent = '';
        } else {
            // Split the input into its date and time parts
            const [datePart, timePart] = this.extractDateAndTime(value);
            // Split the date and time parts into their components
            const [year, month, day] = this.extractYearMonthDay(datePart);
            const [hour, minute] = timePart.split(':').map(x => parseInt(x, 10));

            // Check if the date is valid
            if (!this.isValidDate(year, month, day)) {
                // Display an error if the date is invalid
                this[`${whichDate}ErrorTarget`].textContent = "Invalid date.";
                // Clear the display target
                this[`${whichDate}DisplayTarget`].textContent = '';

            } else if (!this.isValidTime(hour, minute)) {
                // Check if the minutes value is a multiple of 5
                if (minute % 5 !== 0) {
                    // Display an error if the minutes value isn't a multiple of 5
                    this[`${whichDate}ErrorTarget`].textContent = "Minute value must be a multiple of 5.";
                    // Clear the display target
                    this[`${whichDate}DisplayTarget`].textContent = '';
                } else {
                    // Display an error if the time is invalid
                    this[`${whichDate}ErrorTarget`].textContent = "Invalid time.";
                    // Clear the display target
                    this[`${whichDate}DisplayTarget`].textContent = '';
                }
            } else {
                // Display the chosen date and time if all checks pass
                this[`${whichDate}DisplayTarget`].textContent = `${value}`;
                // Clear any error messages
                this[`${whichDate}ErrorTarget`].textContent = '';
            }
        }

        // Check date order if both dates are valid
        if (this.isValid(this.startDateTarget.value) && this.isValid(this.endDateTarget.value)) {
            if (!this.areDatesInCorrectOrder(this.startDateTarget.value, this.endDateTarget.value)) {
                this.endErrorTarget.textContent = "End date must be after the start date.";
                this.endDisplayTarget.textContent = "";
            } else {
                this.endErrorTarget.textContent = "";
            }
        }

        // Check if the submit button should be visible based on the current input values
        this.checkSubmitVisibility();
    }

    // Check if the input value matches either of the valid date-time formats
    isValidFormat(value) {
        return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(value) || /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/.test(value);
    }

    // Function to check if the given year, month, and day form a valid date
    isValidDate(year, month, day) {
        const date = new Date(year, month - 1, day);
        return date && date.getMonth() === month - 1;
    }

    // Function to check if the given hour and minute form a valid time
    isValidTime(hour, minute) {
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            return false;
        }
        if (minute % 5 !== 0) {
            return false;
        }
        return true;
    }

    // Function to check if a given value is a valid date and time
    isValid(value) {
        if (!this.isValidFormat(value)) return false;

        const [datePart, timePart] = value.split(' ');
        const [year, month, day] = datePart.split('-').map(x => parseInt(x, 10));
        const [hour, minute] = timePart.split(':').map(x => parseInt(x, 10));

        if(year > 31){
            return this.isValidDate(year, month, day) && this.isValidTime(hour, minute);
        }else {
            return this.isValidDate(day, month, year) && this.isValidTime(hour, minute);
        }

    }

    // Function to check if the submit button should be visible
    checkSubmitVisibility() {
        if (this.isValid(this.startDateTarget.value) &&
            this.isValid(this.endDateTarget.value) &&
            this.areDatesInCorrectOrder(this.startDateTarget.value, this.endDateTarget.value)) {
            // Show the submit button if all conditions are met
            this.submitTarget.style.display = "inline-block";

        } else {
            // Hide the submit button otherwise
            this.submitTarget.style.display = "none";

        }
    }

    // This function checks if the end date is greater than the start date.
    areDatesInCorrectOrder(startDate, endDate) {
        let startY, startM, startD, startH, startMin;
        let endY, endM, endD, endH, endMin;

        // Check if the start date matches the format 'YYYY-MM-DD HH:MM'
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(startDate)) {
            [startY, startM, startD, startH, startMin] = startDate.split(/[- :]/).map(x => parseInt(x, 10));
        }
        // Check if the start date matches the format 'DD-MM-YYYY HH:MM'
        else if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/.test(startDate)) {
            [startD, startM, startY, startH, startMin] = startDate.split(/[- :]/).map(x => parseInt(x, 10));
        }

        // Check if the end date matches the format 'YYYY-MM-DD HH:MM'
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(endDate)) {
            [endY, endM, endD, endH, endMin] = endDate.split(/[- :]/).map(x => parseInt(x, 10));
        }
        // Check if the end date matches the format 'DD-MM-YYYY HH:MM'
        else if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/.test(endDate)) {
            [endD, endM, endY, endH, endMin] = endDate.split(/[- :]/).map(x => parseInt(x, 10));
        }

        // Convert the date and time components to Date objects
        const start = new Date(startY, startM - 1, startD, startH, startMin);
        const end = new Date(endY, endM - 1, endD, endH, endMin);

        // Return true if the end date is greater than the start date, false otherwise
        return end > start;
    }

    // Extract date and time parts from the input value
    extractDateAndTime(value) {
        if (value.includes('-')) {
            return value.split(' ');
        }
        return [];
    }

    // Determine the format (YYYY-MM-DD or DD-MM-YYYY) and extract year, month, and day
    extractYearMonthDay(datePart) {
        if (datePart.includes('-')) {
            const parts = datePart.split('-').map(x => parseInt(x, 10));
            if (parts[0] > 31) {
                return parts; // Format is YYYY-MM-DD
            } else {
                return [parts[2], parts[1], parts[0]]; // Format is DD-MM-YYYY
            }
        }
        return [];
    }


    handleFormSubmit(event) {
        event.preventDefault();
       var startDate=encodeURIComponent(this.formatDateForSubmission(this.startDateTarget.value));
       var  endDate = encodeURIComponent(this.formatDateForSubmission(this.endDateTarget.value));



        // Construct the URL with the parameters
        // Redirect to the new URL with the parameters
        window.location.href = `/dragon?startDate=${startDate}&endDate=${endDate}`;
    }

    formatDateForSubmission(dateString) {
        if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/.test(dateString)) {
            const [datePart, timePart] = dateString.split(' ');
            const [day, month, year] = datePart.split('-');
            return `${year}-${month}-${day} ${timePart}`;
        }
        return dateString; // Returns it as is for YYYY-MM-DD format
    }
}
