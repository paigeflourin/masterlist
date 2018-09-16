import { IPersonaProps, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';


export const people: (IPersonaProps & { key: string | number })[] = [
  {
    key: 1,
    
    imageInitials: 'PV',
    text: 'Annie Lindqvist',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.online
  },
  {
    key: 2,
    
    imageInitials: 'AR',
    text: 'Aaron Reid',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.busy
  },
  {
    key: 3,
    
    imageInitials: 'AL',
    text: 'Alex Lundberg',
    secondaryText: 'Software Developer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.dnd
  },
  {
    key: 4,
    
    imageInitials: 'RK',
    text: 'Roko Kolar',
    secondaryText: 'Financial Analyst',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.offline
  },
  {
    key: 5,
    
    imageInitials: 'CB',
    text: 'Christian Bergqvist',
    secondaryText: 'Sr. Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.online
  },
  {
    key: 6,
    
    imageInitials: 'VL',
    text: 'Valentina Lovric',
    secondaryText: 'Design Developer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.online
  },
  {
    key: 7,
    
    imageInitials: 'MS',
    text: 'Maor Sharett',
    secondaryText: 'UX Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.away
  },
  {
    key: 8,
    
    imageInitials: 'PV',
    text: 'Anny Lindqvist',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.busy
  },
  {
    key: 9,
    
    imageInitials: 'AR',
    text: 'Aron Reid',
    secondaryText: 'Designer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.dnd
  },
  {
    key: 10,
    
    imageInitials: 'AL',
    text: 'Alix Lundberg',
    secondaryText: 'Software Developer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.offline
  },
  {
    key: 39,
    
    imageInitials: 'AL',
    text: 'Alex Lindbirg',
    secondaryText: 'Software Developer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.dnd
  },
  {
    key: 40,
    
    imageInitials: 'AL',
    text: 'Alex Lindbarg',
    secondaryText: 'Software Developer',
    tertiaryText: 'In a meeting',
    optionalText: 'Available at 4:00pm',
    presence: PersonaPresence.online
  }
];

export const mru: IPersonaProps[] = people.slice(0, 5);