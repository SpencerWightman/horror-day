const addParagraphBreaks = (text) => {
  // Split the text into sentences, keeping the full stops with the sentences
  let sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  let paragraph = '';
  let formattedText = '';
  let sentenceCount = 0;

  for (let sentence of sentences) {
    sentence = sentence.trim();
    paragraph += sentence + ' ';
    sentenceCount++;

    // Create a new paragraph after every 4 sentences
    if (sentenceCount % 4 === 0) {
      formattedText += paragraph.trim() + '\n\n';
      paragraph = '';
    }
  }

  // Add any remaining text as a paragraph
  if (paragraph) {
    formattedText += paragraph.trim();
  }

  return formattedText;
}

export default addParagraphBreaks;
