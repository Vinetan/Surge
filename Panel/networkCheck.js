/**
 * Surge 网络信息面板
 * @Nebulosa-Cat
 * 详细请见 README
 */
 const { wifi, v4, v6 } = $network;

 let cellularInfo = '';
 const carrierNames = {
   //台灣電信業者 MNC Code
   '466-11': '中華電信', '466-92': '中華電信',
   '466-01': '遠傳電信', '466-03': '遠傳電信',
   '466-97': '台灣大哥大',
   '466-89': '台灣之星',
   '466-05': '亞太電信',
   //中国电信业者 MNC Code
   '460-03': '中国电信', '460-05': '中国电信', '460-11': '中国电信',
   '460-01': '中国联通', '460-06': '中国联通', '460-09': '中国联通',
   '460-00': '中国移动', '460-02': '中国移动', '460-04': '中国移动', '460-07': '中国移动', '460-08': '中国移动',
   '460-15': '中国广电',
   '460-20': '中国铁通',
 };
 
 const radioGeneration = {
   'GPRS': '2.5G',
   'CDMA1x': '2.5G',
   'EDGE': '2.75G',
   'WCDMA': '3G',
   'HSDPA': '3.5G',
   'CDMAEVDORev0': '3.5G',
   'CDMAEVDORevA': '3.5G',
   'CDMAEVDORevB': '3.75G',
   'HSUPA': '3.75G',
   'eHRPD': '3.9G',
   'LTE': '4G',
   'NRNSA': '5G',
   'NR': '5G',
 };
 
 if (!v4.primaryAddress && !v6.primaryAddress) {
   $done({
     title: 'No Network',
     content: 'Network is not connect\nPlease check the network try again',
     icon: 'wifi.exclamationmark',
     'icon-color': '#CB1B45',
   });
 } else {
   if ($network['cellular-data']) {
     const carrierId = $network['cellular-data'].carrier;
     const radio = $network['cellular-data'].radio;
     if (carrierId && radio) {
       cellularInfo = carrierNames[carrierId] ?
         carrierNames[carrierId] + ' - ' + radioGeneration[radio] + ' (' + radio + ')' :
         '蜂窝数据 - ' + radioGeneration[radio] + ' (' + radio + ')';
     }
   }
   $httpClient.get('http://ip-api.com/json', function (error, response, data) {
     if (error) {
       $done({
         title: 'Eero',
         content: 'Can\'t get current network info\nPlease check the network try again',
         icon: 'wifi.exclamationmark',
         'icon-color': '#CB1B45',
       });
     }
 
     const info = JSON.parse(data);
     $done({
       title: wifi.ssid ? wifi.ssid : cellularInfo,
       content:
         (v4.primaryAddress ? `IPv4 : ${v4.primaryAddress} \n` : '') +
         (v6.primaryAddress ? `IPv6 : ${v6.primaryAddress}\n` : '') +
         (v4.primaryRouter && wifi.ssid ? `Router IPv4 : ${v4.primaryRouter}\n` : '') +
         (v6.primaryRouter && wifi.ssid ? `Router IPv6 : ${v6.primaryRouter}\n` : '') +
         `Foreign IP : ${info.query}\n` +
         `ISP : ${info.isp}\n` +
         `Region : ${getFlagEmoji(info.countryCode)} - ${info.city
         }`,
       icon: wifi.ssid ? 'wifi.circle' : 'antenna.radiowaves.left.and.right.circle',
       'icon-color': wifi.ssid ? '#007aff' : '#1B813E',
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