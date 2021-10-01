/**
 * Surge 網路詳情面板
 * 本人 @Nebulosa-Cat僅翻譯為繁體中文自用
 * Net Info 面板模組原始作者 @author: Peng-YM
 * 並與另一位 聰聰大佬(@congcong) 大的節點資訊面板進行整合
 * 並且感謝Pysta大佬、野比大佬(@NobyDa)、皮樂大佬(@Hiraku)技術支援
 * 以及鴿子大佬(@zZPiglet)精簡化code
 */
/*
#!name=Network Info Panel
#!desc=網路詳情面板測試版 @Nebulosa-Cat
#!system=ios

[Panel]
NetInfoPanel=title="",content="",style=info,script-name=net-info-panel.js,update-interval=1

[Script]
net-info-panel.js=script-path=https://raw.githubusercontent.com/Vinetan/Surge/main/Panel/NetworkInfo.js,type=generic

[Host]
ip-api.com = 208.95.112.1
ipapi.co = 172.67.69.226

[Rule]
DOMAIN,ipapi.co,DIRECT
*/
const { wifi, v4, v6 } = $network;

let carrierName = '';
const carrierMap = {
  //台灣電信業者 MNC Code
   '466-11': '中華電信','466-92': '中華電信',
   '466-01': '遠傳電信','466-03': '遠傳電信',
   '466-97': '台灣大哥大',
   '466-89': '台灣之星',
   '466-05': '亞太電信',
   //中國電信業者 MNC Code
   '460-00': '中国移动','460-02': '中国移动','460-07': '中国移动',
   '460-01': '中国联通','460-06': '中国联通','460-09': '中国联通',
   '460-03': '中国电信','460-05': '中国电信','460-11': '中国电信',
   '460-20': '中国铁通',
};

if (!v4.primaryAddress && !v6.primaryAddress) {
  $done({
    title: '没有网络',
    content: '尚未连接到网络\n请检查网络设备状态后重试',
    icon: 'wifi.circle',
  });
} else {
  if (!wifi.ssid) {
    $httpClient.get('https://ipapi.co/asn', function (error, response, data) {
      if (error) {
        return;
      }
      carrierName = carrierMap[data] ? ' - ' + carrierMap[data] : '';
      getNetworkInfo();
    });
  } else {
    getNetworkInfo();
  }
}

function getNetworkInfo() {
  $httpClient.get('http://ip-api.com/json', function (error, response, data) {
    if (error) {
      $done({
        title: '发生错误',
        content: '无法获得目前网络信息\n请检查网络设备状态后重试',
        icon: 'wifi.exclamationmark',
        'icon-color': '#CB1B45',
      });
    }

    const info = JSON.parse(data);
    $done({
      title: wifi.ssid ? wifi.ssid : '蜂窝网络' + carrierName,
      content:
        (v4.primaryAddress ? `IPv4 : ${v4.primaryAddress} \n` : '') +
        (v6.primaryAddress ? `IPv6 : ${v6.primaryAddress}\n` : '') +
        (v4.primaryRouter && wifi.ssid
          ? `Router IPv4 : ${v4.primaryRouter}\n`
          : '') +
        (v6.primaryRouter && wifi.ssid
          ? `Router IPv6 : ${v6.primaryRouter}\n`
          : '') +
        `IP : ${info.query}\n` +
        `ISP : ${info.isp}\n` +
        `Location : ${getFlagEmoji(info.countryCode)} - ${info.city}`,
      icon: wifi.ssid ? 'wifi.circle' : 'antenna.radiowaves.left.and.right.circle',
      'icon-color': wifi.ssid ? '0A60FF' : '#F9BF45',
    });
  });
}

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
