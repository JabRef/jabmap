/**
 * Three-way merge of jsMind `node_tree` maps, keyed by node id.
 *
 * `base` is the map as it was loaded from the server, `local` the current
 * editor state and `server` what the server holds now. Changes made on only
 * one side are taken over. When both sides changed the same node, the local
 * node stays and the server's version is inserted next to it as a copy tagged
 * with a warning icon, so neither edit is lost (https://github.com/JabRef/jabmap/issues/44).
 */

// view state and sibling order are not worth a conflict
const IGNORED_FIELDS = ['children', 'expanded', 'direction'];

export const CONFLICT_ICON = 'warning';

/**
 * @param { object } base - The map as loaded from the server.
 * @param { object } local - The map currently shown.
 * @param { object } server - The map the server holds now.
 * @returns `{ map, notes }` - the merged map and human-readable notes about
 * everything that did not merge silently.
 */
export function mergeMaps(base, local, server) {
    const b = flatten(base.data);
    const l = flatten(local.data);
    const s = flatten(server.data);
    const notes = [];

    // id -> { node, parentId }
    const merged = new Map();
    const extras = []; // conflict copies, inserted after their local twin

    for (const id of new Set([...b.keys(), ...l.keys(), ...s.keys()])) {
        const inB = b.get(id), inL = l.get(id), inS = s.get(id);

        if (!inB) {
            // added on one side, or on both with the same id (keep local)
            merged.set(id, inL ?? inS);
            continue;
        }
        if (!inL && !inS) {
            continue;
        }
        if (!inL) {
            if (!sameNode(inB, inS)) {
                merged.set(id, inS);
                notes.push(`Kept "${inS.node.topic}", edited on the server but deleted here.`);
            }
            continue;
        }
        if (!inS) {
            if (!sameNode(inB, inL)) {
                merged.set(id, inL);
                notes.push(`Kept "${inL.node.topic}", edited here but deleted on the server.`);
            }
            continue;
        }

        const localChanged = !sameContent(inB.node, inL.node);
        const serverChanged = !sameContent(inB.node, inS.node);
        let node = inL.node;
        if (serverChanged && !localChanged) {
            node = inS.node;
        } else if (serverChanged && localChanged && !sameContent(inL.node, inS.node)) {
            const copy = { ...inS.node, id: newId() };
            copy.icons = [...new Set([...(copy.icons ?? []), CONFLICT_ICON])];
            extras.push({ afterId: id, entry: { node: copy, parentId: inL.parentId } });
            notes.push(`"${inL.node.topic}" was edited on both sides; the server's version was added next to it.`);
        }

        // a move on exactly one side wins, a move on both sides keeps the local one
        const parentId = inL.parentId === inB.parentId ? inS.parentId : inL.parentId;
        if (parentId !== inB.parentId && inL.parentId !== inB.parentId && inL.parentId !== inS.parentId) {
            notes.push(`"${node.topic}" was moved on both sides; kept the local position.`);
        }
        merged.set(id, { node, parentId });
    }

    // sibling order: local order first, server-only nodes appended in server order
    const order = new Map();
    for (const [id, entry] of merged) {
        const siblings = order.get(entry.parentId) ?? [];
        siblings.push(id);
        order.set(entry.parentId, siblings);
    }
    const rank = (id) => (l.has(id) ? l.get(id).index : s.get(id).index + l.size);
    for (const siblings of order.values()) {
        siblings.sort((x, y) => rank(x) - rank(y));
    }
    for (const { afterId, entry } of extras) {
        merged.set(entry.node.id, entry);
        const siblings = order.get(entry.parentId);
        siblings.splice(siblings.indexOf(afterId) + 1, 0, entry.node.id);
    }

    // rebuild from the root; whatever is unreachable (parent deleted on the
    // other side, or a cycle from crossed moves) is attached to the root
    const rootId = local.data.id;
    const built = new Set();
    const build = (id) => {
        built.add(id);
        const { children, ...node } = merged.get(id).node;
        const childIds = (order.get(id) ?? []).filter((c) => !built.has(c));
        if (childIds.length > 0) {
            node.children = childIds.map(build);
        }
        return node;
    };
    const root = build(rootId);
    for (const id of merged.keys()) {
        if (!built.has(id)) {
            root.children = root.children ?? [];
            root.children.push(build(id));
            notes.push(`"${merged.get(id).node.topic}" lost its parent; attached to the root.`);
        }
    }

    return { map: { ...local, data: root }, notes };
}

/**
 * @returns Map of id -> `{ node, parentId, index }` for every node of the tree.
 */
function flatten(root) {
    const flat = new Map();
    const visit = (node, parentId, index) => {
        flat.set(node.id, { node, parentId, index });
        (node.children ?? []).forEach((child, i) => visit(child, node.id, i));
    };
    visit(root, null, 0);
    return flat;
}

function sameNode(a, b) {
    return a.parentId === b.parentId && sameContent(a.node, b.node);
}

function sameContent(a, b) {
    return canonical(a) === canonical(b);
}

// key order differs between a freshly loaded file and jsMind's get_data()
function canonical(node) {
    return JSON.stringify(node, (key, value) => {
        if (IGNORED_FIELDS.includes(key)) {
            return undefined;
        }
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return Object.fromEntries(Object.entries(value).sort());
        }
        return value;
    });
}

// same shape as jsMind's util.uuid.newid(), without pulling in its DOM imports
function newId() {
    return crypto.randomUUID().replaceAll('-', '').substring(0, 16);
}
