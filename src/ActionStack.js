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

    constructor() {
        /**
         * A flag to determine whether there's a previous state to show.
         */
        this.isUndoable = false;
        /**
         * A flag to determine whether there's a next state to show.
         */
        this.isRedoable = false;
    }

    /**
     * Adds a state of a mind map to switch between while
     * canceling/reapplying latest actions. 
     * @param { object } currentState - The current state of
     * a mind map to save.
     */
    add(currentState) {
        // Copying the state to avoid cross-state references
        let json = JSON.stringify(currentState);
        
        // Inserting the state onto current stack's index
        // and removing tail saves since they're invalid
        this.#lastSaves.splice(
            this.#saveIndex + 1,
            this.#lastSaves.length - this.#saveIndex + 1,
            json);

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

        this.isUndoable = this.#saveIndex > 0;
        this.isRedoable = this.#saveIndex < this.#lastSaves.length - 1;
    }

    /**
     * Removes all previously saved states.
     */
    clear() {
        this.#lastSaves.length = 0;
        this.#saveIndex = 0;

        this.isUndoable = false;
        this.isRedoable = false;
    }

    /**
     * Cancels the latest performed change made to a mind map
     * by providing it's state saved earlier.
     * @returns { object } A map's state saved at decremented
     * (-1) stack's index (capped on bottom at 0).
     */
    undo() {
        if (!this.isUndoable) {
            return;
        }

        // * Note: Stack's index shouldn't drop below 0.
        this.#saveIndex = Math.max(this.#saveIndex - 1, 0);
        console.log(`Performing Undo.` +
            `Current state index: ${this.#saveIndex}`);
        this.isUndoable = this.#saveIndex > 0;
        this.isRedoable = true;

        return JSON.parse(this.#lastSaves[this.#saveIndex]);
    }

    /**
     * Reapplies the latest actions (from current stack's index) to
     * a mind map by providing it's corresponding state saved earlier.
     * @returns { object } A map's state saved at incremented
     * (+1) stack's index (capped on top at current stack's size).
    */
    redo() {
        if (!this.isRedoable) {
            return;
        }

        // * Note: Stack's index shouldn't exceed
        // * (the current stack's size - 1)
        // An additional nested Math.max() excludes an edge case
        // of an empty stack (index = -1)
        this.#saveIndex = Math.min(
            this.#saveIndex + 1,
            Math.max(this.#lastSaves.length - 1, 0));
        console.log(`Performing Redo.` +
            `Current state index: ${this.#saveIndex}`);
        this.isUndoable = true;
        this.isRedoable = this.#saveIndex < this.#lastSaves.length - 1;

        return JSON.parse(this.#lastSaves[this.#saveIndex]);
    }
}