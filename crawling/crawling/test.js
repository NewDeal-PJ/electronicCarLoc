// 이거는 아이디 값 가져오는거
// 0,1,2 가져오고 3은 원래 광고인데 여기서는 가져오게된다 4번째 것의 id를 
//0 ~ 14 15개 
document.querySelectorAll("#info\\.search\\.place\\.list > li > div > span > a")[0].href


let j = 1
let b = a[j]
b.querySelector("div span a").href







if (j < 3) {
  id = b.querySelector("div span a").href
}
if (j === 3) {
  continue;
}
if (j > 3) {
  b = a[j - 1]
  id = b.querySelector("div span a").href
}


let data = [{
  name: '사려니숲길 주차장 전기차충전소',
  address: '제주특별자치도 제주시 봉개동 2750-2',
  lng: '126.637484729602',
  lat: '33.4341068530876'
},
{
  name: '사려니숲길 주차장 전기차충전소',
  address: '제주특별자치도 제주시 봉개동 2750-2',
  lng: '126.637484729602',
  lat: '33.4341068530876'
},
{
  name: '사려니숲길 주차장 전기차충전소',
  address: '제주특별자치도 제주시 봉개동 2750-2',
  lng: '126.637484729602',
  lat: '33.4341068530876'
}]

console.log(data[0].name)
console.log(data[0].address)
console.log(data[0].lng)
console.log(data[0].lat)