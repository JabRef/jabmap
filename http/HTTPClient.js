/**
 * Provides HTTP-connection functionality.
 */
export class HTTPClient {
    #host = "http://localhost:23119/";

    constructor() {
        /**
         * The default return value for PUT requests.
         */
        this.NULL_MAP = { map: {} };
        this.currentLibrary = "demo";
    }

    /**
     * Sends a HTTP-request to JabRef's server.
     * @param { string } url - The server's URL to make a request to. 
     * @param { object } options - Optional request's options.
     * @returns
     * - An **object** in case of a `GET request` or
     * - An **object** { map: {} } in case of a `PUT / POST request`
     * or if any request failed.
     */
    async #performRequest(url, options = null) {
        let result = this.NULL_MAP;
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

            // If some output is awaited, save it
            if (options.method !== "PUT") {
                if (options.headers["Accept"] === 'application/json') {
                    result = await response.json();
                }
                if (options.headers["Accept"] === 'text/plain') {
                    result = await response.text();
                }
                if (options.headers["Accept"] === 'text/html') {
                    result = await response.text();
                }
            }

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
     * Requests a mind map (.jmp file) from JabRef's server.
     * @param { string } library - The library of the requested mind map.
     * @returns The requested mind map object.
     */
    async loadMap(library = "demo") {
        const url = `libraries/${library}/map`;
        const options = {
            method: "GET",
            headers: { "Accept": "application/json" }
        }

        // Changing current library
        this.currentLibrary = library;
        console.log(`Current library is now: ${this.currentLibrary}`);

        return this.#performRequest(url, options);
    }

    /**
     * Sends a mind map to JabRef's server to save next to currently active library.
     * @param { object } mindMap - The mind map to save.
     * @returns An empty map object (NULL_MAP).
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
     * @returns A list of available mind maps stored on the server.
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
     * @returns A list of all entries in the current library in json format.
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
     * @returns A list of selected citation keys.
     */
    async getCiteKeysWithCAYW() {
        let url = 'better-bibtex/cayw';
        url += (`?libraryid=${this.currentLibrary}&format=simple-json`);
        console.log(url);
        const options = {
            method: "GET",
            headers: { "Accept": "application/json" }
        }
        let selectedEntries = await this.#performRequest(url, options);
        let selectedCiteKeys = [];
        for (let entry of selectedEntries) {
            selectedCiteKeys.push(entry.citationKey);
        }
        return selectedCiteKeys;
    }

    /**
     * Requests the preview for a certain BibEntry from the current library.
     * @param { string } citationKey - The citation key (identifier) of the entry.
     * @returns A string containing the preview with relevant information
     * about the entry (e.g. author, title, release date, etc.).
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
     * @returns A string containing the preview with relevant information
     * about the entry (e.g. author, title, release date, etc.).
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
     * @returns A list of objects of the following structure
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

        let response = await this.#performRequest(url, options);
        return response;
    }
}