import { DEFAULT_TABLE_STATE } from "frontend/design-system/components/Table/constants";
import { createStore } from "frontend/lib/store";
import { IPaginatedDataState } from "shared/types/data";

type IStore = {
  tableState: IPaginatedDataState<any>;
  setTableState: (tableState: IPaginatedDataState<any>) => void;
};

export const useCurrentTableStateStore = createStore<IStore>((set) => ({
  tableState: DEFAULT_TABLE_STATE,
  setTableState: (tableState) =>
    set(() => ({
      tableState,
    })),
}));
