import { Injectable } from '@angular/core';
import { Msal2Provider, Providers } from '@microsoft/mgt';

// Retrieved from .env file value by using webpack.partial.js and ngx-build-plus
declare const AAD_CLIENT_ID: string;

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor() { }

  init() {
    if (!Providers.globalProvider) {
      console.log('Initializing Microsoft Graph global provider...');
      Providers.globalProvider = new Msal2Provider({
        clientId: AAD_CLIENT_ID,
        scopes: ['User.Read', 'Chat.ReadWrite', 'ChannelMessage.Read.All', 'Calendars.Read', 'Files.Read.All', 'Mail.Read',]
      });
    }
    else {
      console.log('Global provider already initialized');
    }
  }

  async searchFiles(query: string) {
    const files: any[] = [];

    if (!query) return files;

    const filter = {
      "requests": [
          {
              "entityTypes": [
                  "driveItem"
              ],
              "query": {
                  "queryString": `${query} AND ContentType:Document`
              }
          }
      ]
    };
    
    const searchResults = await Providers.globalProvider.graph.client.api('/search/query').post(filter);

    if (searchResults.value.length !== 0) {
      for (let hitContainer of searchResults.value[0].hitsContainers) {
        if (hitContainer.hits) {
          for (let hit of hitContainer.hits) {
            files.push(hit.resource);
          };
        }
      };
    }
    return files;
  }

  async searchChats(query: string) {
    const chatIds: any[] = [];
    const promises: any[] = [];
    const messages: any[] = [];

    if (!query) return messages;

    const filter = {
      "requests": [
        {
          "entityTypes": [
            "chatMessage"
          ],
          "query": {
            "queryString": `${query}`
          },
          "from": 0,
          "size": 25
        }
      ]
    };

    const searchResults = await Providers.globalProvider.graph.client.api('/search/query').post(filter);

    // Get all of the required IDs to retrieve the chat messages
    if (searchResults.value.length !== 0) {
      for (let hitContainer of searchResults.value[0].hitsContainers) {
        if (hitContainer.hits) {
          for (let hit of hitContainer.hits) {
            chatIds.push({
              teamId: hit.resource.channelIdentity.teamId, 
              channelId: hit.resource.channelIdentity.channelId, 
              messageId: hit.resource.id,
              summary: hit.summary
            });
          };
        }
      };

      // Retrieve the chat messages using the IDs
      for (let chat of chatIds) {
        promises.push(Providers.globalProvider.graph.client.api(`/teams/${chat.teamId}/channels/${chat.channelId}/messages/${chat.messageId}`).get());
      }
      const results = await Promise.all(promises.map(p => p.catch((e: any) => e)));
      // Filter out any errors or undefined results in case of a 404
      const validResults = results.filter(result => !(result instanceof Error) && result !== undefined);
      for (let msg of validResults) {
        messages.push({
          id: msg.id,
          teamId: msg.channelIdentity.teamId,
          channelId: msg.channelIdentity.channelId,
          summary: chatIds.find(chat => chat.messageId === msg.id).summary,
          body: msg.body.content,
          from: msg.from.user.displayName,
          date: msg.createdDateTime,
          webUrl: msg.webUrl
        });
      }
    }

    return messages;
  }
  
  async searchEmail(query:string) {
    if (!query) return [];
    // The $search operator will search the subject, body, and sender fields automatically
    let url = `https://graph.microsoft.com/v1.0/me/messages?$search="${query}"&$select=subject,bodyPreview,from,toRecipients,receivedDateTime,webLink`;
    const response = await Providers.globalProvider.graph.client.api(url).get();
    return response.value;
  }

}
