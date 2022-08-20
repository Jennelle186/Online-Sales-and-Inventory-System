# Getting Started

This project was created using ReactJS with Material-UI as its main library for the design. Firebase was then used as its backend. 
A google drive link is also available for the step-by-step instructions with pictures on how to deploy the system. You may go to this link: https://drive.google.com/file/d/1Y2ke42PU9oxhNz5SeseAOZKuJ7H6ayBb/view?usp=sharing

## What to Install

1. You may need to install Visual Studio Code if you do not have it installed in your computer. 
You may download it here: https://code.visualstudio.com/download

2. Install Node.js if you do not have it installed in your computer. 
You may download it here: https://drive.google.com/file/d/1WOHd12aIlEatNaarHFP91bU62LfvB2gr/view

## Creating a Firebase Project for the web application

1. You will need a Gmail Account for your Firebase project. You may click on the Google drive link provided above for a detailed step-by-step instructions on how to create one. 
2. With your signed in Gmail account, click on the button ‘console’.
3. Click on the “Create Project”.
4. Start by entering what your project name will be. To continue with the process, you must check the 2 checkboxes and not to leave a blank on the project name. Click continue to proceed.
5. You may choose not to enable these analytics for the project. Click on continue to proceed and wait for the project to be completed.
6. You may click ‘continue` after seeing a display message on the screen that the project is ready.
7. Click on the icon "</>" with a tooltip of “web”.
8. Enter the name of your application. The name entered here will also be the domain name of the web application. You may uncheck the Firebase hosting as you can still set this up later.
9. You may click “continue to console” as shwon in the screen.
10. Click on the “Build” and click on the "Authentication“. To proceed, click on the "Get Started” button.
11. Enable Email/Password
12. Click on Firestore Database on the Build panel and click on the “Create Database”.
13. Thereafter, You may start on the production mode.
14. You may choose a location but “asia-southeast2” is recommended the most. Thereafter, wait for it to load as this might take a while.
15. Go to the “security rules” and update the code found in the Google Drive link on page 13 . This will ensure that only a logged in user will be able to perform read and write functions in the database.
16. Click on “Hosting” under the build panel and click the “Get started” button. Thereafter, you may proceed with the steps below.


## How to open the project in Visual Studio Code

1. Download the zip files of this project.

2. Unzip the files and open Visual Studio Code.

3. Click on Open Folder and locate the folder of the unzip files and click on it.

## How to deploy the project

Before continuing with the steps below: Enter this on the terminal "npm i -D env-cmd". This installs the package for the .env.local API keys to be recognized when deployed on Firebase Hosting

1. From the Visual Studio Code terminal, enter these “npm i -g firebase-tools”

2. Enter “Firebase login”. You need to be logged in to your Gmail account that is
connected with your Firebase project.

3. If you are using another account, you may enter “firebase login –reauth”

4. Follow the given link and this will direct you a page for you to choose your gmail account that is connected with your Firebase project. You may then choose the Gmail account that is connected to your Firebase project.
  
5. Back to the Visual Studio Code terminal, Enter “firebase init”

6. Pick firebase hosting

7. Select “choose an existing project”

8. Choose what your Firebase Project is

9. You will be asked with the question, "What do you want to use as your public directory?", Enter “build”

10. You will be asked with the question, "Configure as a single-page app?", Enter "yes"

11. You will be asked with the questions, "Set up automatic builds?", Enter "no"

12. Enter "npm run build:deploy" and wait for it to load. This might take a while

13. Wait for the message that says "Deploy complete!" along with the links for the project console and the hostung URL. 

14. Click on the hosting URL to view the hosted website.

## Index in Firestore for querying
According to the Firebase documentation, "Firebase provides powerful tools for ordering and querying your data. Specifically, Firebase allows you to do ad-hoc queries on a collection of nodes using any common child key. As your app grows, the performance of this query degrades. However, if you tell Firebase about the keys you will be querying, Firebase will index those keys at the servers, improving the performance of your queries.". Therefore, in this project, there are several webpages that needs this index querying. These are the following web pages:

    1. Pending Orders
    2. Ready to be Delivered Orders
    3. Delivered Orders
    4. History of the Products

Visiting these web pages, this will show as an error in the console, thereafter, you may just click on the link which will direct you to the Firebase project. Firebase will automatically build this index for you. For more information, you may click on the Google Drive link provided above and go to page 23 which includes pictures on what it loooks like. 



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build:deploy`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

Additionally, this will also deploy the project to Firebase Hosting

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
