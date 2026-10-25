# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Calendar Versioning](https://calver.org/) in the format `YYYY.0M.0D`.
We refer to [GitHub issues](https://github.com/JabRef/jabmap/issues) by using `#NUM`.
In case there is no issue present, the pull request implementing the feature is linked.

## [Unreleased]

### Added

- We added keyboard shortcuts for moving nodes: <kbd>Ctrl</kbd> + arrow keys reorder, nest, lift or switch sides of the selected node. [#50](https://github.com/JabRef/jabmap/issues/50)
- We added merging on save: changes someone else saved to the same map in the meantime are merged in instead of overwritten. Nodes edited on both sides are kept twice, the server's version tagged with a warning icon. [#44](https://github.com/JabRef/jabmap/issues/44)
- We added this changelog. It is checked by [heylogs](https://github.com/nbbrd/heylogs) in CI. [#103](https://github.com/JabRef/jabmap/pull/103)

### Changed

- We changed the "New PDF node" dialog to list only the PDFs linked to the selected BibTeX node; the PDF button is disabled for other nodes. [#56](https://github.com/JabRef/jabmap/issues/56)

[Unreleased]: https://github.com/JabRef/jabmap/compare/main...HEAD
