import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import jsMind from './jsmind/src/jsmind.js';
import './jsmind/src/plugins/jsmind.draggable-node.js';
import { HTTPClient } from '../http/HTTPClient';

const TYPE_ICONS = {
    TEXT: null,
    BIBE: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 896' fill='%23000000' x='0' y='0' width='1024' height='896'%3E%3Cpath fill='%23000000' d='M960 320H64q-27 0-45.5-18.5T0 256.5T18.5 211T64 192h896q26 0 45 19t19 45.5t-19 45t-45 18.5zM832 128H192q-27 0-45.5-18.5t-18.5-45T146.5 19T192 0h640q26 0 45 19t19 45.5t-19 45t-45 18.5zM128 512q-27 0-45.5-18.5t-18.5-45T82.5 403t45.5-19h768q26 0 45 19t19 45.5t-19 45t-45 18.5H128zm-64 64h896q26 0 45 19t19 45.5t-19 45t-45 18.5H64q-27 0-45.5-18.5T0 640t18.5-45.5T64 576zm256 192h384q26 0 45 19t19 45.5t-19 45t-45 18.5H320q-27 0-45.5-18.5T256 832t18.5-45.5T320 768z'/%3E%3C/svg%3E",
    PDFF: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%23ca0202' x='0' y='0' width='512' height='512'%3E%3Cpath fill='%23ca0202' d='M0 64C0 28.7 28.7 0 64 0h160v128c0 17.7 14.3 32 32 32h128v144H176c-35.3 0-64 28.7-64 64v144H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0l128 128zM176 352h32c30.9 0 56 25.1 56 56s-25.1 56-56 56h-16v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24h-16v48h16zm96-80h32c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48h-32c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16h-16v96h16zm80-112c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v32h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V368z'/%3E%3C/svg%3E",
    PDFC: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 24 24'%3E%3Crect x='0' y='0' width='24' height='24' rx='8' fill='none'/%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c01111' x='0' y='0' width='24' height='24'%3E%3Cpath fill='%23c01111' d='M12 9a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm7-7H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11.59l3.7 3.71A1 1 0 0 0 21 22a.84.84 0 0 0 .38-.08A1 1 0 0 0 22 21V5a3 3 0 0 0-3-3Zm1 16.59l-2.29-2.3A1 1 0 0 0 17 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1ZM8 9a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm8 0a1 1 0 1 0 1 1a1 1 0 0 0-1-1Z'/%3E%3C/svg%3E%3C/svg%3E"
};
const TAG_ICONS = {
    1: {
        name: "checks",
        src: [ "cycleUnchecked.svg", "CycleChecked.svg"]
    },
    2: {
        name: "star",
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128' x='0' y='0' width='128' height='128'%3E%3Cpath fill='%23FDD835' d='m68.05 7.23l13.46 30.7a7.047 7.047 0 0 0 5.82 4.19l32.79 2.94c3.71.54 5.19 5.09 2.5 7.71l-24.7 20.75c-2 1.68-2.91 4.32-2.36 6.87l7.18 33.61c.63 3.69-3.24 6.51-6.56 4.76L67.56 102a7.033 7.033 0 0 0-7.12 0l-28.62 16.75c-3.31 1.74-7.19-1.07-6.56-4.76l7.18-33.61c.54-2.55-.36-5.19-2.36-6.87L5.37 52.78c-2.68-2.61-1.2-7.17 2.5-7.71l32.79-2.94a7.047 7.047 0 0 0 5.82-4.19l13.46-30.7c1.67-3.36 6.45-3.36 8.11-.01z'/%3E%3C/svg%3E"
    },
    3: {
        name: "question_mark",
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 412 731' fill='%23c81e1e' x='0' y='0' width='412' height='731'%3E%3Cpath fill='%23c81e1e' d='M86 281H12c-7-23-12-46-12-71C0 84 81 0 207 0c117 0 191 64 204 178c1 8 1 17 1 26c0 53-14 98-50 135c-35 35-59 58-97 91c-41 36-41 98-41 144h-77c0-108 24-153 59-188c34-34 83-64 109-97c22-26 28-57 28-85c0-87-49-136-136-136c-88 0-138 55-138 142c0 26 6 49 17 71zm61 373h77v77h-77v-77z'/%3E%3C/svg%3E"
    },
    // 4 and 5 are reserved for highlights
    6: {
        name: "warning",
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64'%3E%3Cpolygon points='32,6 2,58 62,58' fill='%23ffdd15' stroke='%23e2b800' stroke-width='2'/%3E%3Crect x='29' y='22' width='6' height='20' rx='3' fill='%23222222'/%3E%3Ccircle cx='32' cy='50' r='3' fill='%23222222'/%3E%3C/svg%3E"
    },
    7: {
        name: "lighbulb",
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512' fill='%23fdee44' x='0' y='0' width='384' height='512'%3E%3Cpath fill='%23fdee44' d='M272 384c9.6-31.9 29.5-59.1 49.2-86.2c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c19.8 27.1 39.7 54.4 49.2 86.2h160zm-80 128c44.2 0 80-35.8 80-80v-16H112v16c0 44.2 35.8 80 80 80zm-80-336c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z'/%3E%3C/svg%3E"
    },
    8: {
        name: "green_flag",
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310c613' x='0' y='0' width='24' height='24'%3E%3Cpath fill='%2310c613' fill-rule='evenodd' stroke='%2310c613' stroke-width='2' d='M2 24V2c8-3.524 11 4.644 20 0v12c-8 4.895-13-4.103-20 0'/%3E%3C/svg%3E"
    },
    9: {
        name: "red_flag",
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c61010' x='0' y='0' width='24' height='24'%3E%3Cpath fill='%23c61010' fill-rule='evenodd' stroke='%23c61010' stroke-width='2' d='M2 24V2c8-3.524 11 4.644 20 0v12c-8 4.895-13-4.103-20 0'/%3E%3C/svg%3E"
    },
    j: {
        name: "BIBE",
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 896' fill='%23000000' x='0' y='0' width='1024' height='896'%3E%3Cpath fill='%23000000' d='M960 320H64q-27 0-45.5-18.5T0 256.5T18.5 211T64 192h896q26 0 45 19t19 45.5t-19 45t-45 18.5zM832 128H192q-27 0-45.5-18.5t-18.5-45T146.5 19T192 0h640q26 0 45 19t19 45.5t-19 45t-45 18.5zM128 512q-27 0-45.5-18.5t-18.5-45T82.5 403t45.5-19h768q26 0 45 19t19 45.5t-19 45t-45 18.5H128zm-64 64h896q26 0 45 19t19 45.5t-19 45t-45 18.5H64q-27 0-45.5-18.5T0 640t18.5-45.5T64 576zm256 192h384q26 0 45 19t19 45.5t-19 45t-45 18.5H320q-27 0-45.5-18.5T256 832t18.5-45.5T320 768z'/%3E%3C/svg%3E"
    },
    k: {
        name: "PDFF",
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%23ca0202' x='0' y='0' width='512' height='512'%3E%3Cpath fill='%23ca0202' d='M0 64C0 28.7 28.7 0 64 0h160v128c0 17.7 14.3 32 32 32h128v144H176c-35.3 0-64 28.7-64 64v144H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0l128 128zM176 352h32c30.9 0 56 25.1 56 56s-25.1 56-56 56h-16v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24h-16v48h16zm96-80h32c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48h-32c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16h-16v96h16zm80-112c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v32h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V368z'/%3E%3C/svg%3E"
    },
    l: {
        name: "PDFC",
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 24 24'%3E%3Crect x='0' y='0' width='24' height='24' rx='8' fill='none'/%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c01111' x='0' y='0' width='24' height='24'%3E%3Cpath fill='%23c01111' d='M12 9a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm7-7H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11.59l3.7 3.71A1 1 0 0 0 21 22a.84.84 0 0 0 .38-.08A1 1 0 0 0 22 21V5a3 3 0 0 0-3-3Zm1 16.59l-2.29-2.3A1 1 0 0 0 17 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1ZM8 9a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm8 0a1 1 0 1 0 1 1a1 1 0 0 0-1-1Z'/%3E%3C/svg%3E%3C/svg%3E"
    }
};

const HIGHLIGHTS = {
    4: "yellow",
    5: "green"
};

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
                jm.undo();
            },
            'redo': function (jm, e) {
                // display mind map's next state (redo the next operation)
                jm.redo();
            },
            'toggleTag': function (jm, e) {
                console.log(`Toggled Tag: key ${e.key}`);
                let selectedNode = jm.get_selected_node();
                // if no node's selected -> skip
                if (!selectedNode) {
                    return;
                }

                // apply / remove a tag otherwise
                applyTag(selectedNode, e.key);
            },
            'toggleHighlight': function (jm, e) {
                console.log(`Toggled Highlight: key ${e.key}`);
                let selectedNode = jm.get_selected_node();
                // if no node's selected -> skip
                if (!selectedNode) {
                    return;
                }

                // apply / remove a highlight
                applyHighlight(selectedNode, HIGHLIGHTS[e.key]);
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
                4096 + 74,              // <j> - BIBE
                4096 + 75,              // <k> - PDFF
                4096 + 76               // <l> - PDFC
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
 * @param { string } pressedKey - The related key of the tag's icon.
 */
function applyTag (selectedNode, pressedKey) {
    let tagIcon = TAG_ICONS[pressedKey].name;
    let src = TAG_ICONS[pressedKey].src;

    // getting applied tags
    const appliedIcons = selectedNode.data.icons;
    // and toggling the given one
    if (appliedIcons.includes(tagIcon)) {
        selectedNode.data.icons.splice(appliedIcons.indexOf(tagIcon), 1);
    } else {
        selectedNode.data.icons.push(tagIcon);
    }

    console.log(`${selectedNode.topic}'s icons:\n${selectedNode.data.icons}`);
}

/**
 * Applies or removes a specific highlight color to / from
 * the selected node.
 * @param { object } selectedNode - The node a highlight should be
 * applied to / removed from.
 * @param { string } highlight - The color of the highlight.
 */
function applyHighlight (selectedNode, highlight) {
    selectedNode.data.highlight = selectedNode.data.highlight !== highlight ?
        highlight : null;
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

    let mindMapPath = "libraries/" + selectedOption + "/map";
    let loadResponse = await httpClient.loadMap(mindMapPath);

    // display the retrieved mind map
    jm.show(loadResponse.map);
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

// tags
tagStarBtn.onclick = function () {
    let currentlySelectedNode = jm.get_selected_node();
    if(!currentlySelectedNode) {
        console.log("no node selected, applying nothing");
        return;
    }
    applyTag(currentlySelectedNode, TAG_ICONS["2"]);
}

var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
    console.log(dropdownToggleEl);
    // return new bootstrap.Dropdown(dropdownToggleEl)
})

/*tagsBtn.onclick = function () {
   const nodetypes = {"textnode": "text.svg", "bibentrynode" : 1, "pdfnode" : 2, "pdfcommentnode" : 3};

    const TypeIcons = {
        TEXT: "text.svg",
        PDF: "pdf.svg"
    };
    console.log(jm.get_root());
    jm.get_root().data = {"type" : "textnode", "icons" : [TypeIcons.PDF, TypeIcons.TEXT], "EntryPreviewData" : "blabla"};
    console.log(jm.get_root());

    console.log(jm.get_root().data.EntryPreviewData);

    console.log(nodetypes["textnode"], TypeIcons.TEXT);
}*/

// disable default <Ctrl> + <number_key> browser's shortcut
// in case a tag should be toggled
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && jm.get_selected_node()) {
        e.preventDefault();
    }
});