# JabMap
Next-Generation scientific mind mapping.

## 📸 Screenshots
 <img width="1548" alt="JabMap mainview example" src="https://github.com/user-attachments/assets/69f5de97-3b2d-4ed7-b8f8-050a1559f93b" />
 <img width="1549" alt="JabMap opening a mindmap example" src="https://github.com/user-attachments/assets/23aa56d0-4432-4e5f-957b-8797d36a22fd" />

## 🌟 Try It Out!
The current state of the application is hosted on [github pages](https://jabref.github.io/jabmap/) for you to try out. Note that saving and loading mind maps does not work when running the app like this. This is because both require communication with the [JabRef's HTTP server](#getting-the-server) which will be restricted by your browser for security reasons. 

## 💾 Installation
### Building the app
Currently, there is no production build available for download so you have to build it yourself.
To do this, you need to have `npm` and `node.js` installed. Installing them with [nvm](https://github.com/nvm-sh/nvm) is the recommended way.

Installation Guide for Windows and Linux / OS X is available [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Then, clone this repository onto your machine and open a terminal session at the project root.

Then, run the following commands:
1. ```npm install```  - this will install all necessary packages in a `./node_modules` directory. You may run this command to update existing packages.
2. ```npm run build``` - this will bundle the app and dependencies into a `./dist` directory.
3. ```npm run preview``` - this will run the preview of the build-output in your browser (_click on the link in the terminal_).

Alternatively, you can simply open the `index.html` file (_using IDEA_) in the `./dist` directory after building and choose a browser (_in the top right corner_) to run the application.

### Getting the server
As mentioned above, saving and loading of mind maps are handled by JabRef's HTTP server. Currently you have to start it manually:

First clone our [JabRef's fork repository](https://github.com/iloveskittles82/jabref) (_Note: It is recommended to complete this step of_ [_JabRef's setup guide_](https://devdocs.jabref.org/getting-into-the-code/guidelines-for-setting-up-a-local-workspace/intellij-12-build.html)).

After you cloned the repository, open it in editor of your choice (_IDEA works well for this_) and locate the `jabsrv/src/test/rest-api.http` file.

Follow the steps described at the top of the file to start the server.

_Alternatively_ you can start it with the `main()` method of `org.jabref.http.server.cli.ServerCli` package located at `./jabsrv-cli.src.main.java`.

More about starting the server in [JabRef's server documentation](https://devdocs.jabref.org/code-howtos/http-server.html)