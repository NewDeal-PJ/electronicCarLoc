import {
  launch,
  goto,
  getData,
  writeFile,
  toDatabase,
}
  from './modules/crawler.js'

async function main() {
  // 브라우저 실행
  await launch()
  //페이지 이동
  await goto('https://map.kakao.com/?from=total&nil_suggest=btn&q=%EC%A0%9C%EC%A3%BC%20%EC%A0%84%EA%B8%B0%EC%B0%A8%20%EC%B6%A9%EC%A0%84%EC%86%8C&tab=place')

  await getData()

  await writeFile()

  await toDatabase()

  process.exit(1)
}

main()