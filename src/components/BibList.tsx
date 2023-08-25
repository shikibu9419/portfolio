import type { BibEntry } from 'bibtex';
import { parseBibFile } from 'bibtex';
import { useMemo } from 'preact/compat';

export type Props = {
  bibtexString: string;
};

interface Author {
  firstName: string;
  lastName: string;
}

function chunk<T>(arr: T[], size: number): T[][] {
  return arr.reduce((newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]), [] as T[][]);
}

// TODO: concern middle name etc.
const parseAuthors = (bib: BibEntry): Author[] => {
  const authorField = bib.getFieldAsString('author') as string;
  // get name words and remove "and"
  const words = authorField.split(' ').filter((w) => w !== 'and');
  console.log(words);

  return (chunk(words, 2) as [string, string][]).map(([name1, name2]) => {
    console.log([name1, name2]);
    // e.g. "Last1, First1 and Last2, First2 and ..."
    if (name1.endsWith(',')) {
      return { firstName: name2, lastName: name1.replace(',', '') };
      // e.g. "First1 Last1, First2 Last2, ..."
    }
      return { firstName: name1, lastName: name2.replace(',', '') };
  });
};

const getAuthorsString = (bib: BibEntry): string => {
  const authors = parseAuthors(bib).map((a) => `${a.firstName} ${a.lastName}`);
  authors.splice(-2, 2, authors.slice(-2).join(' and '));

  return authors.join(', ');
};

const getAPAInnerHTML = (bib: BibEntry): string => {
  return [
    getAuthorsString(bib).replaceAll(/(泉和哉|Kazuya Izumi)/g, '<u>$1</u>'),
    bib.getFieldAsString('year'),
    bib.getFieldAsString('title'),
    bib.getFieldAsString('booktitle') + (bib.getFieldAsString('series') ? ` (${bib.getFieldAsString('series')})` : ''),
    [bib.getFieldAsString('publisher'), bib.getFieldAsString('address')].filter((s) => !!s).join(', '),
    [
      bib.getFieldAsString('articleno') && `Article ${bib.getFieldAsString('articleno')}`,
      bib.getFieldAsString('pages') || `${bib.getFieldAsString('numpages')} pages`,
    ]
      .filter((s) => !!s)
      .join(', '),
    bib.getFieldAsString('url'),
  ]
    .filter((s) => !!s)
    .join('. ');
};

export default function BibList({ bibtexString }: Props) {
  const bibEntries = useMemo(() => parseBibFile(bibtexString).entries_raw || [], [bibtexString]);

  return (
    <ul>
      {bibEntries.map((bib: BibEntry) => (
        <li key={bib._id} dangerouslySetInnerHTML={{ __html: getAPAInnerHTML(bib) }} />
      ))}
    </ul>
  );
}
