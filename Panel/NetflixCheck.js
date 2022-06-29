/*
[Panel]
netflixCheck = script-name=netflixCheck,update-interval=1, 

[Script]
netflixCheck = type=generic,script-path=https://raw.githubusercontent.com/Nebulosa-Cat/Surge/main/Panel/Netflix-IP-Test/netflixCheck.js, timeout=30
//  , argument=icon1=checkmark.shield&color1=#1B813E&icon2=exclamationmark.shield&color2=#EFBB24&icon3=xmark.shield&color3=#CB1B45&icon4=exclamationmark.arrow.triangle.2.circlepath&color4=#77428D&title=Netflix 影剧版权 IP 锁检测
*/
//let params = getParams($argument)
const BASE_URL = 'https://www.netflix.com/title/'

const FILM_ID = 81215567
const AREA_TEST_FILM_ID = 80018499

;(async () => {
  let result = {
    title: "𝗡𝗲𝘁𝗳𝗹𝗶𝘅 𝗥𝗶𝗴𝗵𝘁𝘀 𝗟𝗼𝗰𝗸 𝗖𝗵𝗲𝗰𝗸",
    icon: "exclamationmark.arrow.triangle.2.circlepath",
	  'icon-color':"#77428D",
    content: '𝗖𝗵𝗲𝗰𝗸 𝗙𝗮𝗶𝗹𝗲𝗱! 𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗡𝗲𝘁𝘄𝗼𝗿𝗸',
  }
  await test(FILM_ID)
    .then((code) => {
      if (code === 'Not Found') {
        return test(AREA_TEST_FILM_ID)
      }
      result['Title'] ="𝗡𝗲𝘁𝗳𝗹𝗶𝘅 𝗥𝗶𝗴𝗵𝘁𝘀 𝗟𝗼𝗰𝗸 𝗖𝗵𝗲𝗰𝗸"
      result['icon'] = "checkmark.circle"
	    result['icon-color'] = '#1B813E'
      //result['icon'] = params.icon1
	    //result['icon-color'] = params.color1
      result['content'] = '𝗬𝗼𝘂 𝗰𝗮𝗻 𝘄𝗮𝘁𝗰𝗵 𝗙𝘂𝗹𝗹 𝗡𝗲𝘁𝗳𝗹𝗶𝘅 𝗶𝗻 ' + code.toUpperCase()
      return Promise.reject('BreakSignal')
    })
    .then((code) => {
      if (code === 'Not Found') {
        return Promise.reject('Not Available')
      }
      result['Title'] ="𝗡𝗲𝘁𝗳𝗹𝗶𝘅 𝗥𝗶𝗴𝗵𝘁𝘀 𝗟𝗼𝗰𝗸 𝗖𝗵𝗲𝗰𝗸"
      result['icon'] = "checkmark.circle.trianglebadge.exclamationmark"
	    result['icon-color'] = "#EFBB24"
      //result['icon'] = params.icon2
	    //result['icon-color'] = params.color2
      result['content'] = '𝗬𝗼𝘂 𝗰𝗮𝗻 𝗼𝗻𝗹𝘆 𝘄𝗮𝘁𝗰𝗵 𝗡𝗲𝘁𝗳𝗹𝗶𝘅 𝗢𝗿𝗶𝗴𝗶𝗻𝗮𝗹 𝗦𝗲𝗿𝗶𝗲𝘀 𝗶𝗻 ' + code.toUpperCase()
      return Promise.reject('BreakSignal')
    })
    .catch((error) => {
      if (error === 'Not Available') {
        result['Title'] ="𝗡𝗲𝘁𝗳𝗹𝗶𝘅 𝗥𝗶𝗴𝗵𝘁𝘀 𝗟𝗼𝗰𝗸 𝗖𝗵𝗲𝗰𝗸"
        result['icon'] = "x.circle"
	      result['icon-color'] = "#CB1B45"
        //result['icon'] = params.icon3
	      //result['icon-color'] = params.color3
        result['content'] = '𝗡𝗲𝘁𝗳𝗹𝗶𝘅 𝗱𝗼𝗲𝘀 𝗻𝗼𝘁 𝘀𝘂𝗽𝗽𝗼𝗿𝘁 𝘁𝗵𝗶𝘀 𝗜𝗣 𝗶𝗻 ' + code.toUpperCase()
        return
      }
    })
    .finally(() => {
      $done(result)
    })
})()

function test(filmId) {
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL + filmId,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
      },
    }
    $httpClient.get(option, function (error, response, data) {
      if (error != null) {
        reject('Error')
        return
      }

      if (response.status === 403) {
        reject('Not Available')
        return
      }

      if (response.status === 404) {
        resolve('Not Found')
        return
      }

      if (response.status === 200) {
        let url = response.headers['x-originating-url']
        let region = url.split('/')[3]
        region = region.split('-')[0]
        if (region == 'title') {
          region = 'us'
        }
        resolve(region)
        return
      }

      reject('Error')
    })
  })
}

function getParams(param) {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}
