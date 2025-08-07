import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true
  },
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/dashboard',
    roles: ['ROLE_SUPER_MANAGER', 'ROLE_MANAGER', 'ROLE_TEAM_MEMBER']
  },
  {
    label: 'Budget',
    link: '/general/budget',
    icon: 'dollar-sign',
    roles: ['ROLE_SUPER_MANAGER']
  },
  {
    label: 'Formation',
    link: '/general/formations',
    icon: 'book-open',
    roles: ['ROLE_SUPER_MANAGER']
  },
  {
    label: 'Voyage',
    icon: 'map',
    subItems: [
      {
        label: 'Vols',
        link: '/general/voyages',
        icon: 'map',
      },
      {
        label: 'Hotels',
        link: '/general/hotel-map',
        icon: 'trash',
      },
    ],
    roles: ['ROLE_SUPER_MANAGER', 'ROLE_MANAGER']
  },


  {
    label: 'Calendrier',
    icon: 'calendar',
    link: '/apps/calendar',
    roles: ['ROLE_SUPER_MANAGER', 'ROLE_MANAGER', 'ROLE_TEAM_MEMBER']
  }
];
