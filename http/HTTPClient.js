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
     * @returns { string } - A JSON string of the request's result.
     */
    async #performFetch(url, options = null) {
        let fetchResult = "";

        const requestUrl = this.#host.concat(url);
        // Setting default options
        // * Note: this includes only cases when options are null or undefined
        options = {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        } ?? options;

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
     * Requests a .jmp file with the saved mind map from JabRef's server.
     * @param { string } path - The path of a requested map.
     * @returns { string } - A JSON string of the request's result.
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
     * @returns { string } - A JSON string of the request's result.
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
}