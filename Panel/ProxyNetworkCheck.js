/**
* 感谢@fishingworld大佬的智慧，参考文件地址：https://github.com/fishingworld/something/blob/main/PanelScripts/net_info.js
*/
;(async () => {



  let params = getParams($argument)
  //获取根节点名
  let proxy = await httpAPI("/v1/policy_groups");
  let allGroup = [];
  for (var key in proxy){
     allGroup.push(key)
      }
  let group = params.group
  let rootName = (await httpAPI("/v1/policy_groups/select?group_name="+encodeURIComponent(group)+"")).policy;
  while(allGroup.includes(rootName)==true){
    rootName = (await httpAPI("/v1/policy_groups/select?group_name="+encodeURIComponent(rootName)+"")).policy;
  }
  
  $httpClient.get('http://ip-api.com/json', function (error, response, data) {
      const jsonData = JSON.parse(data);
      $done({
        title:rootName,
        content: `𝗢𝗿𝗴𝗮𝗻𝗶𝘇𝗮𝘁𝗶𝗼𝗻：${jsonData.org}\n` + `Location：${jsonData.country} - ${jsonData.city}\n` + `IP：${jsonData.query}\n` + `ISP：${jsonData.isp}`,
        icon: params.icon,
        "icon-color":params.color
      });
    });
  
  })();
  
  
  function httpAPI(path = "", method = "GET", body = null) {
      return new Promise((resolve) => {
          $httpAPI(method, path, body, (result) => {
              resolve(result);
          });
      });
  };
  
  function getParams(param) {
    return Object.fromEntries(
      $argument
        .split("&")
        .map((item) => item.split("="))
        .map(([k, v]) => [k, decodeURIComponent(v)])
    );
  }