# JabMap

Next-generation scientific mind mapping, inspired by [Docear](https://docear.org/).

JabMap lets you build mind maps whose nodes are BibTeX entries and PDF attachments from your [JabRef](https://www.jabref.org/) library.
Maps are stored as `.jmp` files next to your `.bib` file.

## 📸 Screenshots

<img width="1429" alt="JabMap-Example" src="https://github.com/user-attachments/assets/4a175c10-a0eb-438f-b5f6-1dcfb4e2520c" />

## 🌟 Try It Out!

JabMap runs in your browser at <https://jabref.github.io/jabmap/>.
Saving, loading, BibTeX nodes and PDF import need JabRef's HTTP server running on your machine, so start JabRef first:

1. Download the latest development version of JabRef from <https://builds.jabref.org/main/>.
2. Launch JabRef.
3. File > Preferences > check "HTTP Server".
4. If you don't have any BibTeX files at hand:
   1. Click on "Create example library".
   2. Save (button in the top left or <kbd>Ctrl/Cmd</kbd> + <kbd>S</kbd>).
5. Visit <https://jabref.github.io/jabmap/>.

Your first BibTeX nodes:

1. Select the root node by clicking on it.
2. Press <kbd>Ctrl</kbd> + <kbd>B</kbd>.
3. Select any number of BibTeX entries from the library.
4. Press "Cite".

Hint: on "Save", a `.jmp` file is created next to your `.bib` file.

## ⌨️ Shortcuts

You can find a list of shortcuts at [shortcuts.md](shortcuts.md).

## 💾 Desktop app

JabMap can also run as a desktop application.
There is no downloadable installer yet; see [CONTRIBUTING.md](CONTRIBUTING.md#building-the-desktop-app) for how to build it yourself.

## 🛠️ Contributing

Bug reports and feature requests go to the [issue tracker](https://github.com/JabRef/jabmap/issues).
To run JabMap from source or submit a pull request, read [CONTRIBUTING.md](CONTRIBUTING.md).

## Alternatives

- [Docear Online viewer](https://isg.beel.org/blog/2013/03/21/preview-of-the-docear-online-viewer/)
- [Docear Desktop](https://docear.org/)
