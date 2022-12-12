# Angular and Microsoft Graph Toolkit

## Running the App

1. Create a new Azure Active Directory app registration using the Azure Portal.

    - Give the app a name such as `angular-mgt`.
    - Select `Accounts in any organizational directory (Any Azure AD directory - Multitenant)`
    - Redirect URI: Single-page application (SPA) with a redirect URL of http://localhost:4200

1. After creating the app registration, go to the Overview screen and copy the `Application (client) ID` to your clipboard.

1. Create a new file in the root of the project named `.env`. Add the following to the file:

    ```
    NG_AAD_CLIENT_ID=<YOUR_AAD_CLIENT_ID>
    ```

1. Run `npm install`

1. Run `ng serve -o`
