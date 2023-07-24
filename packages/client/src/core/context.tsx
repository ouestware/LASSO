import { FC, PropsWithChildren, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ViewState } from "react-map-gl";
import { Feature } from "geojson";

import { ExportedData, IProjectMap, BBOX } from "@lasso/dataprep";
import { ProjectLayerVariable } from "../utils/project";
import { NotificationState } from "./notifications";
import { ModalRequest } from "./modals";
import { useProjectsData } from "../hooks/useProjectsData";
import { Loader } from "../components/Loader";
import { LoadedProject } from "../hooks/useLoadProject";

/**
 * Type definition of the context
 */

export interface AppContextType {
  notifications: Array<NotificationState>;
  modal?: ModalRequest<any, any>;
  data: ExportedData & { loadedProject: Record<string, LoadedProject> };

  current?: {
    data: LoadedProject;
    lassoVariables: { [key: string]: ProjectLayerVariable };
    bbox: BBOX;
    viewState: Partial<ViewState>;
    maps: {
      [key: string]: {
        map: IProjectMap;
        lassoVariable: ProjectLayerVariable | null;
        timeKey?: string;
        selected?: {
          feature: Feature;
          source: string;
          clickedAt: { lng: number; lat: number };
        };
      };
    };
  };
}

const initialContext: AppContextType = {
  notifications: [],
  modal: undefined,
  data: {
    bbox: [
      [0, 0],
      [0, 0],
    ],
    projects: [],
    loadedProject: {},
  },
};

export type AppContextSetter = (value: AppContextType | ((prev: AppContextType) => AppContextType)) => void;

/**
 * Application context.
 */
export const AppContext = createContext<{
  context: AppContextType;
  setContext: AppContextSetter;
} | null>(null);

/**
 * Application context provider.
 */
export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const { loading, error, data } = useProjectsData();

  const [context, setContext] = useState<AppContextType>(initialContext);

  useEffect(() => {
    setContext((prev) => ({
      ...prev,
      data: { ...prev.data, ...data },
    }));
  }, [data]);

  useEffect(() => {
    if (error) navigate("/error");
  }, [error, navigate]);

  return (
    <AppContext.Provider value={{ context, setContext }}>
      <>{loading ? <Loader /> : children}</>
    </AppContext.Provider>
  );
};
