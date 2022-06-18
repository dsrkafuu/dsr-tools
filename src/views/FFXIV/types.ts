export interface FFXIVServerItem {
  name: string;
  times?: string[];
  start?: string;
  route?: string;
  comment?: string;
}

export interface FFXIVPatchItem {
  name: string;
  servers: FFXIVServerItem[];
}

export interface FFXIVDCItem {
  name: string;
  patches: FFXIVPatchItem[];
}

export interface FFXIVData {
  time: number;
  data: FFXIVDCItem[];
}
