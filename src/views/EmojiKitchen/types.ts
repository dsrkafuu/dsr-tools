export interface EmojiCombo {
  l: string;
  r: string;
  t: string;
}

export interface EmojiOutData {
  [key: string]: EmojiCombo[];
}
