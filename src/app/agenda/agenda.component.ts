import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MgtAgenda, MgtGet, TemplateHelper } from '@microsoft/mgt';
import { RelatedContentBaseComponent } from '../shared/related-content-base.component';
/* Based on the example found at:
  https://github.com/microsoftgraph/microsoft-graph-toolkit/blob/main/samples/angular-app/src/app/angular-agenda/angular-agenda.component.ts
*/
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class CalendarComponent extends RelatedContentBaseComponent implements OnInit {

  ngOnInit() { }
  
  override async search(query: string) {
    this.data = await this.graphService.searchAgendaEvents(query);
  }

  dayFromDateTime(dateTimeString: string) {
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
  }

  timeRangeFromEvent(event: any) {
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
  }

}
