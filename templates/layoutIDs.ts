
type nb = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Rows = `row_${nb}`;

export type SectionIDs = `header` | 'nav' | 'main' | 'aside' | 'content' |
  'footer' | 'hero' | 'banner' | 'sidebar' | 'cta' | `section_${nb}` | Rows;

export type Cards = `card_${nb}`;

export type BlocksIDs = `block_${nb}`;


 
export type NodeID = SectionIDs | Cards | BlocksIDs ;
