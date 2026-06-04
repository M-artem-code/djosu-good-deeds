export type DeedStatus = "planned" | "done";

export interface DeedPublic {
  _id: string;
  ownerId: string;
  title: string;
  description?: string;
  status: DeedStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeedBody {
  title: string;
  description?: string;
}

export interface UpdateDeedBody {
  title?: string;
  description?: string;
  status?: DeedStatus;
}
