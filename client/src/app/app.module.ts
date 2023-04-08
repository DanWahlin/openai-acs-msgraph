import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
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
import { TextAreaDialogComponent } from './textarea-dialog/textarea-dialog.component';
import { DynamicPipe } from './shared/dynamic.pipe';
import { PhoneCallComponent } from './phone-call/phone-call.component';
import { PhonePipe } from './shared/phone.pipe';
import { OverlayModule } from './core/overlay/overlay.module';
import { EmailSmsDialogComponent } from './email-sms-dialog/email-sms-dialog.component';
import { TitleCaseUnderscorePipe } from './shared/titlecase-underscore.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FilesComponent,
    CustomersListComponent,
    FilterTextboxComponent,
    ChatsComponent,
    EmailsComponent,
    EmailSmsDialogComponent,
    CalendarComponent,
    RelatedContentComponent,
    TextAreaDialogComponent,
    TitleCaseUnderscorePipe,
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
    MatIconModule,
    OverlayModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CurrencyPipe, DatePipe, DecimalPipe, PhonePipe, TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
