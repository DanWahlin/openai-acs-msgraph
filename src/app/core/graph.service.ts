import { Injectable } from '@angular/core';
import { Msal2Provider, Providers } from '@microsoft/mgt';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor() { }

  init() {
    if (!Providers.globalProvider) {
      console.log('Initializing Microsoft Graph global provider...');
      Providers.globalProvider = new Msal2Provider({
        clientId: '',
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
