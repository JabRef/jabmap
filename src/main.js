import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
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
        container : 'jsmind_container', 			// [required] ID of the container
        editable : true, 		// Is editing enabled?
        theme : null, 			// theme
        mode :'full', 			// display mode
        support_html : true, 	// Does it support HTML elements in the node?
        view:{
            engine: 'canvas', 	// engine for drawing lines between nodes in the mindmap
            hmargin:100, 		// Minimum horizontal distance of the mindmap from the outer frame of the container
            vmargin:50, 			// Minimum vertical distance of the mindmap from the outer frame of the container
            line_width:3, 		// thickness of the mindmap line
            line_color:'#555', 	// Thought mindmap line color
            line_style:'curved', // line style, straight or curved
            custom_line_render: null,  // customized line render function
            draggable: true,    // Drag the mind map with your mouse, when it's larger that the container
            hide_scrollbars_when_draggable: false, // Hide container scrollbars, when mind map is larger than container and draggable option is true.
            node_overflow: 'hidden' // Text overflow style in node
        },
        layout:{
            hspace:30, 			// Horizontal spacing between nodes
            vspace:20, 			// Vertical spacing between nodes
            pspace:13,			// Horizontal spacing between node and connection line (to place node expander)
            cousin_space:0			// Additional vertical spacing between child nodes of neighbor nodes
        },
        shortcut:{
            enable:true, 		// whether to enable shortcut
            handles:{
                'undo': function(jm, e) {
                    // undo operation and display result (mindmap in previous state)
                    jm.undo();                },
                'redo': function(jm, e) {
                    // redo operation and display result (mindmap in previous state)
                    jm.redo();
                }
            }, 			// Named shortcut key event processor
            mapping:{ 			// shortcut key mapping
                addchild : [45, 4096+13], 	// <Insert>, <Ctrl> + <Enter>
                addbrother : 13, // <Enter>
                editnode : 113, 	// <F2>
                delnode : 46, 	// <Delete>
                toggle : 32, 	// <Space>
                left : 37, 		// <Left>
                up : 38, 		// <Up>
                right : 39, 		// <Right>
                down : 40, 		// <Down>
                undo : 4096 + 90,
                redo : 4096 + 1024 + 90
            }
        },
    };

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

// open - opens a dialog to select available mindmaps
openBtn.onclick = async function(){
    // request list of available mindmaps from JabRef's http server
    let response = await httpClient.listMaps();

    let select = document.getElementById('openMindmapSelect');
    // reset select options
    select.innerHTML = '';

    // populate select element with options
    for (let i = 0; i < response.length; i++) {
        select.innerHTML += '<option value="' + response[i] + '">' + response[i] + '</option>';
    }
}

// Modal dialog confirmation button
openSelectedMapBtn.onclick = async function(){
    // get selected mindmap name
    let select = document.getElementById('openMindmapSelect');
    let selectedMindmap = select.options[select.selectedIndex].value;

    // get mindmap data from server
    let responseMindmap = await httpClient.loadMap("libraries/" + selectedMindmap + "/map");

    // display mindmap
    jm.show(responseMindmap.map);
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
tagsBtn.onclick = function () {
    // tags magic here..
}