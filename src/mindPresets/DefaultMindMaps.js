let DefaultMap = {
    meta: {
        name: "JabMap",
        author: "JabMap",
        version: "1.0"
    },
    format: "node_tree",
    data: {
        id: "root",
        topic: "Welcome to JabMap!",
        expanded: true,
        icons: [],
        highlight: null,
        type: "Text"
    }
};

let FelixMap = {
    meta: {
        name: "JabMap",
        author: "JabMap",
        version: "1.0"
    },
    format: "node_tree",
    data: {
        id: "root",
        topic: "JabMap",
        expanded: true,
        icons: [],
        highlight: null,
        type: "Text",
        children: [
            {
                id: "7eb3d8255e647a7e",
                topic: "Open Source",
                expanded: true,
                direction: "left",
                icons: ["checked"]
            },
            {
                id: "7eb3da68fdf12ff5",
                topic: "Scientific mind mapping",
                expanded: true,
                direction: "right",
                icons: ["light_bulb"]
            }
        ]
    }
};

export { DefaultMap, FelixMap };