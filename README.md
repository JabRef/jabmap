# JabMap

Next-Generation scientific mind mapping.

Inspired by [Docear](https://docear.org/)

## 📸 Screenshots

<img width="1429" alt="JabMap-Example" src="https://github.com/user-attachments/assets/4a175c10-a0eb-438f-b5f6-1dcfb4e2520c" />

## ⌨️ Shortcuts

You can find a list of shortcuts at [shortcuts.md](shortcuts.md).

## 🌟 Try It Out!

There are a couple of ways to try out JabMap. In any case, you first have to start JabRef's HTTP-Server on your machine since saving, loading, and JabRef-related features such BibTeX-Nodes and importing attached PDF-files as nodes won't work unless you are running JabRef's HTTP-Server.
Afterwards check out [github pages](https://jabref.github.io/jabmap/) where you can try JabMap in your browser!

### Quick-Start-Guide

1. Ensure that you have downloaded the latest development version of JabRef from <https://builds.jabref.org/main/>.
2. Launch JabRef.
3. File > Preferences > Check "HTTP Server"
4. If you don't have any BibTeX files at hand:
   1. Click on "Create example library"
   2. Save (Button in the top left or <kbd>Ctrl/Cmd</kbd> + <kbd>S</kbd>)
5. Visit <https://jabref.github.io/jabmap/>

Hint: At click on "Save", a `.jmp` file is created next to your `.bib` file.

## Running locally

The following commands get the code in place and start JabRef and JabMap with the help of a handy wrapper tool called [gg.cmd](https://github.com/eirikb/gg).
A little terminal magic is required, but don't worry, we have the commands all laid out for you!

#### JabRef

1. Go to your git-repositories folder and start a new terminal session
2. `git clone --recurse-submodules https://github.com/JabRef/jabref.git`
3. `cd jabref`
4. Enable nice wrapper: `curl -L ggcmd.io > gg.cmd`
5. `sh ./gg.cmd just run-gui`
6. Wait for JabRef to come up
7. Click on "Create example library"
8. Save (Button in the top left or <kbd>Ctrl/Cmd</kbd> + <kbd>S</kbd>)
9. File > Preferences > Check "HTTP Server"

#### JabMap

After setting up JabRef, follow these steps to run it locally.

After setting up JabRef, you can either use [JabMap on GitHub pages](https://jabref.github.io/jabmap/) or follow these steps to run it locally.

1. Go to your git-repositories folder and start a new terminal session
2. Clone it: `git clone git@github.com:JabRef/jabmap.git`
3. `cd jabmap`
4. Fix branch: `git checkout jabmap`
5. Enable nice wrapper: `curl -L ggcmd.io > gg.cmd`
6. Install dependencies: `sh gg.cmd npm install`
7. Build: `sh ./gg.cmd npm run build`
8. Run: `sh ./gg.cmd npm run preview`
9. Now you can open <http://localhost:4173/> and open a library with the corresponding map.
10. Select the root node by clicking on it
11. Press <kbd>CTRL</kbd> + <kbd>B</kbd>
12. Select any number of BibTeX entries from the library
13. Press "Cite"

**You just successfully created your first BibTeX nodes!**

## 🤖 Getting the server running

Instead of having the JabRef GUI running, you can just run JabRef's HTTP server. There are multiple ways to do that:

### using `gg.cmd`

If you followed the setup for JabRef [above](#jabref), instead of steps 5 and 6 you can simply do the following to start the server without JabRef's GUI:

```bash
sh ./gg.cmd jbang .jbang/JabSrvLauncher.java
```

> Note: this is **not** recommended for trying out JabMap for the first time since it will not allow you to create a new library. Use this only if you already used JabRef before :)

### Starting it from an IDE

1. If you haven't already, clone our JabRef and follow [JabRef's setup guide](https://devdocs.jabref.org/getting-into-the-code/guidelines-for-setting-up-a-local-workspace/).
2. Afterwards, open it in editor of your choice (_IDEA works well for this_) and locate the `jabsrv/src/test/rest-api.http` file.
3. Follow the steps described at the top of the file to start the server.

_Alternatively_ you can do the following:
1. Open `ServerCLI` file located at `./jabsrv-cli/src/main/java/org.jabref.http.server.cli`
2. Execute its `main()` method

More about starting the server in [JabRef's server documentation](https://devdocs.jabref.org/code-howtos/http-server.html)

## 💾 Install by building the application 

Now that you've tried it, here is how to build and install it. We hope to provide a downloadable installer in the future, but for now you have to build the app yourself. 
This section is more targeted towards 
Currently, there is no production build available for download so you have to build it yourself :3

### Basic Setup

Firstly ensure you have `nvm` (_Node version manager_) and `Node.js` installed:

1. Open terminal (_you may have to run it with administrator permissions_)
2. Install `nvm` or update your version by running one of following install scripts in your terminal (more information about these in [nvm documentation](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)):
   - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`
  
     or

   - `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`
3. Install `npm` and `node.js` by running `nvm install v24.0.1` (or newer)
4. At the end, ensure installation was successful by running `npm -v` and `node -v` (_you may need to reboot your system before this step_)

After you ensured the basic setup is complete, clone this repository onto your machine and open a terminal session at the project root.

### Building

Now you should be able to run the following commands:

1. `npm install`  - this will install / update all necessary packages in a `./node_modules` directory.
2. `npm run bundle` - this will bundle the project into the `./electron-dist` directory.

If bundling fails with `ERROR: Cannot create symbolic link`, you have to do the following:

3. Download the `winCodeSign` package using [this link](https://github.com/electron-userland/electron-builder-binaries/releases/download/winCodeSign-2.6.0/winCodeSign-2.6.0.7z).
4. Extract downloaded archive into `C:\Users\<YourUserName>\AppData\Local\electron-builder\Cache\winCodeSign\winCodeSign-2.6.0\`
5. Retry running the `npm run bundle` command

_More about this workaround in [this issue](https://github.com/electron-userland/electron-builder/issues/8149)_.

On Linux and Mac, there is a bug with npm and optional dependencies (See [this issue](https://github.com/npm/cli/issues/4828). Should you encounter this bug after running `npm install`, remove the `package-lock.json` file and `node-modules` directory and run `npm i`. Then, simply continue with step 2.

### Starting

After a successful build you can finally start the app located at `./electron-dist/win-unpacked/JabMap.exe`.

_Optionally you can install it by opening_ `./electron-dist/JabMap Setup 1.0.0.exe`
