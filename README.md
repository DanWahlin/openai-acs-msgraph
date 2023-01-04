# Angular and Microsoft Graph Toolkit

This application demonstrates how Microsoft Graph and the Microsoft Graph Toolkit can be used in Line of Business (LOB) applications to pull in related organizational data that users may need as they work with customers. Doing this eliminates the user jumping to Outlook, Teams, OneDrive, etc. since the specific company information is pulled directly into the app.

![App Demo](/images/demo.gif)

## Running the App

1. Create a [Microsoft 365 Developer tenant](https://developer.microsoft.com/en-us/microsoft-365/dev-program) if you don't already have one.

1. Create a new Azure Active Directory app registration using the Azure Portal.

    - Give the app a name such as `angular-mgt`.
    - Select `Accounts in any organizational directory (Any Azure AD directory - Multitenant)`
    - Redirect URI: Single-page application (SPA) with a redirect URL of http://localhost:4200

1. After creating the app registration, go to the `Overview` screen and copy the `Application (client) ID` to your clipboard.

1. Add a `.env` file to the root of the project with the following value. Replace <YOUR_AAD_CLIENT_ID> with the value from the previous step.

    ```
    AAD_CLIENT_ID=<YOUR_AAD_CLIENT_ID>
    ```

1. If you'd like to try out sending a message from the app into a Teams Channel (optional), create a new Team in Microsoft Teams using your dev tenant account, and add the team Id and channel Id into the `.env` file:

    ```
    TEAMS_ID=<ID_OF_YOUR_TEAM_IN_TEAMS>
    CHANNEL_ID=<ID_OF_YOUR_CHANNEL_IN_TEAMS>
    ```

1. Run `npm install`.

1. Run `npm start`.

1. Login using your Microsoft 365 Developer tenant account. Note that currently, you'll have to add files, Teams chats, emails, calendar events, etc. (that use the company names shown in the app) manually to see them pulled into the app. You won't see any results at all when you load the app otherwise - aside from the app's customers. I'm planning to provide an automated way to add the other items in the future.
