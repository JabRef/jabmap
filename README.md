# JabMap
Next-Generation scientific mind mapping.

## 📸 Screenshots
 <img width="1548" alt="JabMap mainview example" src="https://github.com/user-attachments/assets/69f5de97-3b2d-4ed7-b8f8-050a1559f93b" />
 <img width="1549" alt="JabMap opening a mindmap example" src="https://github.com/user-attachments/assets/23aa56d0-4432-4e5f-957b-8797d36a22fd" />

## 🌟 Try It Out!
The current state of the application is hosted on [github pages](https://jabref.github.io/jabmap/) for you to try out. Note that saving and loading mind maps does not work when running the app like this because the communication with the [JabRef's HTTP server](#getting-the-server) is restricted by your browser for security reasons. Unfortunately this applies to any interaction with the server.

## 💾 Installation
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

On Linux, there is a bug with npm and optional dependencies (See [this issue](https://github.com/npm/cli/issues/4828). Should you encounter this bug after running `npm install`, remove the `package-lock.json` file and `node-modules` directory and run `npm i`. Then, simply continue with step 2.

### Starting
After a successful build you can finally start the app located at `./electron-dist/win-unpacked/JabMap.exe`.

_Optionally you can install it by opening_ `./electron-dist/JabMap Setup 1.0.0.exe`

## 🤖 Getting the server running
As mentioned above, several features are handled by JabRef's HTTP server. Currently you have to start it manually:

First clone our [JabRef's fork repository](https://github.com/iloveskittles82/jabref) (_Note: It is recommended to complete this step of_ [_JabRef's setup guide_](https://devdocs.jabref.org/getting-into-the-code/guidelines-for-setting-up-a-local-workspace/intellij-12-build.html)).

After you cloned the repository, open it in editor of your choice (_IDEA works well for this_) and locate the `jabsrv/src/test/rest-api.http` file.

Follow the steps described at the top of the file to start the server.

_Alternatively_ you can do the following:
1. Open `ServerCLI` file located at `./jabsrv-cli/src/main/java/org.jabref.http.server.cli`
2. Execute its `main()` method

More about starting the server in [JabRef's server documentation](https://devdocs.jabref.org/code-howtos/http-server.html)
