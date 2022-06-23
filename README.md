# Getting Started with CNB Cognittive Tests

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# First time run
Run npm install or yarn install depending on your preference.

# Structure

## data
Folder containing all definitions of task instructions and trials.

## Assets
All static content for a test such as logos or demos are stored in the assets/test_short_name folder.

## Components
Defines basic components that we use to build different react tasks. Examples include a TitlePage.

## Instructions
Defines generic as well as test specific instructions that are used in building a task. For example while instructions are stored as text in the database, some tests like CPF have additional content that needs to be displayed alongside the text. So a SimpleInstructions will not work for such task, build a new Instructions component.

## Loaders
Defines components that are used to load data from a database, specifically for CNB tasks when running on webcnp or surveys.

### AssetLoader
Use this component for tasks that need to preload images such as CPF, VOLT, FNBm CPT etc.

### TestLoader
This is the main component responsible for loading a task when it is administered on webcnp, currently does not support surveys.
For local testing, you can change it to point to tests.pl

## Stimuli
Defines stimuli for different tasks, specifically defines stimuli that needs a canvas object to render. Applies to tasks like Motor Praxis, Go No GO, and PCET.

## Tools
Developer helping tools for defining test trials, timelines / documents etc. Entry point manage.

## Trials
Contains components that define trials for each task. Each trial is a JSON object loaded from the database so it is important that all trials are defined in a consistent manner so the Trials components can basically act as iterators.

## Tasks
Contains components that define each task. Each task is completelt defined in a task component; from loaders to instructions to trials, the entire task timeline is defined in such components.

## Styles
Contains css stylesheets for each specific task.

# Utils
Helping functions.

# Layouts - TO DO
# Deploy test versions manager

# Deply test runner


# React content
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
