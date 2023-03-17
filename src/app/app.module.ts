import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FilesComponent } from './files/files.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FilterTextboxComponent } from './shared/filter-textbox.component';
import { ChatsComponent } from './chats/chats.component';
import { EmailsComponent } from './emails/emails.component';
import { CalendarComponent } from './agenda/agenda.component';
import { RelatedContentComponent } from './related-content/related-content.component';
import { ChatDialogComponent } from './chats/chat-dialog/chat-dialog.component';
import { DynamicPipe } from './shared/dynamic.pipe';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FilesComponent,
    CustomersListComponent,
    FilterTextboxComponent,
    ChatsComponent,
    EmailsComponent,
    CalendarComponent,
    RelatedContentComponent,
    ChatDialogComponent,
    DynamicPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CurrencyPipe, DatePipe, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
