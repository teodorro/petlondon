export type DtoBikePoint = {
  id: string,
  url: string,
  commonName: string,
  placeType: string,
  distance: number,
  lat: number,
  lon: number,
  additionalProperties: DtoAdditionalBikePointProperty[],
  children: DtoBikePoint[],
  childrenUrls: string[],
}

export type DtoAdditionalBikePointProperty = {
  category: string,
  key: string,
  sourceSystemKey: string,
  value: string,
  modified: string,
}