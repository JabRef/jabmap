/**
 * Provides HTTP-connection functionality.
 */
class HTTPClient {
    #host = "http://localhost:23119/";

    constructor() {
        this.currentLibrary = "demo";
    }

    /**
     * Sends a HTTP-request to JabRef's server.
     * @param { string } url - The server's URL to make a request to. 
     * @param { object } options - Optional request's options.
     * @returns A result object of following structure:
     * - code: the status of the request defined by REQUEST_RESULT enum.
     * - value: **null** in case of a `PUT / POST request`
     *      or with `GET` requested **object**.
     */
    async #performRequest(url, options = null) {
        let result = {
            code: REQUEST_RESULT.Refused,
            value: null
        };
        let logMessage = "";

        const requestUrl = this.#host.concat(url);
        // Setting default options if none's been provided
        // * Note: this includes only cases when options are null or undefined
        options = options ??
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        };

        // Sending the request and waiting for the response
        try {
            const response = await fetch(requestUrl, options);
            if (!response.ok) {
                throw new Error("Request's result is not ok ( -.-)");
            }

            // If connection succeeded, try parsing the result (failed by default)
            result.code = REQUEST_RESULT.Failed;

            // If some output is awaited, save it
            if (options.method !== "PUT") {
                if (options.headers["Accept"] === 'application/json') {
                    result.value = await response.json();
                }
                if (options.headers["Accept"] === 'text/plain') {
                    result.value = await response.text();
                }
                if (options.headers["Accept"] === 'text/html') {
                    result.value = await response.text();
                }
            }

            // If parsing's successful, set the best result code \(OwO)/
            result.code = REQUEST_RESULT.Success;

            // Providing infos about the request
            logMessage =
                `${options.method} ${requestUrl} Request succeeded (~ UwU)~(${response.status}).\n` +
                `Output:\n` +
                `${JSON.stringify(result, null, 2)}`;
        } catch (e) {
            // Logging basic information about the error
            console.error(e);
            logMessage = `${options.method} ${requestUrl} Request failed (.'T_T)`;

            // If connection was present, provide more details
            if (typeof (response) !== "undefined") {
                logMessage +=
                    `-(${response.status}).\n` +
                    `Options:\n` +
                    `${options}`;
            }
        }

        // Finally showing the resulting log
        console.log(logMessage);

        return result;
    }

    /**
     * Checks whether a connection to the JabRef's server is present or not.
     * @returns True if JabRef's responded, false otherwise.
     */
    async isConnected() {
        try {
            const response = await fetch(this.#host);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Requests a mind map (.jmp file) from JabRef's server.
     * @param { string } library - The library of the requested mind map.
     * @returns A result object of following structure:
     * - code: the status of the request defined by REQUEST_RESULT enum.
     * - value: null in case the request failed
     *      or requested mind map.
     */
    async loadMap(library = "demo") {
        const url = `libraries/${library}/map`;
        const options = {
            method: "GET",
            headers: { "Accept": "application/json" }
        }

        const loadRequest = await this.#performRequest(url, options);

        if (loadRequest.code === REQUEST_RESULT.Success) {
            // Changing current library if succeeded
            this.currentLibrary = library;
            console.log(`Current library is now: ${this.currentLibrary}`);
        }

        return loadRequest
    }

    /**
     * Sends a mind map to JabRef's server to save next to currently active library.
     * @param { object } mindMap - The mind map to save.
     * @returns A result object of following structure:
     * - code: the status of the request defined by REQUEST_RESULT enum.
     * - value: null (in case of a `PUT / POST request`).
     */
    async saveMap(mindMap) {
        const url = `libraries/${this.currentLibrary}/map`;
        const options = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ map: mindMap })
        }

        return this.#performRequest(url, options)
    }

    /**
     * Requests a list of stored mind maps saved on the server.
     * @returns A result object of following structure:
     * - code: the status of the request defined by REQUEST_RESULT enum.
     * - value: null in case the request failed
     *      or a list of available mind maps.
     */
    async listMaps() {
        const url = 'libraries'
        const options = {
            method: "GET",
            headers: { "Accept": "application/json" }
        }

        return this.#performRequest(url, options)
    }

    /**
     * Requests a list of all entries in the current library.
     * @returns A result object of following structure:
     * - code: the status of the request defined by REQUEST_RESULT enum.
     * - value: null in case the request failed
     *      or a list of available entries of current mind map.
     */
    async listEntries() {
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }
        return this.#performRequest(this.currentLibrary, options)
    }

    /**
     * Sends a request to open a cite-as-you-write window
     * to select any number of BibEntries from the current library.
     * @returns A result object of following structure:
     * - code: the status of the request defined by REQUEST_RESULT enum.
     * - value: **null** in case the request failed
     *      or list of requested citation keys.
     */
    async getCiteKeysWithCAYW() {
        let url = 'better-bibtex/cayw';
        url += (`?libraryid=${this.currentLibrary}&format=simple-json`);
        console.log(url);
        const options = {
            method: "GET",
            headers: { "Accept": "application/json" }
        }
        let selectedEntries = (await this.#performRequest(url, options)).value;
        let selectedCiteKeys = [];
        for (let entry of selectedEntries) {
            selectedCiteKeys.push(entry.citationKey);
        }
        return selectedCiteKeys;
    }

    /**
     * Requests the preview for a certain BibEntry from the current library.
     * @param { string } citationKey - The citation key (identifier) of the entry.
     * @returns A result object of following structure:
     * - code: the status of the request defined by REQUEST_RESULT enum.
     * - value: null in case the request failed
     *      or an object containing the preview with relevant information
     *      about the entry (e.g. author, title, release date, etc.).
     */
    async getPreviewString(citationKey) {
        const url = `libraries/${this.currentLibrary}/entries/${citationKey}`;
        const options = {
            method: "GET",
            headers: { "Accept": "text/plain" }
        }

        return this.#performRequest(url, options);
    }

    /**
     * Requests the preview for a certain BibEntry from the current library.
     * @param { string } citationKey - The citation key (identifier) of the entry.
     * @returns A result object of following structure:
     * - code: the status of the request defined by REQUEST_RESULT enum.
     * - value: null in case the request failed
     *      or an HTML string containing the preview with relevant information
     *      about the entry (e.g. author, title, release date, etc.).
     */
    async getPreviewHTML(citationKey) {
        const url = `libraries/${this.currentLibrary}/entries/${citationKey}`;
        const options = {
            method: "GET",
            headers: { "Accept": "text/html" }
        }

        return this.#performRequest(url, options);
    }

    /**
     * Requests a list of all local pdf files from the current library.
     * @returns A result object of following structure:
     * - code: the status of the request defined by REQUEST_RESULT enum.
     * - value: null in case the request failed
     *      or a list of objects of the following structure
     * ```
     * [
     *     {
     *         "fileName": "example.pdf",
     *         "parentCitationKey": "Tokede_2011",
     *         "path": (relative) "Example.pdf" or
     *                 (absolute) "/Users/exampleUser/documents/Example.pdf"
     *     },
     *     {...}
     *  ]
     *  ```
     *  for more info on the path, see https://docs.jabref.org/finding-sorting-and-cleaning-entries/filelinks
     */
    async getPDFFiles(){
        const url = `libraries/${this.currentLibrary}/entries/pdffiles`;
        const options = {
            method: "GET",
            headers: { "Accept": "application/json" }
        }

        return this.#performRequest(url, options);
    }
}

const REQUEST_RESULT = Object.freeze({
    Refused: -1,
    Failed: 0,
    Success: 1
});

export { HTTPClient, REQUEST_RESULT };