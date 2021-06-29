
new Promise(getB).then(
  (res) => {
    console.log('a,start');
    return new Promise(r => setTimeout(() => r(3), 3000))
  }).then(() => console.log('end'))


new Promise(getB).then(
  (res) => {
    console.log('a,start');
    return new Promise(r => setTimeout(() => r(3), 3000))
  }).then(() => console.log('end'))