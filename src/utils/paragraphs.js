const addParagraphBreaks = (text) => {
  let sentences = text.split('.');
  let paragraph = '';
  let formattedText = '';
  let sentenceCount = 0;

  for (let sentence of sentences) {
    sentence = sentence.trim();
    if (sentence) {
      paragraph += sentence + '.';
      sentenceCount++;

      if (sentenceCount === 4) {
        formattedText += paragraph + '\n\n';
        paragraph = '';
        sentenceCount = 0;
      }
    }
  }

  // Add any remaining text as a paragraph
  if (paragraph) {
    formattedText += paragraph;
  }

  return formattedText;
}

export default addParagraphBreaks