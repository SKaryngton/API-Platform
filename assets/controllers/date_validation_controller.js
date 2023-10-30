import { Controller } from '@hotwired/stimulus';


export default class extends Controller {

    static targets = ["startDate", "endDate"];

    validateDate() {
        const startDate = new Date(this.startDateTarget.value);
        const endDate = new Date(this.endDateTarget.value);

        const errorElement = document.getElementById("date-error");

        if (endDate < startDate) {

            this.endDateTarget.setCustomValidity("End date must be greater than or equal to the start date");
        } else {
            this.endDateTarget.setCustomValidity("");
        }
    }
}
