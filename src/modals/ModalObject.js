/**
 * This class summarizes bootstrap modals' elements to
 * allow a simpler access to them.
 * 
 * * Note: this might be extended upon adding more modals types.
 */
export class ModalObject {
    constructor(titleElement,
                infoTextElement,
                selectElement,
                confirmButtonElement,
                loadingText = 'Loading. Please wait a second...',
                failText = 'No data could be loaded.') {
        this.titleElement = titleElement;
        this.infoTextElement = infoTextElement;
        this.selectElement = selectElement;
        this.confirmButtonElement = confirmButtonElement;

        this.loadingText = loadingText;
        this.failText = failText;

        this.selectOptions = [];
    }

    /**
     * Fills modal's select object with provided options.
     * @param { Array } values - The options' values of the select.
     * @param { Array } showedOptions - The options to show to the user.
     */
    fillSelect(values, showedOptions) {
        // If modal doesn't have a bootstrap's <form-select> element,
        // do nothing :)
        if (!this.selectElement){
            console.log(`Cannot fill undefined select element of modal.`);
            return;
        }

        // Replacing select's options with retrieved ones
        this.selectElement.innerHTML = '';
        for (let i = 0; i < values.length; i++) {
            this.selectElement.innerHTML +=
                `<option value=${values[i]}>` +
                `${showedOptions[i]}` +
                `</option>`;
        }

        this.selectOptions = values;
    }

    /**
     * Retrieves all selected options if the modal.
     * @returns - null, if modal doesn't have any select element of if nothing was selected.
     * - Array of selected options otherwise.
     */
    getSelectedOptions() {
        // If modal doesn't have a bootstrap's <form-select> element,
        // do nothing :)
        if (!this.selectElement){
            console.warn(`Cannot retrieve an option of undefined select element.`);
            return null;
        }

        // Getting selected options
        let selectedOptions = Array.from(this.selectElement.selectedOptions)
                              .map((option) => this.selectOptions[option.index]);

        // If user didn't select anything, don't load anything :)
        if (!selectedOptions || selectedOptions?.length === 0) {
            console.warn('Couldn\'t get an option because nothing was selected.');
            return null;
        }

        return selectedOptions;
    }
}