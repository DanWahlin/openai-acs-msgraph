import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
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
import { TextAreaDialogComponent } from './shared/textarea-dialog/textarea-dialog.component';
import { DynamicPipe } from './shared/dynamic.pipe';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { PhoneCallComponent } from './phone-call/phone-call.component';
import { PhonePipe } from './shared/phone.pipe';

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
    TextAreaDialogComponent,
    DynamicPipe,
    PhoneCallComponent,
    PhonePipe
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
    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CurrencyPipe, DatePipe, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
