import puppeteer from 'puppeteer-core'
import os from 'os'
import fs from 'fs'
import { addressParser } from './parser.js'
import oracledb from 'OracleDB';
// import { scrollPageToBottom } from 'puppeteer-autoscroll-down'

const macUrl = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const whidowsUrl = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
const currentOs = os.type()
const launchConfig = {
  headless: false,
  defaultViewport: null,
  ignoreDefaultArgs: ['--disable-extensions'],
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications', '--disable-extensions'],
  executablePath: currentOs == 'Darwin' ? macUrl : whidowsUrl
}


let browser = null
let page = null
let finalData = []
let pageLength = 0
const nextLength = 6
// const pageLength2 = 6
const pageSelector = "#info\\.search\\.page > div > a"



// const readJson = async function () {
//   const jsonFile = fs.readFileSync('./json/car/car.json', 'utf8');
//   console.log(jsonFile);

//   const jsonData = JSON.parse(jsonFile);
//   console.log(jsonData);

// }


// 실행 , init
const launch = async function () {
  browser = await puppeteer.launch(launchConfig) //브라우저 실행
  // 지역변수	
  const pages = await browser.pages() // 현재 브라우저 페이지들
  page = pages[0]
}

const goto = async function (url) {
  await page.goto(url)
}


//데이터 얻는 코드
const getData = async function () {

  // 1,2,3,4,5까지 돌고 다음 페이지로 가는 화살표를 클릭하는 for문
  for (let k = 0; k <= nextLength; k++) {
    // 페이지 수 만큼 반복
    if (k < 6) {
      await page.waitForSelector("#info\\.search\\.page > div > a")
      const f = await page.$("#info\\.search\\.page > div > a")
      console.log('통과')
      pageLength = await page.evaluate(function (pageSelector) {
        const result = document.querySelectorAll(pageSelector).length//
        return result
      }, pageSelector)
      console.log('pageLength:', pageLength)
    }
    else {
      pageLength = 4
    }
    //1,2,3,4,5 이렇게 하나하나 넘어가는 for문
    for (let i = 1; i <= pageLength; i++) {
      // end if

      await page.waitForSelector("#info\\.search\\.place\\.list > li")

      const infoArr = await page.evaluate(function () {

        // 브라우저에서 돌아가는 코드
        let a = document.querySelectorAll("#info\\.search\\.place\\.list > li")
        let returnData = []
        // 인덱스 3번이 오류가 나서 try catch로 오류가 발생할 때 반복문을 그냥 continue시켰다.
        // 한 페이지의 ul태그 안의 li를 하나하나 긁어오는 for문
        for (let j = 0; j < a.length; j++) {
          //try catch
          //긁어오는 부분은 name, address, id 값을 긁어옴
          try {
            let b = a[j]
            var name = b.querySelector("div.head_item.clickArea > strong > a.link_name").innerText
            var address = b.querySelector("div.info_item > div.addr > p:nth-child(1)").innerText
            var id = b.querySelector("div span a").href.replaceAll('https://place.map.kakao.com/', '').replaceAll('#comment', '')
            var jsonData = {
              id,
              name,
              address
            }
            //json데이터로 바꿔서 returndata에 푸쉬하고 이걸 concat시킴
            returnData.push(jsonData)
          }
          catch (error) {
            continue;
          }
        } // end for(2)

        return returnData
      }) // end infoArr eval

      finalData = finalData.concat(infoArr)
      console.log('누적 데이터 :', finalData.length)

      // 이 아랫단이 제일 마지막 포문의 페이지 넘기는 코드
      await page.waitForSelector('#info')
      await page.waitForTimeout(1000)
      if (pageLength != i) {
        console.log('다음 페이지 클릭시작')
        await page.evaluate(function (i) {
          document.querySelectorAll(`#info\\.search\\.page > div > a`)[i].click()
        }, i)
        await page.waitForTimeout(1000)
        console.log('다음 페이지 클릭 완료')
        await page.waitForSelector('#info')
      }
      await page.waitForTimeout(1000)

      // 다음 페이지 이
      //브라우저 단에서 실행 되는 코드
    } //end for(1)

    if (nextLength != k) {
      console.log('페이지 넘어가기 클릭시작')
      await page.evaluate(function () {
        document.querySelector("#info\\.search\\.page\\.next").click()
      })
      await page.waitForTimeout(1000)
      console.log('페이지 넘어가기 클릭 완료')
      await page.waitForSelector('#info')
    }
    await page.waitForTimeout(1000)
  }

  await page.waitForTimeout(8000)
  browser.close()
}
// end getData


//file로 만들어 보자 !!
const writeFile = async function () {

  for (let i = 0; i < finalData.length; i++) {
    finalData[i] = await addressParser(finalData[i])
  }

  const stringData = JSON.stringify(finalData) // 문자열로 변환

  // 해당 경로가 존재하는지 확인
  const exist = fs.existsSync(`./json/car`)

  // 경로가 존재하지 않으면 폴더 생성
  if (!exist) {
    fs.mkdir(`./json/car`, { recursive: true }, function (err) {
      console.log(err)
    })
  }

  const filePath = `./json/car/car.json`
  await fs.writeFileSync(filePath, stringData)


}

//파일로 저장해서 json파일을 불러와서 그 데이터를 한 줄 한 줄 column, low를 넣을 것임!
//oracle DB에 넣어보자!!
const toDatabase = async function () {
  //json 파일을 읽는 코드
  const jsonFile = fs.readFileSync('./json/car/car.json', 'utf8');
  const jsonData = JSON.parse(jsonFile);
  console.log(jsonData.length);
  for (let i = 0; i < jsonData.length; i++) {
    // let connection;(db에 연결하는 코드)
    let connection;
    connection = await oracledb.getConnection({ user: "jeju", password: "1111", connectString: "np.silly.monster/xe" })
    console.log("Successfully connected to Oracle Database");
    try {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
      await delay(2000)
      console.log(`현재 ${i + 1}번째 데이터가 들어가는 중!`)
      // Insert some data
      // 실행할 sql문과 row를 정해주고 그것을 insert 시킴
      const sql = `insert into TBL_CHARGERLOC (chagerid,name,address,latitude,longitude) values(:1, :2, :3, :4, :5)`;

      const rows =
        [[jsonData[`${i}`].id, jsonData[`${i}`].name, jsonData[`${i}`].address, jsonData[`${i}`].lat, jsonData[`${i}`].lng]]

      let result = await connection.executeMany(sql, rows);

      console.log(result.rowsAffected, "Rows Inserted");

      connection.commit();

      // Now query the rows back

      result = await connection.execute(
        `select chagerid,name,address,latitude,longitude from TBL_CHARGERLOC`,
        [],
        { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

      const rs = result.resultSet;

      await rs.close();

    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}

export {
  launch,
  goto,
  getData,
  writeFile,
  toDatabase,
}