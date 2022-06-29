/*
 * Surge 网络详情面板
 * @Nebulosa-Cat
 * 详情见 README
 */
const { wifi, v4, v6 } = $network;

let cellularInfo = '';

const carrierNames = loadCarrierNames();

if (!v4.primaryAddress && !v6.primaryAddress) {
  $done({
    title: '𝗡𝗼 𝗡𝗲𝘁𝘄𝗼𝗿𝗸',
    content: '𝗡𝗲𝘁𝘄𝗼𝗿𝗸 𝗶𝘀 𝗻𝗼𝘁 𝗰𝗼𝗻𝗻𝗲𝗰𝘁\𝗻𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗲𝗰𝗸 𝘁𝗵𝗲 𝗻𝗲𝘁𝘄𝗼𝗿𝗸 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻',
    icon: 'wifi.exclamationmark',
    'icon-color': '#CB1B45',
  });
} else {
  if ($network['cellular-data']) {
    const carrierId = $network['cellular-data'].carrier;
    const radio = $network['cellular-data'].radio;
    if (carrierId && radio) {
      cellularInfo = carrierNames[carrierId] ?
        carrierNames[carrierId] + ' | ' + radioGeneration[radio] + ' - ' + radio :
        'Cellular Data | ' + radioGeneration[radio] + ' - ' + radio;
    }
  }
  $httpClient.get('http://ip-api.com/json', function (error, response, data) {
    if (error) {
      $done({
        title: '𝗘𝗿𝗿𝗼𝗿',
        content: '𝗖𝗮𝗻\'𝘁 𝗴𝗲𝘁 𝗰𝘂𝗿𝗿𝗲𝗻𝘁 𝗻𝗲𝘁𝘄𝗼𝗿𝗸 𝗶𝗻𝗳𝗼\𝗻𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗲𝗰𝗸 𝘁𝗵𝗲 𝗻𝗲𝘁𝘄𝗼𝗿𝗸 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻',
        icon: 'wifi.exclamationmark',
        'icon-color': '#CB1B45',
      });
    }

    const info = JSON.parse(data);
    $done({
      title: '𝗜𝗣𝘃𝟲 𝗖𝗵𝗲𝗰𝗸',
      content:
        (v6.primaryAddress ? `𝗜𝗣𝘃𝟲: ${v6.primaryAddress}` : '𝗧𝗵𝗶𝘀 𝗡𝗲𝘁𝘄𝗼𝗿𝗸 𝗗𝗼𝗲𝘀 𝗡𝗼𝘁 𝗦𝘂𝗽𝗽𝗼𝗿𝘁 𝗜𝗣𝘃𝟲'),
      icon: 'network',
      'icon-color': wifi.ssid ? '#007aff' : '#1B813E',
    });
  });
}