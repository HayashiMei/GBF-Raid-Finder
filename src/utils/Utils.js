export const copy = text => {
  const textArea = document.createElement('textarea'), { style } = textArea;
  style.position = 'fixed';
  style.top = '0';
  style.left = '0';
  style.width = '2em';
  style.height = '2em';
  style.padding = '0';
  style.border = 'none';
  style.outline = 'none';
  style.boxShadow = 'none';
  style.background = 'transparent';
  style.fontSize = '16px';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  textArea.remove();
}

export const getIndexByProp = (arr, name, value) => {
  for (let i = 0; i < arr.length; i++ ) {
    if (arr[i][name] === value) return i;
  }
  return -1;
};