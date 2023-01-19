import { Injectable } from '@angular/core';
import { Msal2Provider, Providers } from '@microsoft/mgt';
import { DialogData } from '../chats/chat-dialog/chat-dialog.component';

// Retrieved from .env file value by using webpack.partial.js and ngx-build-plus
declare const AAD_CLIENT_ID: string;
declare const TEAM_ID: string;
declare const CHANNEL_ID: string;

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
        scopes: ['User.Read', 'Chat.ReadWrite', 'Calendars.Read', 'ChannelMessage.Read.All', 'ChannelMessage.Send', 'Files.Read.All', 'Mail.Read',]
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
    const url = `https://graph.microsoft.com/v1.0/me/messages?$search="${query}"&$select=subject,bodyPreview,from,toRecipients,receivedDateTime,webLink`;
    const response = await Providers.globalProvider.graph.client.api(url).get();
    return response.value;
  }

  async searchAgendaEvents(query:string) {
    if (!query) return [];
    const startDateTime = new Date();
    const endDateTime = new Date(startDateTime.getTime() + (7 * 24 * 60 * 60 * 1000));
    const url = `/me/events?startdatetime=${startDateTime.toISOString()}&enddatetime=${endDateTime.toISOString()}&$filter=contains(subject,'${query}')&orderby=start/dateTime`;

    const response = await Providers.globalProvider.graph.client.api(url).get();
    return response.value;
  }

  async sendTeamsChat(message: string) : Promise<DialogData> {
    if (!message) new Error('No message to send.');
    if (!TEAM_ID || !CHANNEL_ID) new Error('Team ID or Channel ID not set in environment variables. Please set TEAM_ID and CHANNEL_ID in the .env file.');

    const url = `https://graph.microsoft.com/v1.0/teams/${TEAM_ID}/channels/${CHANNEL_ID}/messages`;
    const body = {
      "body": {
        "contentType": "html",
        "content": message
      }
    };
    const response = await Providers.globalProvider.graph.client.api(url).post(body);
    return {
      id: response.id,
      teamId: response.channelIdentity.teamId,
      channelId: response.channelIdentity.channelId,
      body: response.body.content,
      webUrl: response.webUrl
    };
  }

}
