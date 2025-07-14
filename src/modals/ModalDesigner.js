/**
 * This class specializes on showing / hiding bootstrap modals' elements.
 * 
 * * Note: There's only one general layout of modals. This designer might be
 * * extended in the future.
 */
class ModalDesigner {
    static setLayout(modal, layout = MODAL_LAYOUT.Failed) {
        if (!Object.values(MODAL_LAYOUT).includes(layout)) {
            console.log(`Tried to set undefined layout (${layout}) to a modal.`);
            return;
        }

        if (layout === MODAL_LAYOUT.Failed) {
            ModalDesigner.#setFailedLayout(modal);
            return;
        }
        if (layout === MODAL_LAYOUT.Loading) {
            ModalDesigner.#setLoadingLayout(modal);
            return;
        }
        if (layout === MODAL_LAYOUT.Steady) {
            ModalDesigner.#setSteadyLayout(modal);
            return;
        }
    }

    static #setLoadingLayout(modal) {
        ModalDesigner.#toggleInfoText(modal, modal.loadingText);
        ModalDesigner.#toggleSelection(modal, false);
    }
    static #setSteadyLayout(modal) {
        ModalDesigner.#toggleInfoText(modal);
        ModalDesigner.#toggleSelection(modal, true);
    }
    static #setFailedLayout(modal) {
        ModalDesigner.#toggleInfoText(modal, modal.failText);
        ModalDesigner.#toggleSelection(modal, false);
    }

    static #toggleInfoText(modal, text = null) {
        modal.infoTextElement.innerText = text;
        modal.infoTextElement.hidden = text == null;
    }
    static #toggleSelection(modal, isEnabled) {
        modal.selectElement.hidden = !isEnabled;
        modal.confirmButtonElement.disabled = !isEnabled;
    }
}

const MODAL_LAYOUT = Object.freeze({
    Loading: 0,
    Steady: 1,
    Failed: -1
});

export { ModalDesigner, MODAL_LAYOUT };