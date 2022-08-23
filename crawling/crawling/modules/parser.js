import axios from "axios"

async function addressParser(data) {
  const res = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
    params: {
      query: data.address,
    },
    headers: {
      Authorization: 'KakaoAK afa8e1b4fe3c001d95c4fe4adf91176a'
    }
  })

  let lng, lat = 0

  if (res.data.documents.length > 0) {
    lng = res.data.documents[0].address.x
    lat = res.data.documents[0].address.y
  }

  data.lng = lng
  data.lat = lat

  return data
}

export { addressParser }