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
        scopes: ['user.read', 'files.read.all']
      });
    }
    else {
      console.log('Global provider already initialized');
    }
  }

  async searchFiles(query: string) {
    const files: any[] = [];

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
        for (let hit of hitContainer.hits) {
          files.push(hit.resource);
        };
      };
    }
    return files;
  }

}
