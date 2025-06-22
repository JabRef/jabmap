import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrap from 'bootstrap';
import Popover from 'bootstrap/js/dist/popover';
import Dropdown from 'bootstrap/js/dist/dropdown';
import jsMind from './jsmind/src/jsmind.js';
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
                closeAllPopovers();
                setTimeout(addPopoversToNodes, 100);
                jm.undo();
            },
            'redo': function (jm, e) {
                // display mind map's next state (redo the next operation)
                closeAllPopovers();
                setTimeout(addPopoversToNodes, 100);
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
            delnode: 46, 	            // <Delete>
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
function applyTag (selectedNode, iconKey) {
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
 * @param { string } highlightKey - The color of the highlight.
 */
function applyHighlight (selectedNode, highlight) {
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
function extendNode (node) {
    if (!node) {
        return;
    }

    node.icons = node.icons ?? [];
    node.highlight = node.highlight ?? null;

    if (!!node.children) {
        node.children.map((child) => { extendNode(child); });
    }
}
// extend the default mind map
extendNode(mind.data);

// create a render for mind maps and display the initial one
const jm = new jsMind(options);
jm.show(mind);
// add the initial state to the action stack
jm.saveState();

// create a HTTP client instance
let httpClient = new HTTPClient();

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
            '<option value="' + availableMaps[i] + '">'
            + availableMaps[i]
            + '</option>';
    }
}

// <modal> dialog confirmation button
openSelectedMapBtn.onclick = async function () {
    // access bootstrap's <form-select> element
    let bsSelect = document.getElementById('openMindmapSelect');

    // get selected mind map's name and it's data from server
    let selectedOption = bsSelect.options[bsSelect.selectedIndex].value;

    let loadResponse = await httpClient.loadMap(selectedOption);

    // display the retrieved mind map
    jm.show(loadResponse.map);

    console.log(httpClient.listEntries());
}

// debug button prints current mindmap state to console
printMapToConsoleBtn.onclick = function () {
    console.log(jm.get_data());
}

// undo - discard the last operation (display the previous state)
undoBtn.onclick = function () {
    jm.undo();
}

// redo - reapply the next operation (display the following state)
redoBtn.onclick = function () {
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

// icon-dropdown menu button handlers
iconCycleBtn.onclick = function () {
    if(jm != null) {
        applyTag(jm.get_selected_node(),1);
    }
}

iconStarBtn.onclick = function () {
    if(jm != null) {
        applyTag(jm.get_selected_node(),2);
    }
}

iconQuestionBtn.onclick = function () {
    if(jm != null) {
        applyTag(jm.get_selected_node(),3);
    }
}

iconWarningBtn.onclick = function () {
    if(jm != null) {
        applyTag(jm.get_selected_node(),6);
    }
}

iconLightbulbBtn.onclick = function () {
    if(jm != null) {
        applyTag(jm.get_selected_node(),7);
    }
}

iconGreenFlagBtn.onclick = function () {
    if(jm != null) {
        applyTag(jm.get_selected_node(),8);
    }
}

iconRedFlagBtn.onclick = function () {
    if(jm != null) {
        applyTag(jm.get_selected_node(),9);
    }
}

// disable default <Ctrl> + <number_key> browser's shortcut
// in case a tag should be toggled
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && (jm.get_selected_node() && !jm.view.editing_node)) {
        e.preventDefault();
    }
});

const entry = { // BibTeX entry object
    author: "R. Corti, A. J. Flammer, N. K. Hollenberg, and T. F. Lüscher", // Author name
    title: "Cocoa and Cardiovascular Health", // Article title
    journal: "Circulation, vol. 119, no. 10", // Journal details
    pages: "pp. 1433–1441", // Page numbers
    releasedOn: "Mar. 2009" // Publication date
};

function getBibTeXEntry(entry) { // Returns formatted BibTeX preview
    return `
<!--Author field-->
<strong>Author:</strong> ${entry.author},<br> 
<!--Title field-->
<strong>Title:</strong> “${entry.title}”,<br>
<!-- Journal field-->
<strong>Journal:</strong> ${entry.journal},<br> 
<!--Pages field-->
<strong>Pages:</strong> ${entry.pages},<br> 
<!-- Release date field-->
<strong>Released on:</strong> ${entry.releasedOn},`;
}

function generateBibTeXEntry(node) { // Generates a BibTeX entry based on the node's topic
    return {
        author: `Auto Author for ${node.topic}`, // Auto-generated author using node topic
        title: `${node.topic}`, // Node topic as title
        journal: `Auto Journal`, // Placeholder journal
        pages: `pp. 1–10`, // Placeholder pages
        releasedOn: `2025` // Placeholder release year
    };
}

function addPopoversToNodes() { // Attaches Bootstrap popovers to all mind map nodes
    document.querySelectorAll('[nodeid]').forEach(nodeElem => { // Loop through all elements with node_id attribute
        if (nodeElem.getAttribute('data-bs-toggle') === 'popover') return; // Skip if popover already attached
        const nodeId = nodeElem.getAttribute('nodeid'); // Get node id
        const node = jm.get_node(nodeId); // Get node object from jsMind
        const entry = generateBibTeXEntry(node); // Generate BibTeX entry for this node
        nodeElem.setAttribute('data-bs-toggle', 'popover'); // Enable popover
        nodeElem.setAttribute('data-bs-trigger', 'hover focus'); // Show on hover
        nodeElem.setAttribute('data-bs-placement', 'bottom'); // Always show popover below the node
        nodeElem.setAttribute('data-bs-html', 'true'); // Allow HTML content in popover
        nodeElem.setAttribute('title', 'Entry Preview'); // Popover title
        nodeElem.setAttribute('data-bs-content', getBibTeXEntry(entry)); // Popover content
        new bootstrap.Popover(nodeElem, { container: 'body' }); // Initialize Bootstrap popover
    });
}

window.addEventListener('DOMContentLoaded', () => { // When DOM is fully loaded
    addPopoversToNodes(); // Attach popovers to all nodes
});

jm.add_event_listener(function(type, data) { // Listen for jsMind events that update the mind map
    if ([
        'show',
        'add_node',
        'update',
        'select_node',
        'expand_node',
        'collapse_node',
    ].includes(type)) { // If event is one that changes the nodes
        closeAllPopovers();
        setTimeout(addPopoversToNodes, 100); // Re-attach popovers after a short delay
    }
});

// Adding Entry Preview to the Child Nodes
const container = document.getElementById('jsmind_container'); // Get the mind map container
new MutationObserver(muts => { // Observe DOM changes in the container
    muts.forEach(m => {
        m.addedNodes.forEach(n => {
            if (n.nodeType === 1 && n.hasAttribute('nodeid')) { // If a new node element is added
                addPopoversToNodes(); // Attach popover to the new node
            }
        });
    });
}).observe(container, { childList: true, subtree: true }); // Observe all child nodes and subtrees

function closeAllPopovers() {
    // Dispose all Bootstrap popover instances on .jsmind-inner elements
    document.querySelectorAll('.jsmind-inner').forEach(el => {
        // Get the popover instance (Bootstrap 5 way)
        const instance = bootstrap.Popover.getInstance(el);
        if (instance) {
            instance.dispose(); // Remove popover from DOM and cleans up
        }
    });
    // As a fallback, remove any orphaned popover elements left in the DOM
    document.querySelectorAll('.popover').forEach(pop => pop.remove());
}

// Observe for changes in the container's DOM
new MutationObserver(mutations => {
    // For each mutation record, get its removedNodes and addedNodes.
    mutations.forEach(({ removedNodes, addedNodes }) => {
        // Loop through every node that was removed.
        removedNodes.forEach(node => {
            // If the node is an element and has a 'nodeid' attribute.
            if (node.nodeType === 1 && node.hasAttribute('nodeid')) {
                // Get the popover instance from Bootstrap for this node.
                const popover = bootstrap.Popover.getInstance(node);
                // If a popover exists, dispose of it to clean up.
                if (popover) popover.dispose();
            }
        });
        // Loop through every node that was added.
        addedNodes.forEach(node => {
            // If the node is an element and has a 'nodeid' attribute.
            if (node.nodeType === 1 && node.hasAttribute('nodeid')) {
                // Reapply popovers to the new node.
                addPopoversToNodes();
            }
        });
    });
})
    // Start observing the container for changes in child elements and all its sub-elements.
    .observe(container, {
        childList: true,  // Watch for added or removed child nodes.
        subtree: true     // Extend the observation to all descendants of the container.
    });