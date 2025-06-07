export type LineModeName =
  | 'bus'
  | 'national-rail'
  | 'tube'
  | 'overground'
  | 'river-bus'
  | 'cable-car'
  | 'dlr'
  | 'elizabeth-line'
  | 'tram'
  | 'coach'
  | 'cycle'
  | 'cycle-hire'
  | 'interchange-keep-sitting'
  | 'interchange-secure'
  | 'replacement-bus'
  | 'river-tour'
  | 'taxi'
  | 'walking'
  | 'RealTime'
  | 'Undefined'
  | 'PlannedWork'
  | 'Information'
  | 'Event'
  | 'Crowding'
  | 'StatusAlert';

export const colors: string[] = [
  '#A82B00',
  '#49A800',
  '#0019A8',
  '#E87C48',
  '#40A7E4',
  '#A5D99C',
  '#1C2453',
  '#02633E',
  '#E6418D',
  '#97A081',
  '#CE0DC6',
  '#762696',
  '#B3C543',
  '#EEDE8E',
  '#17ECB8',
  '#5DDB0E',
  '#FE4825',
  '#D7DC01',
  '#3786A9',
  '#7A371D',
  '#C9BC6E',
  '#97A081',
  '#CE0DC6',
  '#762696',
  '#B3C543',
];

export const lineColors: Record<LineModeName, string> = {
  bus: colors[0],
  "national-rail": colors[1],
  tube: colors[2],
  overground: colors[3],
  'river-bus': colors[4],
  'cable-car': colors[5],
  dlr: colors[6],
  'elizabeth-line': colors[7],
  tram: colors[8],
  coach: colors[9],
  cycle: colors[10],
  'cycle-hire': colors[11],
  'interchange-keep-sitting': colors[12],
  'interchange-secure': colors[13],
  'replacement-bus': colors[14],
  'river-tour': colors[15],
  taxi: colors[16],
  walking: colors[17],
  ///////////////////////
  RealTime: colors[18],
  Undefined: colors[19],
  PlannedWork: colors[20],
  Information: colors[21],
  Event: colors[22],
  Crowding: colors[23],
  StatusAlert: colors[24],
}