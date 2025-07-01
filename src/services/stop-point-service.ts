import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "./services-config";
import { DtoStopPointPage } from "../types/stop-points/dto-stop-point-page";
import { SafeQueryOptions } from "../types/safe-query-options";

export function useGetStopPoints(
  mode: string,
  options?: SafeQueryOptions<DtoStopPointPage>,
) {
  const url = `${baseUrl}/StopPoint/Mode/${mode}`;
  const queryFn = (): Promise<DtoStopPointPage> =>
    fetch(url).then((res) => res.json());
  return useQuery<DtoStopPointPage>({
    queryKey: ["stop-points", `${mode}`],
    queryFn,
    ...options,
  });
}
