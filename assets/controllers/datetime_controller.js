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
            this[`${whichDate}ErrorTarget`].textContent = "Invalid format. Use the format YYYY-MM-DD HH:MM";
            // Clear the display target
            this[`${whichDate}DisplayTarget`].textContent = '';
        } else {
            // Split the input into its date and time parts
            const [datePart, timePart] = value.split(' ');
            // Split the date and time parts into their components
            const [year, month, day] = datePart.split('-').map(x => parseInt(x, 10));
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

    // Function to check if the input value matches the required format
    isValidFormat(value) {
        return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(value);
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

        return this.isValidDate(year, month, day) && this.isValidTime(hour, minute);
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

    // Function to check if the end date is greater than the start date
    areDatesInCorrectOrder(startDate, endDate) {
        const [startY, startM, startD, startH, startMin] = startDate.split(/[- :]/).map(x => parseInt(x, 10));
        const [endY, endM, endD, endH, endMin] = endDate.split(/[- :]/).map(x => parseInt(x, 10));

        const start = new Date(startY, startM - 1, startD, startH, startMin);
        const end = new Date(endY, endM - 1, endD, endH, endMin);

        return end > start;
    }


    handleFormSubmit(event) {
        event.preventDefault();

        const startDate = encodeURIComponent(this.startDateTarget.value);
        const endDate = encodeURIComponent(this.endDateTarget.value);

        // Construct the URL with the parameters
        // Redirect to the new URL with the parameters
        window.location.href = `/dragon?startDate=${startDate}&endDate=${endDate}`;
    }
}
