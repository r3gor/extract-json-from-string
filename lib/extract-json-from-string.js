const jsonify = (almostJson) => {
  try {
    return JSON.parse(almostJson);
  } catch (e) {
    almostJson = almostJson.replace(/([a-zA-Z0-9_$]+\s*):/g, '"$1":').replace(/'([^']+?)'([\s,\]\}])/g, '"$1"$2');
    return JSON.parse(almostJson);
  }
};

const chars = {
  '[': ']',
  '{': '}'
};

const any = (iteree, iterator) => {
  let result;
  for (let i = 0; i < iteree.length; i++) {
    result = iterator(iteree[i], i, iteree);
    if (result) {
      break;
    }
  }
  return result;
};

const extract = (str) => {
  let startIndex = str.search(/[\{\[]/);
  if (startIndex === -1) {
    return null;
  }

  let openingChar = str[ startIndex ];
  let closingChar = chars[ openingChar ];
  let endIndex = -1;
  let count = 0;

  str = str.substring(startIndex);
  any(str, (letter, i) => {
    if (letter === openingChar) {
      count++;
    } else if (letter === closingChar) {
      count--;
    }

    if (!count) {
      endIndex = i;
      return true;
    }
  });

  if (endIndex === -1) {
    return null;
  }

  let obj = str.substring(0, endIndex + 1);
  return {
    raw: obj,
    start: startIndex,
    end: startIndex + endIndex + 1
  };
};

module.exports = (str, includeDetails = false) => {
  let result;
  const objects = [];
  let currentOffset = 0;
  let remainingStr = str;

  while ((result = extract(remainingStr)) !== null) {
    try {
      let obj = jsonify(result.raw);
      objects.push({
        object: obj,
        raw: result.raw,
        start: currentOffset + result.start,
        end: currentOffset + result.end
      });
    } catch (e) {
      // Do nothing
    }

    currentOffset = currentOffset + result.end;
    remainingStr = str.substring(currentOffset);
  }

  if (!includeDetails) {
    return objects.map(item => item.object);
  }

  return objects;
};
