# Dinner OS
> Created by Technithusiast

**This is a WAPP (Weekend App).**

This was created in under 48 hours to address a personal pain-point and satisfy my own curiosity.
As a result, this app is untested and will contain bugs that may or may not get fixed. You are free to fork this project and evolve it however you like.
You are also free to submit pull requests if you would like to contribute.

### What is this Dinner OS
This is a simple react application that does two things.
1. Has a "Discover" Page where you can chat with an AI server (This is a separate service). It is able to recommend recipes and other dinner suggestions based on your preferences
2. Has a "Favorites" page where you can revisit any recipe that you saved.

This app can be configured to point to any AI server endpoint as long as they adhere to the following interface

#### POST /dinnerchat
This endpoint is used power the chat feature of the app
**Input**
```ts
type DinnerChatBody = { 
    text: string, // your message to the AI
    user: { 
        id: string, // persistent unique id. Think of it like a sessionId 
        name: string // name of the person sending the message 
    } 
}
```

**Output**
```ts
// agent represents the AI's response
type DinnerChatResponse = { agent: string}
```

#### POST /saveddinner
Fires when the `Save Recipe` button is pressed
**Input**
```ts
// This is the entire chat history. 
type SaveRecipeBody = DinnerChatBody[]
```

**Output**
```ts
type SavedRecipeResponse = { 
    name?: string, // Name of the document that was saved (ex: chicken and rice.md) 
    success: boolean, // whether or not the recipe was able to be created
    response: string  // friendly response from the AI about the request
}
```

#### GET /list_recipes
Returns an array of file names representing the stored recipes
**Input**
None

**Output**
```ts
type ListRecipesResponse = {
    files: string[], // file names of the recipes
    message?: string, // will contain a value if there is an error
    errorCode: number
}
```

#### GET /load_recipe
Returns an array of file names representing the stored recipes
**Input**
This takes a query param property of `name` which holds the name of the recipe you want to load
Example:
`http://localhost:1880/load_recipe?name=yum%20yum%20chicken.md`

**Output**
```ts
// data is a markdown string of the recipe
type LoadRecipeResponse = {data: string}
```

#### POST /create_recipe
Allows clients to upload a new recipe directly in Markdown format.
**Input**
```ts
type CreateRecipeBody = {
    title: string,   // file name of the recipe (ex: "chicken and rice.md")
    content: string  // markdown-formatted recipe content
}
```

#### DELETE /delete_recipe
Deletes a previously saved recipe
**Input**
```ts
type DeleteRecipeBody = {
    title: string // name of the file to delete, including extension (e.g., "chicken and rice.md")
}
```


## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
