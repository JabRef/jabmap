# JabMap
next-generation scientific mind mapping.

## 📸 screenshots
 <img width="1548" alt="JabMap mainview example" src="https://github.com/user-attachments/assets/69f5de97-3b2d-4ed7-b8f8-050a1559f93b" />
 <img width="1549" alt="JabMap opening a mindmap example" src="https://github.com/user-attachments/assets/23aa56d0-4432-4e5f-957b-8797d36a22fd" />

## try it out!
The current state of the application is hosted on [github pages](https://jabref.github.io/jabmap/) for you to try out. Note that saving and loading does not work when running the app like this. This is because both require communcation with JabRef's HTTP server which will get blocked for security reasons by your browser. 

## 💾 installation
Currently, there is no production build available for download so you have to build it yourself.
To do this, you need to have npm and node.js installed. Installing them with [nvm](https://github.com/nvm-sh/nvm) is the recommended way. 

Installation guide: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

Then, clone this repo onto your machine and open a terminal session at the project root.

Run the following commands:
1. ```npm install``` this will install all necessary packages in a 'node_modules' directory. You may run this command to update existing packages.
2. ```npm run build``` to build the app. This will bundle the app and dependencies into a 'dist' directory.
3. ```npm run preview``` to preview the build-output in your browser. (click on the link in the terminal)

Alternatively, you can simply open the index.html file in the dist directory after building to run the application.

### Saving and opening mindmaps
As mentioned above, saving and opening are handled by JabRef through it's HTTP server. Currently you have to start it manually.

First clone the repo at https://github.com/iloveskittles82/jabref

Then, open it in your editor of choice (IDEA works well for this) and locate the 'rest-api.http' file at 'jabsrv/src/test/rest-api.http'

Follow the steps described at the top of the file to start the server.

(Note: also see https://devdocs.jabref.org/code-howtos/http-server.html for more information on how to start the server)
