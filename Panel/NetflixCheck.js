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
    title: "Netflix Rights Lock Check",
    icon: "exclamationmark.arrow.triangle.2.circlepath",
	  'icon-color':"#77428D",
    content: 'Check Failed! Please checking your Network',
  }
  await test(FILM_ID)
    .then((code) => {
      if (code === 'Not Found') {
        return test(AREA_TEST_FILM_ID)
      }
      result['Title'] ="Netflix Rights Lock Check"
      result['icon'] = "checkmark.circle"
	    result['icon-color'] = '#1B813E'
      //result['icon'] = params.icon1
	    //result['icon-color'] = params.color1
      result['content'] = 'You can watch Full Netflix \nUnlocked: ' + code.toUpperCase()
      return Promise.reject('BreakSignal')
    })
    .then((code) => {
      if (code === 'Not Found') {
        return Promise.reject('Not Available')
      }
      result['Title'] ="Netflix Rights Lock Check"
      result['icon'] = "checkmark.circle.trianglebadge.exclamationmark"
	    result['icon-color'] = "#EFBB24"
      //result['icon'] = params.icon2
	    //result['icon-color'] = params.color2
      result['content'] = 'Only watch Original Series in Netflix is supported\nUnlocked: ' + code.toUpperCase()
      return Promise.reject('BreakSignal')
    })
    .catch((error) => {
      if (error === 'Not Available') {
        result['Title'] ="Netflix Rights Lock Check"
        result['icon'] = "x.circle"
	      result['icon-color'] = "#CB1B45"
        //result['icon'] = params.icon3
	      //result['icon-color'] = params.color3
        result['content'] = 'Not support for this IP in Netflix'
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
