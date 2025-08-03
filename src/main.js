import '@popperjs/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Popover } from 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

import jsMind from './jsmind/src/jsmind.js';
// * Note: this import is important for proper manual node creation / addition
import { util } from './jsmind/src/jsmind.util.js';
import './jsmind/src/plugins/jsmind.draggable-node.js';

import { HTTPClient, REQUEST_RESULT } from '../http/HTTPClient';

import { ModalDesigner, MODAL_LAYOUT } from './modals/ModalDesigner.js';
import { ModalObject } from './modals/ModalObject.js';

import { DefaultMap, FelixMap } from './mindPresets/DefaultMindMaps.js';
import { DefaultOptions, NoEditOptions } from './mindPresets/DefaultMindOptions.js';
import { NodeExtender } from './mindPresets/NodeExtender.js';

//#region [General Setup]
// * This region contains declaration of most basic instances
// * e.g. jsMind, HTTPClient and their properties

// create a HTTP client instance
let httpClient = new HTTPClient();

/**
 * Proves whether there's connection to the server.
 * If not connected, loads the fail page.
 */
async function checkConnection() {
    let mainDisplayValue = 'flex';
    let failDisplayValue = 'none';

    let isConnected = await httpClient.isConnected();

    if (!isConnected) {
        jm.select_clear();
        mainDisplayValue = 'none';
        failDisplayValue = 'flex';
    }

    topNavBar.style.display = mainDisplayValue;
    jsmind_container.style.display = mainDisplayValue;
    noConnectionBlock.style.display = failDisplayValue;
}
checkConnection();
tryAgainBtn.onclick = checkConnection;

// "load" initial mind map data
let mind = DefaultMap;
// specify editor (jsMind's) options
const options = DefaultOptions;
// adding Named shortcut key event processor
options.shortcut.handles = {
    'undo': function (jm, e) {
        // display mind map's previous state (undo the last operation)
        hidePopovers();
        jm.undo();
    },
    'redo': function (jm, e) {
        // display mind map's next state (redo the next operation)
        hidePopovers();
        jm.redo();
    },
    'toggleTag': function (jm, e) {
        let selectedNode = jm.get_selected_node();
        // if no node's selected -> skip
        if (!selectedNode) {
            return;
        }
        // apply / remove a tag otherwise
        applyTag(selectedNode, e.key);
    },
    'toggleHighlight': function (jm, e) {
        let selectedNode = jm.get_selected_node();
        // if no node's selected -> skip
        if (!selectedNode) {
            return;
        }
        // apply / remove a highlight
        applyHighlight(selectedNode, e.key);
    },
    'save': function (jm, e) {
        saveBtn.onclick();
    },
    'load': function (jm, e) {
        loadMapModalObject.toggle();
        openBtn.onclick();
    },
    'addBibChild': function (jm, e) {
        if (!jm.get_selected_node()) {
            return;
        }
        addBibEntryAsChildBtn.onclick();
    },
    'addPDFChild': function (jm, e) {
        if (!jm.get_selected_node()) {
            return;
        }
        addPDFModalObject.toggle();
        addPDFAsChildBtn.onclick();
    }
}
// extend the default mind map
NodeExtender.extendNode(mind.data);

// create a render for mind maps
const jm = new jsMind(options);

// add some logic to jsMind's events
// * Note: this is called after the original logic is performed
jm.add_event_listener((type, data) => {
    if (type === jsMind.event_type.show) {
        addPopoversToBibEntryNodes();

        redoBtn.disabled = !jm.actionStack.isRedoable;
        undoBtn.disabled = !jm.actionStack.isUndoable;
    }
    if (type === jsMind.event_type.edit) {
        hidePopovers();

        if (['move_node', 'remove_node'].includes(data.evt)){
            jm.saveState();
        }

        redoBtn.disabled = !jm.actionStack.isRedoable;
        undoBtn.disabled = !jm.actionStack.isUndoable;
    }
    if (type === jsMind.event_type.select) {
        hidePopovers();

        // disable nodes' buttons, if no node's selected
        let isNodeSelected = !!jm.get_selected_node();
        let buttons = [
            newChildBtn,
            newSiblingBtn,
            tagsDropdownMenuButton,
            BibEntryDropdownMenuButton,
            PDFDropDownMenuButton
        ];
        toggleButtonsEnabled(buttons, isNodeSelected);
    }
});

// display the initial state and add it to the action stack
jm.show(mind);
jm.resetStack();

//#endregion
//#region [General Element Manipulation]
// * This region contains the most general methods to manipulate
// * HTML elements such as Bootstrap's Buttons and Selects
// * as well as undo / redo and debug buttons

/**
 * Turns on and off given buttons using their .disabled property.
 * If a button is related to a dropdown, its menu will be closed before toggle.
 * * Note: buttons (*even a single one*) should be passed as an array / list.
 * @param { Array } buttons - The list of bootstrap buttons to toggle.
 * @param { boolean } isEnabled - The flag to enable / disable buttons.
 */
function toggleButtonsEnabled(buttons, isEnabled) {
    buttons.forEach((b) => {
        Dropdown.getOrCreateInstance(b).hide();
        b.disabled = !isEnabled;
    });
}

// debug button prints current mind map state to console
// printMapToConsoleBtn.onclick = async function () {
//     // print mind map data
//     console.log(jm.get_data());
// }

// undo - discard the last operation (display the previous state)
undoBtn.onclick = function () {
    hidePopovers();
    jm.undo();
}

// redo - reapply the next operation (display the following state)
redoBtn.onclick = function () {
    hidePopovers();
    jm.redo();
}

//#endregion
//#region [Save / Open click handlers]

// define modal object for opening mind maps (not the bootstrap one)
// for easier layout switching
let mapsLoadingText = 'Listing available mind maps...';
let mapsFailText = 'No mind maps were found. Try to create one in JabRef first.';
let loadMapModalObject = new ModalObject(
    selectMindmapModal,
    exampleModalLabel,
    openMindmapInfoText,
    openMindmapSelect,
    openSelectedMapBtn,
    mapsLoadingText,
    mapsFailText
);

// save - sends mind map's content to JabRef's HTTP server
saveBtn.onclick = async function () {
    let mindMap = jm.get_data();
    if (!httpClient || !mindMap) {
        console.error('Error: Cannot save mind map.');
        return;
    }

    httpClient.saveMap(mindMap);
};

// open - opens a dialog to select available mind maps
openBtn.onclick = async function () {
    // * Note: modal's elements can be accessed directly by ID
    
    // set "loading layout" to the opening modal
    ModalDesigner.setLayout(loadMapModalObject, MODAL_LAYOUT.Loading);

    // request a list of available mind maps from JabRef's HTTP server
    let mapsRequest = await httpClient.listMaps();
    let availableMaps = mapsRequest.value;
    
    // update modal's layout according to retrieved list
    if (mapsRequest.code !== REQUEST_RESULT.Success || availableMaps?.length <= 0) {
        ModalDesigner.setLayout(loadMapModalObject, MODAL_LAYOUT.Failed);
        return;
    }
    
    // and show it to the user, if there're any maps
    ModalDesigner.setLayout(loadMapModalObject, MODAL_LAYOUT.Steady);
    loadMapModalObject.fillSelect(availableMaps, availableMaps);
}

// open (in the mind map selection modal) - loads selected mind map
openSelectedMapBtn.onclick = async function () {
    // get selected mind map's name
    let selectedOptions = loadMapModalObject.getSelectedOptions();

    // if user didn't select anything, don't load anything :)
    if (!selectedOptions) {
        console.warn('Couldn\'t open map because no library was selected.');
        return;
    }

    // retrieve the mind map from server
    let loadRequest = await httpClient.loadMap(selectedOptions[0]);
    if (loadRequest.code !== REQUEST_RESULT.Success) {
        console.warn(`Failed to load ${selectedOptions[0]} mind map. ` +
            `Loading the default one.`);
    }
        
    // if no mind map exists, show the default one
    let loadedMap = loadRequest.value?.map ?? mind;
    NodeExtender.extendNode(loadedMap.data);

    // display the retrieved mind map
    jm.show(loadedMap);
    jm.resetStack();
}

//#endregion
//#region [Text Nodes]

// new sibling node - call the default shortcut-handler
newSiblingBtn.onclick = function () {
    if (!!jm) {
        jm.shortcut.handle_addbrother(jm, null);
    }
}

// new child node - call the default shortcut-handler
newChildBtn.onclick = function () {
    if (!!jm) {
        jm.shortcut.handle_addchild(jm, null);
    }
}

//#endregion
//#region [BibEntry Nodes]

/**
 * Opens a cite-as-you-write window to select citation keys and
 * loads related previews upon confirmation.
 * @returns A list of objects representing retrieved BibEntry properties
 * structured as {key:<>, preview:<>}.
 */
async function getBibNodesProperties() {
    // open cayw window and retrieve selected keys
    let selectedKeys = await httpClient.getCiteKeysWithCAYW();
    if (!selectedKeys) {
        console.warn('There\'re no citation keys to create nodes from ( ,_,)');
        return null;
    }

    // and get preview string for each selected key
    let bibNodesProperties = [];
    for (let i = 0; i < selectedKeys.length; i++) {
        bibNodesProperties.push({
            key: selectedKeys[i],
            preview: (await httpClient.getPreviewHTML(selectedKeys[i])).value
        });
    }

    return bibNodesProperties;
}

/**
 * Adds given BibEntry data to the current mind map
 * using specific function of jsMind.
 * @param { Array } bibList - The BibEntries to add.
 * @param { CallableFunction } add_nodes_callback - The function to add new nodes by.
 */
function addBibEntryNodes(bibList, add_nodes_callback) {
    // * Note: one node is initially selected

    // if node's selection was revoked, break the process
    let selectedNode = jm.get_selected_node();
    if (!selectedNode) {
        console.log('Fail: No node\'s selected to add BibEntries to :(');
        return;
    }

    // otherwise add extended nodes as children
    bibList.forEach((bibProperties) => {
        add_nodes_callback(selectedNode,
            util.uuid.newid(),
            bibProperties.key,
            {
                type: 'BibEntry',
                citeKey: bibProperties.key,
                preview: bibProperties.preview
            });
    });
    // save map state for undo/redo
    jm.saveState();
    // and create popovers for new BibEntry nodes
    addPopoversToBibEntryNodes();
}

/**
 * Hides all existing Bootsrap's popovers.
 */
function hidePopovers() {
    // iterate through all Bootstrap's toggles as HTML elements
    document.querySelectorAll('.popover').forEach((bsToggle) => {
        bsToggle.remove();
    });
}
/**
 * Attaches Bootstrap's popovers to all BibEntry nodes.
 */
function addPopoversToBibEntryNodes() {
    // iterate through all nodes as HTML elements
    const allNodes = document.querySelectorAll('jmnode');
    allNodes.forEach(nodeElem => {
        // if one already has a popover, skip it
        if (nodeElem.getAttribute('data-bs-toggle') === 'popover') {
            return;
        }

        // get node's instance
        const nodeId = nodeElem.getAttribute('nodeid');
        if (!nodeId) {
            return;
        }
        const node = jm.get_node(nodeId);
        // if one isn't a BibEntry node, skip it
        if (node?.data?.type !== 'BibEntry') {
            return;
        }

        // otherwise create a popover for it
        const previewHTML = node.data.preview;

        nodeElem.setAttribute('data-bs-toggle', 'popover');
        nodeElem.setAttribute('data-bs-trigger', 'hover focus');
        nodeElem.setAttribute('data-bs-placement', 'bottom');
        nodeElem.setAttribute('data-bs-html', 'true');
        nodeElem.setAttribute('title', 'BibTex Preview');
        nodeElem.setAttribute('data-bs-content', previewHTML);

        new Popover(nodeElem, { container: 'body' });
    });
}

addBibEntryAsChildBtn.onclick = async function () {
    // ask user to select some citation keys
    // and retrieve related preview strings
    const bibList = await getBibNodesProperties();
    if (!bibList) {
        console.warn('Fail: There\'re no BibEntry nodes to add as children ( ,_,)');
        return;
    }

    // add selected BibEntries to the mind map as child nodes
    addBibEntryNodes(bibList,
        (selectedNode, id, topic, data) => {
            jm.add_node(selectedNode, id, topic, data);
        });
}

addBibEntryAsSiblingBtn.onclick = async function () {
    // ask user to select some citation keys
    // and retrieve related preview strings
    const bibList = await getBibNodesProperties();
    if (!bibList) {
        console.warn('Fail: There\'re no BibEntry nodes to add as siblings ( ,_,)');
        return;
    }

    // add selected BibEntries to the mind map as child nodes
    addBibEntryNodes(bibList,
        (selectedNode, id, topic, data) => {
            jm.insert_node_after(selectedNode, id, topic, data);
        });
}

//#endregion
//#region [PDF Nodes]

// define PDF modal object (not the bootstrap one)
// for easier layout switching
let PDFLoadingText = 'Loading PDFs from current library...';
let PDFFailText = 'There\'re no PDFs in current library.';
let addPDFModalObject = new ModalObject(
    selectPDFModal,
    SelectPDFModalLabel,
    PDFModalInfoText,
    addPDFSelect,
    addSelectedPDFBtn,
    PDFLoadingText,
    PDFFailText
);

// default insertion mode
let PDFNodeInsertMode = 'child';

// set the insertion mode when the related buttons are clicked
addPDFAsSiblingBtn.onclick = function () {
    PDFNodeInsertMode = 'sibling';
};
addPDFAsChildBtn.onclick = function () {
    PDFNodeInsertMode = 'child';
};

// when the modal opens: show list of available PDFs
selectPDFModal.addEventListener('show.bs.modal', async () => {    
    // set "loading layout" to the modal
    ModalDesigner.setLayout(addPDFModalObject, MODAL_LAYOUT.Loading);

    // getting the list of available PDFs
    let pdfRequest = await httpClient.getPDFFiles();
    let pdfList = pdfRequest.value;

    // update modal's layout according to retrieved list
    if (pdfRequest.code !== REQUEST_RESULT.Success || pdfList?.length <= 0) {
        ModalDesigner.setLayout(addPDFModalObject, MODAL_LAYOUT.Failed);
        return;
    }

    // and show it to the user, if there're any PDFs
    ModalDesigner.setLayout(addPDFModalObject, MODAL_LAYOUT.Steady);
    addPDFModalObject.fillSelect(pdfList, pdfList.map((pdf) => pdf.fileName));
});

// when the "Add" button is clicked: add selected PDF nodes
addSelectedPDFBtn.onclick = function () {
    // get the currently selected node in the mind map
    const selectedNode = jm.get_selected_node();
    if (!selectedNode) {
        console.warn('Fail: No node\'s selected to add PDFs to :(');
        return;
    }
    
    // get selected PDFs
    let selectedPDFs = addPDFModalObject.getSelectedOptions();
    if (!selectedPDFs) {
        console.warn('There\'re no PDFs to create nodes from ( ,_,)');
        return;
    }

    // create a new node for each chosen PDF
    selectedPDFs.forEach((pdf) => {
        const newId = util.uuid.newid();
        const data = {
            type: 'PDFFile',
            parentCitationKey: pdf.parentCitationKey,
            path: pdf.path,
            fileName: pdf.fileName
        };

        // insert in selected mode
        if (PDFNodeInsertMode === 'sibling') {
            jm.insert_node_after(selectedNode, newId, pdf.fileName, data);
        } else {
            jm.add_node(selectedNode, newId, pdf.fileName, data);
        }
    });
    // save map state for undo/redo
    jm.saveState();
};

//#endregion
//#region [Icons & Tags]

/**
 * Applies or removes a specific tag icon to / from the selected node.
 * @param { object } selectedNode - The node a tag should be
 * applied to / removed from.
 * @param { string } iconKey - The key of the icon in the 'TAGS_ICONS' "dictionary".
 */
function applyTag(selectedNode, iconKey) {
    let keyIconSets = {
        1: ["unchecked", "checked"],
        2: ["star"],
        3: ["question_mark"],
        6: ["warning"],
        7: ["light_bulb"],
        8: ["green_flag"],
        9: ["red_flag"]
    };

    // if the node doesn't have icons list, assign an empty one
    selectedNode.data.icons = selectedNode.data.icons ?? [];

    // getting currently applied tags and the list of toggling ones
    const appliedIcons = selectedNode.data.icons;
    const iconSet = keyIconSets[iconKey];

    // searching for icon and its index to replace or remove
    let toggledIcon = appliedIcons.find(function (icon) {
        return iconSet.includes(icon);
    });
    let toggledIndex = appliedIcons.indexOf(toggledIcon);

    // if nothing's found, add the first one of the icon set
    if (!toggledIcon) {
        selectedNode.data.icons.push(iconSet[0]);
    }
    // if found icon is the last one of the set
    if (toggledIcon === iconSet[iconSet.length - 1]) {
        // simply remove it
        selectedNode.data.icons.splice(toggledIndex, 1);
    } else {
        // otherwise swap it with the next one of the set
        selectedNode.data.icons[toggledIndex] = iconSet[iconSet.indexOf(toggledIcon) + 1];
    }
    // redraw the node and memorize current state
    jm.update_node(selectedNode.id, selectedNode.topic);
    jm.saveState();
}

/**
 * Applies or removes a specific highlight color to / from
 * the selected node.
 * @param { object } selectedNode - The node a highlight should be
 * applied to / removed from.
 * @param { string } highlight - The color of the highlight.
 */
function applyHighlight(selectedNode, highlight) {
    selectedNode.data.highlight = selectedNode.data.highlight !== highlight ?
        highlight : null;
    // redraw the node and memorize current state
    jm.update_node(selectedNode.id, selectedNode.topic);
    jm.saveState();
}

// icon-dropdown menu button handlers
[
    iconCycleBtn,
    iconStarBtn,
    iconQuestionBtn,
    iconWarningBtn,
    iconLightbulbBtn,
    iconGreenFlagBtn,
    iconRedFlagBtn
].forEach((button, index) => {
    // skip numbers 4 and 5 that're reserved for highlighting
    index = index >= 3 ? index + 2 : index;
    button.onclick = function () {
        if (jm != null) {
            applyTag(jm.get_selected_node(), index + 1);
        }
    }
});

//#endregion
//#region [Miscellaneous]

// A flag to distinguish whether default shortcuts should be disabled
let isJsMindSelected = false;

// disable default <Ctrl> + <Key> browser's shortcut
// in case the jsmind_container is active
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey &&
        ((jm.get_selected_node() && !jm.view.editing_node) || isJsMindSelected)) {
            e.preventDefault();
        }
        
    isJsMindSelected = document.activeElement.classList.contains('jsmind-inner');
});

// remove focus from active element upon showing / closing modals
// due to a 'Blocked aria-hidden' warning
// * More about it in this answer: https://stackoverflow.com/a/79210442/23515071
document.addEventListener('hide.bs.modal', function (event) {
    if (document.activeElement) {
        document.activeElement.blur();
    }
});
document.addEventListener('show.bs.modal', function (event) {
    if (document.activeElement) {
        document.activeElement.blur();
    }
});

//#endregion