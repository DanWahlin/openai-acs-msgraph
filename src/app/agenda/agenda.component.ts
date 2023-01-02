import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MgtAgenda, TemplateHelper } from '@microsoft/mgt';
import { RelatedDataComponent } from '../shared/related-content.component';
/* Based on the example found at:
  https://github.com/microsoftgraph/microsoft-graph-toolkit/blob/main/samples/angular-app/src/app/angular-agenda/angular-agenda.component.ts
*/
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class CalendarComponent extends RelatedDataComponent implements OnInit {
  startDateTime = new Date();
  endDateTime = new Date(this.startDateTime.getTime() + (7 * 24 * 60 * 60 * 1000));
  get queryUrl() {
    return `/me/events?startdatetime=${this.startDateTime.toISOString()}&enddatetime=${this.endDateTime.toISOString()}&$filter=contains(subject,'${this.searchText}')&orderby=start/dateTime`;
  }

  @ViewChild('agenda', { static: false })
  agendaElement: ElementRef<MgtAgenda> = {} as ElementRef<MgtAgenda>;

  ngOnChanges() {
    if (this.agendaElement.nativeElement) {
      this.agendaElement.nativeElement.eventQuery = this.queryUrl;
      this.agendaElement.nativeElement.reload();
    }
  }

  ngOnInit() {
    // Changing binding syntax in mgt-agenda template to avoid build issues with Angular
    TemplateHelper.setBindingSyntax('[[', ']]');
  }

  ngAfterViewInit() {
    this.agendaElement.nativeElement.eventQuery = this.queryUrl;
    this.agendaElement.nativeElement.templateContext = {
      // Hacky way to get to the events array to report the data back to the parent component
      // mgt components need a dataLoaded type of event to easily identify when data is loaded
      dataLoaded: (events: any[]) => {
        this.dataLoaded.emit(events);
      },
      dayFromDateTime: (dateTimeString: string) => {
        let date = new Date(dateTimeString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        let monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ];

        let monthIndex = date.getMonth();
        let day = date.getDate();
        let year = date.getFullYear();

        return monthNames[monthIndex] + ' ' + day + ' ' + year;
      },

      timeRangeFromEvent: (event: any) => {
        if (event.isAllDay) {
          return 'ALL DAY';
        }

        let prettyPrintTimeFromDateTime = (date: Date) => {
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          let hours = date.getHours();
          let minutes = date.getMinutes();
          let ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12;
          let minutesStr = minutes < 10 ? '0' + minutes : minutes;
          return hours + ':' + minutesStr + ' ' + ampm;
        };

        let start = prettyPrintTimeFromDateTime(new Date(event.start.dateTime));
        let end = prettyPrintTimeFromDateTime(new Date(event.end.dateTime));

        return start + ' - ' + end;
      },
      noEventsCount: (event: any) => {
        this.dataLoaded.emit([]);
      }
    };
  }

  override async search(query: string) {

  }

}
