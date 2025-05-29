/**
 * Provides HTTP-connection functionality.
 */
class HTTPClient {
    #host = "http://localhost:6050/";

    constructor() { }

    /**
     * Sends a HTTP-request to the JabRef's server.
     * @param { string } url - The server's URL to make a request to. 
     * @param { any } options - Optional request's options.
     * @returns { object | string }
     * - An **object** in case of a `GET request` or
     * - A **string** in case of a `PUT request` or
     * - An **empty string** `""`, if any request failed.
     */
    async #performFetch(url, options = null) {
        let fetchResult = "";

        const requestUrl = this.#host.concat(url);
        // Setting default options
        // * Note: this includes only cases when options are null or undefined
        options = options ??
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        };

        // Sending the request and waiting for the response
        try {
            const response = await fetch(requestUrl, options);
            if (!response.ok)
                throw new Error(`Response status: ${response.status}`);

            const json = await response.json();
            console.log(json);

            fetchResult = json;
        } catch (e) {
            console.error(e.message);
        }

        return fetchResult;
    }

    /**
     * Requests a mind map (.jmp file) from JabRef's server.
     * @param { string } path - The path to the requested map.
     * @returns { object } - The requested mind map object.
    */
    async LoadMap(path = "") {
        const url = "libraries/demo/map";
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }

        return this.#performFetch(url, options);
    }

    /**
     * Sends a mind map to JabRef's server to save.
     * @param { map } mindMap - The mind map to save.
     * @returns { string } - A string of the request's result.
    */
    async SaveMap(mindMap) {
        const url = "libraries/demo/map";
        const options = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ map: mindMap })
        }
        
        return this.#performFetch(url, options)
    }

    /**
     * Requests a list of stored mind maps saved on the server.
     * @returns { object } - A list of available mind maps stored on the server.
     */
    async ListMaps() {
        const url = "libraries";
        const options = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }

        return this.#performFetch(url, options)
    }
}