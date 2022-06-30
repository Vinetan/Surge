/*
#!name=YouTube Premium Unlock Check
#!desc=YouTube Premium 跨區解鎖測試

[Panel]
premiumCheck = script-name=premiumCheck, title="YouTube Premium IP解锁检测", update-interval=1

[Script]
premiumCheck = type=generic,script-path=https://raw.githubusercontent.com/Vinetan/Surge/main/Panel/YouTubeCheck.js, timeout=30
*/

const BASE_URL = 'https://www.youtube.com/premium'

;(async () => {
  let result = {
    title: '𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗖𝗵𝗲𝗰𝗸',
    icon: 'exclamationmark.arrow.triangle.2.circlepath',
    'icon-color':"#77428D",
    content: '𝗖𝗵𝗲𝗰𝗸 𝗙𝗮𝗶𝗹𝗲𝗱! 𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗲𝗰𝗸 𝘆𝗼𝘂𝗿 𝗡𝗲𝘁𝘄𝗼𝗿𝗸',
  }

  await test()
    .then((code) => {
      if (code === 'Not Available') {
        result['icon'] = 'x.circle'
        result['icon-color'] = "#CB1B45"
        result['content'] = '𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗱𝗼𝗲𝘀 𝗻𝗼𝘁 𝘀𝘂𝗽𝗼𝗿𝘁 𝘁𝗵𝗶𝘀 𝗜𝗣 𝗶𝗻 ' + code
        return
      }
      result['icon'] = "checkmark.circle"
      result['icon-color'] = '#1B813E'
      result['content'] = '𝗬𝗼𝘂 𝗰𝗮𝗻 𝘄𝗮𝘁𝗰𝗵 𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗣𝗿𝗲 𝗶𝗻 ' + code
    })
    .finally(() => {
      $done(result)
    })
})()

function test() {
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
        'Accept-Language': 'en',
      },
    }
    $httpClient.get(option, function (error, response, data) {
      if (error != null || response.status !== 200) {
        reject('Error')
        return
      }

      if (data.indexOf('Premium is not available in your country') !== -1) {
        resolve('Not Available')
        return
      }

      let region = ''
      let re = new RegExp('"countryCode":"(.*?)"', 'gm')
      let result = re.exec(data)
      if (result != null && result.length === 2) {
        region = result[1]
      } else if (data.indexOf('www.google.cn') !== -1) {
        region = 'CN'
      } else {
        region = 'US'
      }
      resolve(region)
    })
  })
}
