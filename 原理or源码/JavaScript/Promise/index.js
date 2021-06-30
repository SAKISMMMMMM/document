console.log('script start')

new Promise(r=>{
  console.time('request Time')
  axios.get('https://movie.querydata.org/api').then(res=>r(res))
  console.log('request')
  // r(requestResult)
}).then(res=>{
  console.timeEnd('request Time')
  console.log('request result', res);
}).then(res=>console.log('1.1')).then(res=>console.log('1.2')).then(res=>console.log('1.3'))

setTimeout(()=>{
  console.log('timer0s')
},0)

setTimeout(()=>{
  console.log('timer1s')
},1000)

setTimeout(()=>{
  console.log('timer2s')
},2000)

setTimeout(()=>{
  console.log('timer3s')
},3000)




new Promise(r=>{
  console.log('local promise')
  r()
}).then(()=>{
  console.log('local promise then')
})

console.log('script end')
