import { NgStyle } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { CalenderTrainingService } from '../../../../core/services/calender-training/calender-training.service';
import { Training } from '../../../../core/models/training.model';
import { AuthService } from '../../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgStyle, FullCalendarModule,RouterLink],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  @ViewChild('externalEvents', { static: true }) externalEvents: ElementRef;

  DISTINCT_COLORS = [
    '#E6194B', // Red
    '#3CB44B', // Green
    '#FFE119', // Yellow
    '#0082C8', // Blue
    '#F58231', // Orange
    '#911EB4', // Purple
    '#46F0F0', // Cyan
    '#F032E6', // Magenta
    '#D2F53C', // Lime
    '#FABEBE', // Pink
    '#008080', // Teal
    '#E6BEFF', // Lavender
    '#AA6E28', // Brown
    '#FFFAC8', // Cream
    '#800000', // Maroon
    '#A9A9A9', // Dark Gray
    '#FFD8B1', // Apricot
    '#000075', // Navy
    '#808000', // Olive
    '#808080'  // Medium Gray
  ];
  
  private calendarService = inject(CalenderTrainingService);
  private authService = inject(AuthService)
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    locale: frLocale,
    events: [], // Empty initially, will be loaded from API
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  currentEvents: EventApi[] = [];

  ngOnInit(): void {
    this.loadEventsFromAPI();
  }

  private loadEventsFromAPI() {
    this.calendarService.getTraining().subscribe((response: any) => {
      //console.log(response)
      const events: EventInput[] = response.training.map((t: Training) => {
        const showName = !this.authService.hasRole('ROLE_TEAM_MEMBER');
        
        const title = showName ? `${t.themeName} - ${t.teamMemberName}` : t.themeName;

        const color = this.generateColorFromString(t.themeName);
        const textColor = this.getTextColorForBackground(color);

        return {
          id: String(t.id),
          title: title || 'Formation',
          start: t.startDate,
          end: t.endDate,
          backgroundColor: color,
          textColor: textColor,
          extendedProps: {
            teamMemberName: t.teamMemberName,
            mode: t.mode,
            status: t.status,
            price: t.priceTND
          }
        };
      });

      this.calendarOptions.events = events;
    });
  }

  generateColorFromString(theme: string): string {
    let hash = 0;
    for (let i = 0; i < theme.length; i++) {
      hash = theme.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this.DISTINCT_COLORS[Math.abs(hash) % this.DISTINCT_COLORS.length];
  }

  getTextColorForBackground(bgColor: string): string {
    const color = bgColor.substring(1);
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 186 ? '#000000' : '#FFFFFF';
  }
  
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        backgroundColor: 'rgba(0,204,204,.25)',
        borderColor: '#00cccc'
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event;
    const extendedProps = event.extendedProps;
    const formattedPrice = extendedProps['price'] != null
      ? `${Number(extendedProps['price']).toFixed(2)} TND`
      : 'N/A';

    const detailsMessage = `
  <div style="text-align: left;">
    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <div style="
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #1976d2;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-right: 10px;
      ">i</div>
      <div style="font-size: 1.2rem; font-weight: 600;">Détails sur la formation</div>
    </div>
    <hr style="border: 1px solid #1976d2; margin-bottom: 15px;">
    <p><strong>Titre:</strong> ${event.title.split('-')[0].trim()}<br>
    <strong>Début:</strong> ${event.start ? this.formatDate(event.start) : 'N/A'}<br>
    <strong>Fin:</strong> ${event.end ? this.formatDate(event.end) : 'N/A'}<br>
    <strong>Collaborateur:</strong> ${extendedProps['teamMemberName'] || ''}<br>
    <strong>Mode:</strong> ${extendedProps['mode'] || 'N/A'}<br>
    <strong>Statut:</strong> ${extendedProps['status'] || 'N/A'}<br>
    <strong>Prix:</strong> ${formattedPrice}</p>
  </div>
`;

    Swal.fire({
      html: detailsMessage,
      confirmButtonText: 'Fermer'
    });

  }


  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  formatDate(date: Date, mode: 'date' | 'hourRange' = 'date'): string {
    const options: Intl.DateTimeFormatOptions =
      mode === 'date'
        ? { day: '2-digit', month: '2-digit', year: 'numeric' }
        : { hour: '2-digit', minute: '2-digit' };

    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(date));
  }

}
