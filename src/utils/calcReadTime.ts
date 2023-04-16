interface ContentType {
  content: {
    heading: string;
    body: {
      text: string;
    }[];
  }[];
}

export function calcReadTime({ content }: ContentType): number {
  const referenceWordPerMinute = 200;

  let amountWordsOfTitle = 0;
  content
    .map(section => {
      return section.heading.split(' ');
    })
    .forEach(list => {
      amountWordsOfTitle += list.length;
    });

  let amountWordsOfBody = 0;
  content
    .map(section => {
      return section.body.map(paragraph => paragraph.text.split(' '));
    })
    .forEach(block => {
      block.forEach(words => {
        amountWordsOfBody += words.length;
      });
    });

  return Math.ceil(
    (amountWordsOfTitle + amountWordsOfBody) / referenceWordPerMinute
  );
}
