/**
 * Provides Undo and Redo functionalities to cancel
 * and reapply latest changes made to a mind map.
 */
export class ActionStack {
    // The maximum amount of actions to cancel/reapply
    #STACK_SIZE = 10;

    // The index of currently shown map
    #saveIndex = 0;
    // The list of actions (maps) to cancel/reapply
    #lastSaves = [];

    constructor() { }

    /**
     * Adds a state of a mind map to switch between while
     * canceling/reapplying latest actions. 
     * @param { object } currentState - The current state of
     * a mind map to save.
     */
    add(currentState) {
        // Inserting the state onto current stack's index
        // and removing tail saves since they're invalid
        this.#lastSaves.splice(
            this.#saveIndex + 1,
            this.#lastSaves.length - this.#saveIndex + 1,
            currentState);

        // If stack size is exceeded, remove the first state
        // (the earliest change) and shift all elements by 1
        // to the left (bottom of the stack)
        if (this.#lastSaves.length > this.#STACK_SIZE) {
            this.#lastSaves.shift();
        } else {
            // Otherwise update the index of currently shown map 
            this.#saveIndex = this.#lastSaves.length - 1;
        }

        console.log(`Saved map. Stack size: ${this.#lastSaves.length}`);
    }

    /**
     * Cancels the latest performed change made to a mind map
     * by providing it's state saved earlier.
     * @returns { object } A map's state saved at decremented
     * (-1) stack's index (capped on bottom at 0).
     */
    undo() {
        // * Note: Stack's index shouldn't drop below 0.
        this.#saveIndex = Math.max(this.#saveIndex - 1, 0);
        console.log(`Performing Undo.` +
            `Current state index: ${this.#saveIndex}`);
        return this.#lastSaves[this.#saveIndex];
    }

    /**
     * Reapplies the latest actions (from current stack's index) to
     * a mind map by providing it's corresponding state saved earlier.
     * @returns { object } A map's state saved at incremented
     * (+1) stack's index (capped on top at current stack's size).
    */
    redo() {
        // * Note: Stack's index shouldn't exceed
        // * (the current stack's size - 1)
        // An additional nested Math.max() excludes an edge case
        // of an empty stack (index = -1)
        this.#saveIndex = Math.min(
            this.#saveIndex + 1,
            Math.max(this.#lastSaves.length - 1, 0));
        console.log(`Performing Redo.` +
            `Current state index: ${this.#saveIndex}`);
        return this.#lastSaves[this.#saveIndex];
    }
}