// Run with `npm test` (node:test, no further tooling).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeMaps, CONFLICT_ICON } from './MapMerger.js';

const node = (id, topic, children) => ({ id, topic, expanded: true, icons: [], highlight: null, type: 'Text', ...(children && { children }) });
const map = (...children) => ({ meta: {}, format: 'node_tree', data: node('root', 'JabMap', children) });
const ids = (n) => [n.id, ...(n.children ?? []).flatMap(ids)];
const find = (n, id) => ids(n).includes(id) ? (n.id === id ? n : n.children.map((c) => find(c, id)).find(Boolean)) : undefined;

test('one-sided changes merge silently, both sides kept', () => {
    const base = map(node('a', 'A'), node('b', 'B'), node('c', 'C'));
    const local = map(node('a', 'A edited'), node('c', 'C'), node('d', 'D new'));           // edit a, delete b, add d
    const server = map(node('a', 'A'), node('b', 'B'), node('c', 'C', [node('e', 'E new')])); // add e under c

    const { map: merged, notes } = mergeMaps(base, local, server);

    assert.deepEqual(notes, []);
    assert.deepEqual(ids(merged.data), ['root', 'a', 'c', 'e', 'd']);
    assert.equal(find(merged.data, 'a').topic, 'A edited');
});

test('server-only changes win over an unchanged local copy', () => {
    const base = map(node('a', 'A'));
    const { map: merged } = mergeMaps(base, map(node('a', 'A')), map(node('a', 'A from server')));
    assert.equal(find(merged.data, 'a').topic, 'A from server');
});

test('conflicting edits keep both versions', () => {
    const base = map(node('a', 'A'));
    const { map: merged, notes } = mergeMaps(base, map(node('a', 'A mine')), map(node('a', 'A theirs')));

    const [mine, theirs] = merged.data.children;
    assert.equal(mine.topic, 'A mine');
    assert.equal(theirs.topic, 'A theirs');
    assert.notEqual(theirs.id, 'a');
    assert.deepEqual(theirs.icons, [CONFLICT_ICON]);
    assert.equal(notes.length, 1);
});

test('an edit survives a deletion on the other side', () => {
    const base = map(node('a', 'A'), node('b', 'B'));
    const { map: merged, notes } = mergeMaps(base, map(node('b', 'B')), map(node('a', 'A edited'), node('b', 'B')));
    assert.equal(find(merged.data, 'a').topic, 'A edited');
    assert.equal(notes.length, 1);
});

test('a one-sided move is applied, an orphan goes to the root', () => {
    const base = map(node('a', 'A'), node('b', 'B', [node('c', 'C')]));
    const local = map(node('a', 'A'), node('b', 'B', [node('c', 'C edited')]));
    const server = map(node('a', 'A', [node('c', 'C')]));                    // move c under a, delete b

    const { map: merged } = mergeMaps(base, local, server);
    assert.deepEqual(ids(merged.data), ['root', 'a', 'c']);
    assert.equal(find(merged.data, 'c').topic, 'C edited');

    // parent deleted on the server, child edited locally: child must not vanish
    const server2 = map(node('a', 'A'));
    const { map: merged2, notes } = mergeMaps(base, local, server2);
    assert.ok(find(merged2.data, 'c'));
    assert.ok(notes.some((n) => n.includes('attached to the root')));
});

test('key order does not count as a change', () => {
    const base = map({ id: 'a', topic: 'A', icons: [], highlight: null, type: 'Text', expanded: true });
    const local = map({ expanded: false, type: 'Text', highlight: null, icons: [], topic: 'A', id: 'a' });
    const { map: merged, notes } = mergeMaps(base, local, map(node('a', 'A theirs')));
    assert.equal(find(merged.data, 'a').topic, 'A theirs');
    assert.deepEqual(notes, []);
});

test('a conflict copy follows its twin to the server-side parent', () => {
    const base = map(node('a', 'A'), node('b', 'B', [node('c', 'C')]));
    const local = map(node('a', 'A'), node('b', 'B', [node('c', 'C mine')]));
    const server = map(node('a', 'A', [node('c', 'C theirs')]), node('b', 'B')); // edit and move c

    const { map: merged, notes } = mergeMaps(base, local, server);
    const [mine, theirs] = find(merged.data, 'a').children;
    assert.equal(mine.topic, 'C mine');
    assert.equal(theirs.topic, 'C theirs');
    assert.equal(find(merged.data, 'b').children, undefined);
    assert.equal(notes.length, 1);
});

test('a side switch on one side survives an edit on the other', () => {
    const base = map({ ...node('a', 'A'), direction: 'right' });
    const local = map({ ...node('a', 'A mine'), direction: 'right' });
    const server = map({ ...node('a', 'A'), direction: 'left' });

    const { map: merged, notes } = mergeMaps(base, local, server);
    assert.equal(find(merged.data, 'a').topic, 'A mine');
    assert.equal(find(merged.data, 'a').direction, 'left');
    assert.deepEqual(notes, []);
});

test('a server-side reorder survives a local edit', () => {
    const base = map(node('a', 'A'), node('b', 'B'), node('c', 'C'));
    const local = map(node('a', 'A mine'), node('b', 'B'), node('c', 'C'));
    const server = map(node('c', 'C'), node('a', 'A'), node('b', 'B'));

    const { map: merged } = mergeMaps(base, local, server);
    assert.deepEqual(ids(merged.data), ['root', 'c', 'a', 'b']);

    // both reordered: local order wins
    const local2 = map(node('b', 'B'), node('a', 'A'), node('c', 'C'));
    assert.deepEqual(ids(mergeMaps(base, local2, server).map.data), ['root', 'b', 'a', 'c']);
});
