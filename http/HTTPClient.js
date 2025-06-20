/**
 * Provides HTTP-connection functionality.
 */
export class HTTPClient {
    #host = "http://localhost:6050/libraries/";

    constructor() {
        // The default return value for PUT and POST requests
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
                // when requesting a json (e.g. a mindmap)
                if(options.headers["Content-Type"] === "application/json") {
                    result = await response.json();
                }
                // when requesting a plain text (e.g. an entry preview string)
                else if (options.headers["Content-Type"] === "text/plain") {
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
        const url = library + "/map";
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
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
        const url = this.currentLibrary + "/map";
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
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }

        return this.#performRequest("", options)
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
        // TODO - format the list to contain the keys, titles, authors and releases of the entries and return it
        return this.#performRequest(this.currentLibrary, options)
    }

    /**
     * Requests the preview for a certain BibEntry from the current library.
     * @param {string} citationKey - The citation key (identifier) of the entry.
     * @returns A string containing the preview with relevant information
     * about the entry (e.g. author, title, release date, etc.).
     */
    async getPreviewString(citationKey = "") {
        const options = {
            method: "GET",
            headers: { "Content-Type": "text/plain" }
        }
        
        return this.#performRequest(`${this.currentLibrary}/entries/${citationKey}`, options);
    }
}