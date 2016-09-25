module.exports = (content, file, conf) => {
  if (!file.isHtml) return content;
  return content.replace(/\/\*([\s\S]*?)\*\//g, '')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/^\s+$/g, '')
    .replace(/\n|\t|\r/g, '')
    .replace(/([\n]?\s)+/g, ' ')
    .replace(/>([\n\s]*?)</g, '><');
};
