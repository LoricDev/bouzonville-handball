export const ROLES = {
  DEV: 'dev',       
  ADMIN: 'admin',   
  BUREAU: 'bureau', 
  COM: 'com',       
  COACH: 'coach',
  BENEVOLE: 'benevole',  
  JOUEUR: 'joueur', 
  USER: 'user'
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ALLOWED_ADMIN_ROLES: UserRole[] = [
  ROLES.DEV,
  ROLES.ADMIN,
  ROLES.BUREAU,
  ROLES.COM,
  ROLES.COACH,
];

export type AdminRole = (typeof ALLOWED_ADMIN_ROLES)[number];

export const SIDEBAR_PERMISSIONS = {
  dashboard: [ROLES.DEV, ROLES.ADMIN, ROLES.BUREAU, ROLES.COM, ROLES.COACH],
  matches: [ROLES.DEV, ROLES.ADMIN, ROLES.COACH],
  teams: [ROLES.DEV, ROLES.ADMIN, ROLES.BUREAU, ROLES.COACH],
  news: [ROLES.DEV, ROLES.ADMIN, ROLES.COM],
  gallery: [ROLES.DEV, ROLES.ADMIN, ROLES.COM, ROLES.COACH],
  partners: [ROLES.DEV, ROLES.ADMIN, ROLES.BUREAU],
  documents: [ROLES.DEV, ROLES.ADMIN, ROLES.BUREAU],
  users: [ROLES.DEV, ROLES.ADMIN, ROLES.BUREAU], 
  settings: [ROLES.DEV, ROLES.ADMIN],
} as const satisfies Record<string, readonly AdminRole[]>;