export const baseUrl = import.meta.env.VITE_BACK_URL;

export type DataSource = "tfl" | "local";
export const dataSource: DataSource = import.meta.env
  .VITE_DATA_SOURCE as DataSource;

export const localDataUrl = `${import.meta.env.BASE_URL}tfl-data`;
