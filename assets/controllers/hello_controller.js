import { Controller } from '@hotwired/stimulus';
import axios from 'axios';

export default class extends Controller {

    static values = {
        infoUrl: String
    }

    play(event){
        event.preventDefault();

        event.preventDefault();
        axios.get(this.infoUrlValue)
            .then((response) => {
                console.log(response);
            });
    }
}
