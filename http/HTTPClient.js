/**
 * Provides HTTP-connection functionality.
 */
export class HTTPClient {
    #host = "http://localhost:6050/";

    constructor() {
        // The default return value for PUT and POST requests
        this.NULL_MAP = { map: {} };
    }

    /**
     * Sends a HTTP-request to the JabRef's server.
     * @param { string } url - The server's URL to make a request to. 
     * @param { object } options - Optional request's options.
     * @returns
     * - An **object** in case of a `GET request` or
     * - An **object** { map: {} } in case of a `PUT / POST request`
     * or if any request failed.
     */
    async #performFetch(url, options = null) {
        let fetchResult = this.NULL_MAP;
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

            // Defining default resulting output
            fetchResult = "No data received back.";
            // If some output is awaited, save it instead
            if (options.method !== "PUT") {
                fetchResult = await response.json();
            }

            // Providing infos about the request
            logMessage =
                `${options.method} ${url} Request succeeded (~ UwU)~(${response.status}).\n` +
                `Output:\n` +
                `${JSON.stringify(fetchResult, null, 2)}`;
        } catch (e) {
            // Logging basic information about the error
            console.error(e);
            logMessage = `${options.method} ${url} Request failed (.'T_T)`;

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

        return fetchResult;
    }

    /**
     * Requests a mind map (.jmp file) from JabRef's server.
     * @param { string } path - The path to the requested mind map.
     * @returns The requested mind map object.
    */
    async loadMap(path = "libraries/demo/map") {
        const url = path;
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }

        return this.#performFetch(url, options);
    }

    /**
     * Sends a mind map to JabRef's server to save.
     * @param { object } mindMap - The mind map to save.
     * @param { string } path - The path to save the mind map to.
     * @returns An empty map object (NULL_MAP).
    */
    async saveMap(mindMap, path = "libraries/demo/map") {
        // The url will probably be modified according to mindMap's properties (coming in sprint 2)
        const url = path;
        const options = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ map: mindMap })
        }

        return this.#performFetch(url, options)
    }

    /**
     * Sends a mind map to JabRef's server to save for the first time.
     * @param { object } mindMap - The mind map to save.
     * @param { string } path - The path to save the mind map to.
     * @returns An empty map object (NULL_MAP).
     */
    async saveNewMap(mindMap, path = "libraries/demo/map") {
        // The url will probably be modified according to mindMap's properties (coming in sprint 2)
        const url = path;
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ map: mindMap })
        }

        return this.#performFetch(url, options)
    }

    /**
     * Requests a list of stored mind maps saved on the server.
     * @returns A list of available mind maps stored on the server.
     */
    async listMaps() {
        const url = "libraries";
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }

        return this.#performFetch(url, options)
    }
}