# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Calendar Versioning](https://calver.org/) in the format `YYYY.0M.0D`.
We refer to [GitHub issues](https://github.com/JabRef/jabmap/issues) by using `#NUM`.
In case there is no issue present, the pull request implementing the feature is linked.

## [Unreleased]

### Added

- We added keyboard shortcuts for moving nodes: <kbd>Ctrl</kbd> + arrow keys reorder, nest, lift or switch sides of the selected node. [#50](https://github.com/JabRef/jabmap/issues/50)
- We added "Show in JabRef" (<kbd>Ctrl</kbd> + <kbd>J</kbd>) to select a BibTeX node's entry in JabRef. [#46](https://github.com/JabRef/jabmap/issues/46)
- We added merging on save: changes someone else saved to the same map in the meantime are merged in instead of overwritten. Nodes edited on both sides are kept twice, the server's version tagged with a warning icon. [#44](https://github.com/JabRef/jabmap/issues/44)
- We added this changelog. It is checked by [heylogs](https://github.com/nbbrd/heylogs) in CI. [#103](https://github.com/JabRef/jabmap/pull/103)
- We added the name of the library the opened mind map belongs to in the top right corner of the toolbar. [#42](https://github.com/JabRef/jabmap/issues/42)
- We added autosave: after a mind map was opened, every change, undo and redo is saved to JabRef immediately. The "Autosave" toggle in the toolbar switches it off. A failed save turns the "Save" button red. [#36](https://github.com/JabRef/jabmap/issues/36)
- We added a toast confirming a successful save when autosave is off. [#38](https://github.com/JabRef/jabmap/issues/38)

### Changed

- We changed the "New PDF node" dialog to list only the PDFs linked to the selected BibTeX node; the PDF button is disabled for other nodes. [#56](https://github.com/JabRef/jabmap/issues/56)

### Fixed

- We fixed an error being logged when the "Add BibTeX entry" dialog is closed without selecting an entry, e.g. with an empty library. [#41](https://github.com/JabRef/jabmap/issues/41)
- We fixed keyboard shortcuts (e.g. <kbd>Ctrl</kbd> + <kbd>1</kbd>) not working after a toolbar button was clicked or a dropdown menu was open. [#25](https://github.com/JabRef/jabmap/issues/25)
- We fixed the published JabMap at GitHub Pages briefly showing builds of unmerged pull requests. [#115](https://github.com/JabRef/jabmap/pull/115)
- We fixed toolbar buttons overlapping each other and their labels wrapping in narrow windows; the editor buttons now move to a second row when there is no room. [#31](https://github.com/JabRef/jabmap/issues/31)

## [2025.10.11] - 2025-10-11

### Added

- First release of JabMap: a mind map editor with BibTeX and PDF nodes, saved to and loaded from JabRef through its HTTP server.

[Unreleased]: https://github.com/JabRef/jabmap/compare/v2025.10.11...HEAD
[2025.10.11]: https://github.com/JabRef/jabmap/releases/tag/v2025.10.11
