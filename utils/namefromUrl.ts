export function getDocumentNameFromURL(url) {
  // Remove everything before the last slash
  var documentNameWithExtension = url?.substring(url.lastIndexOf("/") + 1);

  return documentNameWithExtension;
}
