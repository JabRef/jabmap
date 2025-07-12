const DefaultOptions = {
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
        mapping: { 			            // Shortcut key mapping
            addchild: [45, 4096 + 13],  // <Insert>, <Ctrl> + <Enter>
            addbrother: 13,             // <Enter>
            editnode: 113, 	            // <F2>
            delnode: [46, 8], 	        // <Delete>
            toggle: 32, 	            // <Space>
            left: 37, 		            // <Left>
            up: 38, 		            // <Up>
            right: 39, 		            // <Right>
            down: 40, 		            // <Down>
            undo: 4096 + 90,            // <Ctrl> + <Z>
            redo: 4096 + 1024 + 90,     // <Ctrl> + <Shift> + <Z>
            save: 4096 + 83,            // <Ctrl> + <S>
            load: 4096 + 79,            // <Ctrl> + <O>
            addBibChild: 4096 + 66,     // <Ctrl> + <B>
            addPDFChild: 4096 + 80,     // <Ctrl> + <O>
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

// Copying the default options and slightly modifying them :)
const NoEditOptions = JSON.parse(JSON.stringify(DefaultOptions));
NoEditOptions.editable = false;
NoEditOptions.shortcut.enable = false;

export { DefaultOptions, NoEditOptions };