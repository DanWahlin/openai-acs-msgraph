# Angular, Microsoft Graph Toolkit, OpenAI, and Azure Communication Services

This application demonstrates how Microsoft Graph and the Microsoft Graph Toolkit, OpenAI, and Azure Communication Services can be used in Line of Business (LOB) applications to improve the user experience and take LOB apps to the next level.

- **Organizational Data**: Pull in related organizational data that users may need as they work with customers to avoid context switching.
- **AI**: Enable natural language to SQL queries using OpenAI to enable users to ask questions in natural language and get answers back in SQL.
- **Enhanced Communication**: Enable in-app phone calling to customers and SMS functionality using Azure Communication Services.

Adding these features reduces the need for the user to switch to Outlook, Teams, OneDrive, other custom apps, their phone, etc. since the specific data and functionality they need is provided directly in the app.

![App Demo](/images/demo.gif)

## Prequisites

- [Node.js](https://nodejs.org)
- [Microsoft 365 developer tenant](https://developer.microsoft.com/microsoft-365/dev-program)
- [Azure subscription](https://azure.microsoft.com/free/)
- [Docker Desktop](https://www.docker.com/get-started/) (or an equivalent container runtime)
- [OpenAI](https://platform.openai.com/account) account

## Running the App

1. Add an `.env` file to the root of the project with the following values. Optionally, you can rename the provided `.env.example` file to `.env`.

    ```
    AAD_CLIENT_ID=<CLIENT_ID>
    TEAM_ID=<TEAMS_TEAM_ID>
    CHANNEL_ID=<TEAMS_CHANNEL_ID>
    OPENAI_API_KEY=<OPENAI_SECRET_KEY>
    POSTGRES_USER=web
    POSTGRES_PASSWORD=web-password
    ACS_CONNECTION_STRING=<ACS_CONNECTION_STRING>
    ACS_PHONE_NUMBER=<ACS_PHONE_NUMBER>
    API_BASE_URL=http://localhost:3000/api/
    ```

1. Create a [Microsoft 365 Developer tenant](https://developer.microsoft.com/en-us/microsoft-365/dev-program) if you don't already have one. 

1. Create a new Azure Active Directory app registration using the [Azure Portal](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps).

    - Give the app a name such as `angular-mgt`.
    - Select `Accounts in any organizational directory (Any Azure AD directory - Multitenant)`
    - Redirect URI: Single-page application (SPA) with a redirect URL of http://localhost:4200

1. After creating the app registration, go to the `Overview` screen and copy the `Application (client) ID` to your clipboard. Replace the <AAD_CLIENT_ID> value in the `.env` file with the value.

        ```
        AAD_CLIENT_ID=<AAD_CLIENT_ID>
        ```

1. Create an Azure Communication Services (ACS) resource in the [Azure Portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Communication%2FCommunicationServices).

    - Add a phone number and ensure that the phone number has calling capabilities enabled. 

    - Update the **ACS connection string** and **phone number** in the `.env` file.

        ```
        ACS_CONNECTION_STRING=<ACS_CONNECTION_STRING>
        ACS_PHONE_NUMBER=<ACS_PHONE_NUMBER>
        ```

        **NOTE**: You can get the connection string from the Azure Portal by going to your ACS resource, selecting `Keys` from the left-hand menu, and copying the `connection string` value.

1. To send a message from the app into a Teams Channel (optional feature that is included), create a new Team in [Microsoft Teams](https://teams.microsoft.com) using your Microsoft 365 dev tenant account, and add the team Id and channel Id values into the `.env` file. You can use the "General" channel to get the channel Id or create your own channel.

    ```
    TEAM_ID=<TEAMS_TEAM_ID>
    CHANNEL_ID=<TEAMS_CHANNEL_ID>
    ```

1. If you'd like to try the natural language to SQL OpenAI functionality, add your [OpenAI](https://platform.openai.com/account/api-keys) secret key into the `.env` file:

    ```
    OPENAI_API_KEY=<OPENAI_SECRET_KEY>
    ```

    NOTE: The backend API is currently using `gpt-4` which isn't broadly available as of today. If you don't have access to it in your OpenAI account, open `apiRoutes.mjs`, locate the following code, and change the model to `gpt-3.5.turbo` if needed.

    ```javascript
    const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo', 
    ...
    });
    ```

1. Run `npm install` to install dependencies.

1. Run `docker-compose up` in a console window to start the Postgresql server.

1. Open a separate command window and run `npm start-api` to start the backend API service. This will automatically populate the database with sample data.

1. Open a separate command window and run `npm start`.

1. Go to the browser and login using your Microsoft 365 Developer tenant account. 

    **NOTE**: You'll have to add files, Teams chats, emails, calendar events, etc. that use the company names shown in the app such as "Adatum Corporation", "Adventure Works Cycles", "Contoso Pharmaceuticals", "Tailwind Traders" manually to see them pulled into the app. You won't see any Microsoft 365 organizational data results at all when you load the app otherwise - aside from the app's customers. I'm hoping to provide an automated way to add these types of items in the future.
