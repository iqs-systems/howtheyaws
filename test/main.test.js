const fs = require('fs');
const srcMd = fs.readFileSync('README.md', 'utf8');

test('Header is intact', () => {
    expect(srcMd).toStartWith('# How they AWS')
});

test('Section headers are intact', () => {
  var expectedH2List = [
    '## Introduction',
    '## Organizations',
    '## Resources',
    '## Credits',
    '## Other How They... repos',
    '## Contribute',
    '## License'
  ]
  var actualList = srcMd.match(/^## (.*$)/gim);
  expect(actualList).toEqual(expectedH2List)
});


test('Organization list is sorted', () => {
  var sortedOrgList = srcMd.match(/(?<=<summary>)(.*?)(?=<\/summary>)/g).sort(Intl.Collator().compare);
  var orgList = srcMd.match(/(?<=<summary>)(.*?)(?=<\/summary>)/g);
  expect(orgList).toEqual(sortedOrgList)
});


test('All unique items', () => {
  var items = srcMd.match(/(?<=\* )(.*?)(?=\))/g);
  expect(items).toBeDistinct();
});

test('All links have unique text', () => {
  var items = srcMd.match(/(?<=\* \[)(.*?)(?=\])/g);
  expect(items).toBeDistinct();
});

test('All links have unique URL', () => {
  var items = srcMd.match(/(?<=\* \[*.*\]\()(.*?)(?=\))/g);
  // this link appears twice hence filtering it      
  var items = arrayRemove(items, 'https://github.com/abhivaikar/howtheytest');
  expect(items).toBeDistinct();
});

function arrayRemove(arr, value) { 
return arr.filter(function(ele){ 
    return ele != value; 
});
}

expect.extend({
  toBeDistinct(received) {
    const pass = Array.isArray(received) && new Set(received).size === received.length;
    if (pass) {
      return {
        message: () => `expected [${received}] array is unique`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected [${received}] array is not to unique`,
        pass: false,
      };
    }
  },
});