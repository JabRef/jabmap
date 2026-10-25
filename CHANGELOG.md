# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Calendar Versioning](https://calver.org/) in the format `YYYY.0M.0D`.
We refer to [GitHub issues](https://github.com/JabRef/jabmap/issues) by using `#NUM`.
In case there is no issue present, the pull request implementing the feature is linked.

## [Unreleased]

### Added

- We added keyboard shortcuts for moving nodes: <kbd>Ctrl</kbd> + arrow keys reorder, nest, lift or switch sides of the selected node. [#50](https://github.com/JabRef/jabmap/issues/50)
- We added this changelog. It is checked by [heylogs](https://github.com/nbbrd/heylogs) in CI. [#103](https://github.com/JabRef/jabmap/pull/103)

### Changed

- We changed the "New PDF node" dialog to list only the PDFs linked to the selected BibTeX node; the PDF button is disabled for other nodes. [#56](https://github.com/JabRef/jabmap/issues/56)

### Fixed

- We fixed keyboard shortcuts (e.g. <kbd>Ctrl</kbd> + <kbd>1</kbd>) not working after a toolbar button was clicked or a dropdown menu was open. [#25](https://github.com/JabRef/jabmap/issues/25)
- We fixed the published JabMap at GitHub Pages briefly showing builds of unmerged pull requests. [#115](https://github.com/JabRef/jabmap/pull/115)

## [2025.10.11] - 2025-10-11

### Added

- First release of JabMap: a mind map editor with BibTeX and PDF nodes, saved to and loaded from JabRef through its HTTP server.

[Unreleased]: https://github.com/JabRef/jabmap/compare/v2025.10.11...HEAD
[2025.10.11]: https://github.com/JabRef/jabmap/releases/tag/v2025.10.11
