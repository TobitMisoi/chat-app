import { GroupData } from "./types";

export interface IRootState {
  auth: {
    isLogged: boolean;
    id: string | null;
    username: string | null;
    image: string | null;
    token: string | null;
  };
  app: {
    inChannel: boolean;
    currGroup: GroupData;
    displayedGroups: GroupData[];
    messages: [];
    members: [];
    groups: [];
    modal: null | "bug" | "edit" | "create";
  };
}
