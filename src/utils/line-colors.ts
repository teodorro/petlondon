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
  | 'walking';

export const lineColors: Record<LineModeName, string> = {
  bus: '#A82B00',
  "national-rail": '#49A800',
  tube: '	#0019A8',
  overground: '#E87C48',
  'river-bus': '#40A7E4',
  'cable-car': '#A5D99C',
  dlr: '#1C2453',
  'elizabeth-line': '#02633E',
  tram: '#E6418D',
  coach: '#97A081',
  cycle: '#CE0DC6',
  'cycle-hire': '#762696',
  'interchange-keep-sitting': '#B3C543',
  'interchange-secure': '#EEDE8E',
  'replacement-bus': '#17ECB8',
  'river-tour': '#FE4825',
  taxi: '#D7DC01',
  walking: '#3786A9',
}