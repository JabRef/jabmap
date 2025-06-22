import '@popperjs/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Popover } from 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import jsMind from './jsmind/src/jsmind.js';
// * Note: this import is important for proper manual node creation / addition
import { util } from './jsmind/src/jsmind.util.js';
import './jsmind/src/plugins/jsmind.draggable-node.js';
import { HTTPClient } from '../http/HTTPClient';

// "load" initial mind map data
const mind = {
    meta: {
        name: "jsMind remote",
        author: "hizzgdev@163.com",
        version: "0.2"
    },
    format: "node_tree",
    data: {
        id: "root",
        topic: "jsMind",
        children: [
            {
                id: "easy",
                topic: "Easy",
                direction: "left",
                children: [
                    { id: "easy1", topic: "Easy to show" },
                    { id: "easy2", topic: "Easy to edit" },
                    { id: "easy3", topic: "Easy to store" },
                    { id: "easy4", topic: "Easy to embed" }
                ]
            },
            {
                id: "open",
                topic: "Open Source",
                direction: "right",
                children: [
                    { id: "open1", topic: "on GitHub" },
                    { id: "open2", topic: "BSD License" }
                ]
            }
        ]
    }
};

// specify editor (jsMind's) options
const options = {
    container: 'jsmind_container',      // [required] ID of the container
    editable: true,                     // Is editing enabled?
    theme: null,                        // Theme
    mode: 'full',                       // Display mode
    support_html: true,                 // Does it support HTML elements in the node?
    view: {
        engine: 'canvas',               // Engine for drawing lines between nodes in the mind map
        hmargin: 100,                   // Minimum horizontal distance of the mind map from the outer frame of the container
        vmargin: 50,                    // Minimum vertical distance of the mind map from the outer frame of the container
        line_width: 3,                  // Thickness of the mind map line
        line_color: '#555',             // Thought mind map line color
        line_style: 'curved',           // Line style, straight or curved
        custom_line_render: null,       // Customized line render function
        draggable: true,                // Drag the mind map with your mouse, when it's larger that the container
        hide_scrollbars_when_draggable: false,  // Hide container scrollbars, when mind map is larger than container and draggable option is true
        node_overflow: 'hidden'         // Text overflow style in node
    },
    layout: {
        hspace: 30,                     // Horizontal spacing between nodes
        vspace: 20,                     // Vertical spacing between nodes
        pspace: 13,                     // Horizontal spacing between node and connection line (to place node expander)
        cousin_space: 0                 // Additional vertical spacing between child nodes of neighbor nodes
    },
    shortcut: {
        enable: true,                   // Whether to enable shortcut
        handles: {                      // Named shortcut key event processor
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
            }
        },
        mapping: { 			            // Shortcut key mapping
            addchild: [45, 4096 + 13],  // <Insert>, <Ctrl> + <Enter>
            addbrother: 13,             // <Enter>
            editnode: 113, 	            // <F2>
            delnode: [46, 8], 	            // <Delete>
            toggle: 32, 	            // <Space>
            left: 37, 		            // <Left>
            up: 38, 		            // <Up>
            right: 39, 		            // <Right>
            down: 40, 		            // <Down>
            undo: 4096 + 90,            // <Ctrl> + <Z>
            redo: 4096 + 1024 + 90,     // <Ctrl> + <Shift> + <Z>
            toggleTag: [                // <Ctrl> +
                4096 + 49,              // <1> - Cycle (checkboxes)
                4096 + 50,              // <2> - Star
                4096 + 51,              // <3> - Question
                4096 + 54,              // <6> - Lamp
                4096 + 55,              // <7> - Warning
                4096 + 56,              // <8> - Green Flag
                4096 + 57,              // <9> - Red Flag
            ],
            toggleHighlight: [
                4096 + 52,              // <4> - Yellow Highlight
                4096 + 53,              // <5> - Green Highlight
            ]
        }
    },
};

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

/**
 * Adds "icons" and "highlight" properties to a node object
 * and all its children (this doesn't overwrite existing ones).
 * @param { object } node - The node object to extend.
 */
function extendNode(node) {
    if (!node) {
        return;
    }

    node.icons = node.icons ?? [];
    node.highlight = node.highlight ?? null;

    node.citeKey = node.citeKey ?? null;
    node.preview = node.preview ?? null;

    assignNodeType(node);

    if (!!node.children) {
        node.children.map((child) => { extendNode(child); });
    }
}
/**
 * Defines the type of a node depending on its properties.
 * @param { object } node - The node to assign to a certain type.
 */
function assignNodeType(node) {
    let type = 'TEXT';
    if (!!node.citeKey) {
        type = 'BIBE';
    }

    // * Note: this will probably be extended to handle PDFF / PDFC types 
    node.type = type;
}
// extend the default mind map
extendNode(mind.data);

// create a render for mind maps
const jm = new jsMind(options);

// add some logic to jsMind's events
// * Note: this is called after the original logic is performed
jm.add_event_listener((type, data) => {
    if (type === jsMind.event_type.show) {
        addPopoversToBibEntryNodes();
    }
    if (type === jsMind.event_type.edit) {
        hidePopovers();
    }
    if (type === jsMind.event_type.select) {
        hidePopovers();
    }
});

// display the initial state and add it to the action stack
jm.show(mind);
jm.resetStack();

// create a HTTP client instance
let httpClient = new HTTPClient();

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
        if (node?.data?.type !== 'BIBE') {
            return;
        }

        // otherwise create a popover for it
        const previewHTML = node.data.preview;

        nodeElem.setAttribute('data-bs-toggle', 'popover');
        nodeElem.setAttribute('data-bs-trigger', 'hover focus');
        nodeElem.setAttribute('data-bs-placement', 'bottom');
        nodeElem.setAttribute('data-bs-html', 'true');
        nodeElem.setAttribute('title', 'Entry Preview');
        nodeElem.setAttribute('data-bs-content', previewHTML);

        new Popover(nodeElem, { container: 'body' });
    });
}

//--- Button click handlers ---

// saving - sends mind map's content to JabRef's HTTP server
saveBtn.onclick = function () {
    httpClient.saveMap(jm.get_data());
}

// opening - opens a dialog to select available mind maps
openBtn.onclick = async function () {
    // request a list of available mind maps from JabRef's HTTP server
    let availableMaps = await httpClient.listMaps();

    // access bootstrap's <form-select> element
    let bsSelect = document.getElementById('openMindmapSelect');
    // and replace it's options with retrieved ones
    bsSelect.innerHTML = '';
    for (let i = 0; i < availableMaps.length; i++) {
        bsSelect.innerHTML +=
            `<option value=${availableMaps[i]}>` +
            `${availableMaps[i]}` +
            `</option>`;
    }

    if (bsSelect.innerHTML != '') {
        // select first element
        bsSelect.selectedIndex = 0;
    }
}

// <modal> dialog confirmation button
openSelectedMapBtn.onclick = async function () {
    // access bootstrap's <form-select> element
    let bsSelect = document.getElementById('openMindmapSelect');

    // get selected mind map's name and it's data from server
    let selectedOption = bsSelect.options[bsSelect.selectedIndex];
    // if user didn't select anything, don't load anything :)
    if (!selectedOption) {
        console.log('Couldn\'t open map because no library was selected.');
        return;
    }

    let loadResponse = await httpClient.loadMap(selectedOption.value);
    // if no mind map exists, show the default one
    let loadedMap = loadResponse.map ?? mind;

    extendNode(loadedMap.data);

    // display the retrieved mind map
    jm.show(loadedMap);
    jm.resetStack();
}

// debug button prints current mindmap state to console
printMapToConsoleBtn.onclick = async function () {
    // print mindmap data
    console.log(jm.get_data());
    /*// print currently active library
    console.log(httpClient.currentLibrary);
    // Get preview string for "Tokede_2011" current library (has to be demo to deliver result)
    let preview = await httpClient.getPreviewString("Tokede_2011");
    console.log(preview);*/
}

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

/**
 * Opens a cite-as-you-write window to select citation keys and
 * loads related previews upon confirmation.
 * @returns A list of objects representing retrieved BibEntry properties
 * structured as {key:<>, preview:<>}.
 */
async function getBibNodesProperties() {
    // open cayw window and retrieve selected keys
    let selectedKeys = await httpClient.getCiteKeysWithCAYW();

    // and get preview string for each selected key
    let bibNodesProperties = [];
    for (let i = 0; i < selectedKeys.length; i++) {
        bibNodesProperties.push({
            key: selectedKeys[i],
            preview: await httpClient.getPreviewHTML(selectedKeys[i])
        });
    }

    return bibNodesProperties;
}

/**
 * Turns on and off given buttons using their .disabled property.
 * * Note: buttons (*even a single one*) should be passed as an array / list.
 * @param {Array} buttons - The list of bootstrap buttons to toggle.
 * @param {boolean} isEnabled - The flag to set buttons' .disabled property to.
 */
function toggleButtonsEnabled(buttons, isEnabled) {
    buttons.forEach(b => b.disabled = !isEnabled);
}

BibEntryDropdownMenuButton.onclick = function () {
    // getting the selected node for enabling checks
    const selectedNode = jm.get_selected_node();

    // access dropdown buttons
    const addChildBtn = document.getElementById('addBibEntryAsChildBtn');
    const addSiblingBtn = document.getElementById('addBibEntryAsSiblingBtn');

    // and enable them, if a node's selected
    toggleButtonsEnabled([addChildBtn, addSiblingBtn], !!selectedNode);
    // don't forget to exclude adding 2nd root node :)
    if (!!selectedNode && selectedNode.isroot) {
        addSiblingBtn.disabled = true;
    }
}

addBibEntryAsChildBtn.onclick = async function () {
    // * Note: one node is initially selected

    // ask user to select some citation keys
    // and retrieve related preview strings
    const bibData = await getBibNodesProperties();

    // if node's selection was revoked, break the process
    let selectedNode = jm.get_selected_node();
    if (!selectedNode) {
        console.log('Fail: No node\'s selected to add BibEntries as children :(');
        return;
    }

    // otherwise add extended nodes as children
    bibData.forEach((bibProperties) => {
        jm.add_node(selectedNode,
            util.uuid.newid(),
            bibProperties.key,
            {
                type: 'BIBE',
                citeKey: bibProperties.key,
                preview: bibProperties.preview
            });
    });
    // save map state for undo/redo
    jm.saveState();
    // and create popovers for new BibEntry nodes
    addPopoversToBibEntryNodes();
}

addBibEntryAsSiblingBtn.onclick = async function () {
    // * Note: one node is initially selected

    // ask user to select some citation keys
    // and retrieve related preview strings
    const bibData = await getBibNodesProperties();

    // if node's selection was revoked, break the process
    let selectedNode = jm.get_selected_node();
    if (!selectedNode) {
        console.log('Fail: No node\'s selected to add BibEntries as siblings :(');
        return;
    }

    // otherwise add extended nodes as siblings
    bibData.forEach((bibProperties) => {
        jm.insert_node_after(selectedNode,
            util.uuid.newid(),
            bibProperties.key,
            {
                type: 'BIBE',
                citeKey: bibProperties.key,
                preview: bibProperties.preview
            });
    });
    // save map state for undo/redo
    jm.saveState();
    // and create popovers for new BibEntry nodes
    addPopoversToBibEntryNodes();
}

// icon-dropdown menu button handlers
iconCycleBtn.onclick = function () {
    if (jm != null) {
        applyTag(jm.get_selected_node(), 1);
    }
}

iconStarBtn.onclick = function () {
    if (jm != null) {
        applyTag(jm.get_selected_node(), 2);
    }
}

iconQuestionBtn.onclick = function () {
    if (jm != null) {
        applyTag(jm.get_selected_node(), 3);
    }
}

iconWarningBtn.onclick = function () {
    if (jm != null) {
        applyTag(jm.get_selected_node(), 6);
    }
}

iconLightbulbBtn.onclick = function () {
    if (jm != null) {
        applyTag(jm.get_selected_node(), 7);
    }
}

iconGreenFlagBtn.onclick = function () {
    if (jm != null) {
        applyTag(jm.get_selected_node(), 8);
    }
}

iconRedFlagBtn.onclick = function () {
    if (jm != null) {
        applyTag(jm.get_selected_node(), 9);
    }
}

// disable default <Ctrl> + <number_key> browser's shortcut
// in case a tag should be toggled
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && (jm.get_selected_node() && !jm.view.editing_node)) {
        e.preventDefault();
    }
});