import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import jsMind from './jsmind/src/jsmind.js';
import './jsmind/src/plugins/jsmind.draggable-node.js';
import "./ActionStack.js";
import {
    ActionStack
} from "./ActionStack";

// "load" mindmap data
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

// specify creation options
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
            line_width:6, 		// thickness of the mindmap line
            line_color:'#555', 	// Thought mindmap line color
            line_style:'straight', // line style, straight or curved
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
            handles:{}, 			// Named shortcut key event processor
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
            }
        },
    };

// create and render mindmap
const jm = new jsMind(options);
jm.show(mind);
// add initial state to action stack
jm.actionStack.add(mind);

//--- Button click handlers ---

// saving
saveBtn.onclick = function(){
    // saving jabmaps magic here..
}

// open
openBtn.onclick = function(){
    // opening jabmaps magic here..
}

// undo
undoBtn.onclick = function(){
    // undo operation and display result (mindmap in previous state)
    let undoRes = jm.actionStack.undo()
    if(!!undoRes){
        jm.show(undoRes);
    }
}

// redo
redoBtn.onclick = function(){
    // redo operation and display result (mindmap in previous state)
    let redoRes = jm.actionStack.redo()
    if(!!redoRes){
        jm.show(redoRes);
    }
}

// new sibling node
newSiblingBtn.onclick = function(){
    if(!!jm){
        jm.shortcut.handle_addbrother(jm, null); //call the shortcut-handler for adding a sibling node
    }
}

// new child node
newChildBtn.onclick = function(){
    if(!!jm){
        jm.shortcut.handle_addchild(jm, null); //call the shortcut-handler for adding a child node
    }
}

// tags
tagsBtn.onclick = function(){
    // tags magic here..
}