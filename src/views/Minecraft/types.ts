export interface MCModItem {
  name: string;
  source: 0 | 1;
  link: string;
}

export interface MCData {
  time: number;
  release: string;
  version: string;
  mods: MCModItem[];
  modrinth: string;
  java: string;
  package: string;
}
