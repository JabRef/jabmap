/**
 * This class serves for nodes' consistent structure
 * by ensuring their common properties are defined.
 */
export class NodeExtender {
    /**
     * Adds "icons", "highlight" and "type" properties to a node object
     * and all its children (this doesn't overwrite existing ones).
     * @param { object } node - The node object to extend.
     */
    static extendNode(node) {
        if (!node) {
            return;
        }

        node.icons = node.icons ?? [];
        node.highlight = node.highlight ?? null;

        NodeExtender.setNodeType(node);

        if (!!node.children) {
            node.children.map((child) => { NodeExtender.extendNode(child); });
        }
    }

    /**
     * Assigns a specific type depending on node's properties.
     * @param { object } node - The node to set the type of.
     */
    static setNodeType(node) {
        node.type = 'Text';
        if (!!node.citeKey) {
            node.type = 'BibEntry';
            return;
        }
        if (!!node.parentCitationKey) {
            node.type = 'PDFFile';
            return;
        }
    }
}