// 此脚本仅适用于iOS 14天气应用程序
// 开发于Hackl0us（https://github.com/hackl0us）

// 步：前往 https://aqicn.org/data-platform/token/ 注册账户，将申请的 API 令牌填入下方
const aqicnToken = '4da495b357eb88a0265db3a6ad663ca37a985c63'

// 步 2：参考下方的配置片段，并中添加代理工具配置文件的对应配置。注意：脚本路径后应替换为脚本路径，添加apicnToken值
/*
	[脚本]
	iOS14美标空气质量=类型=http-response，pattern=https://weather-data.apple.com/v1/weather/[\w-]+/-?[0-9]+\.[0-9]+/-?[0-9]+\.[0-9]+\?,requires-body=true,script-path=path/to/iOS14_Weather_AQI_US.js
	[MITM]
	hostname = weather-data.apple.com
*/

const AirQualityStandard = {
	CN：“HJ6332012.2111”，
	美国：“EPA_NowCast.2111”
}

const AirQualityLevel = {
	好：1，
	中度：2，
	不健康敏感：3，
	不健康：4，
	非常不健康：5，
	危险：6
}

const Milliseconds转换=1000
const coordRegex = /https:\/\/weather-data\.apple\.com\/v1\/weather\/([\w-]+)\/(-?[0-9]+\.[0-9]+)\/(-?[0-9]+\.[0-9]+)\?/
const [_, language, lat, lng] = $request.url.match(coordRegex)


函数分类AirQualityLevel(aqiIndex) {
	if (aqiIndex >= 0 && aqiIndex <= 50) {
		返回AirQualityLevel.GOOD；
	}其他如果（aqiIndex >= 51 &&aqiIndex <= 100）{
		返回AirQualityLevel.MODERATE；
	}其他如果（aqiIndex >= 101 &&aqiIndex <= 150）{
		返回AirQualityLevel.UNHEALTHY_FOR_SENSITIVE；
	}其他如果（aqiIndex >= 151 &&aqiIndex <= 200）{
		返回AirQualityLevel.UNHEALTHY；
	}其他如果（aqiIndex >= 201 && aqiIndex <= 300）{
		返回AirQualityLevel.VERY_UNHEALTHY；
	}其他如果（aqiIndex >= 301）{
		返回AirQualityLevel.HAZARDOUS；
	}
}

函数 modifyWeatherResp(weatherRespBody, aqicnRespBody) {
	let weatherRespJson = JSON.parse(weatherRespBody)
	let aqicnRespJson = JSON.parse(aqicnRespBody).data
	weatherRespJson.air_quality = constructAirQuailityNode(aqicnRespJson)
	返回JSON.stringify(weatherRespJson)
}

函数getPrimaryPollutant(pollutant) {
	开关（污染物）{
		案例“co”：
			返回“CO2”；
		案例“so2”：
			返回“SO2”；
		案例“no2”：
			返回“NO2”；
		案例“pm25”：
			返回“PM2.5”；
		案例“pm10”：
			返回“PM10”；
		案例“o3”：
			返回“臭氧”；
		默认值：
			返回“其他”；
	}
}

函数构造AirQuailityNode(aqicnData) {
	let airQualityNode = { "source": "", "learnMoreURL": "", "isSignificant": true, "airQualityCategoryIndex": true, "airQualityCategoryIndex": 0, "airQualityIndex": 0, "pollutants": { "CO": { "name": "CO": "name": "CO", "amount": 0, "μg/m3" }, "SO2": { "name": "SO2", "amount": 0, "unit": "μg/m3" }, "NO2": { "name": 0, "unit": "μg/m3" }, "PM2.5": { "name": "amount": 0, "单位": "μg/m3"}
	const aqicnIndex = aqicnData.aqi
	airQualityNode.source = aqicnData.city.name
	airQualityNode.learnMoreURL = aqicnData.city.url + '/cn/m'

	airQualityNode.airQualityCategoryIndex = classifyAirQualityLevel(aqicnIndex)
	airQualityNode.airQualityScale = AirQualityStandard.US
	airQualityNode.airQualityIndex = aqicnIndex
	airQualityNode.primaryPollutant = getPrimaryPollutant(aqicnData.dominentpol)

	airQualityNode.pollutants.CO.amount = aqicnData.iaqi.co?.v || -1
	airQualityNode.pollutants.SO2.amount = aqicnData.iaqi.so2?.v || -1
	airQualityNode.pollutants.NO2.amount = aqicnData.iaqi.no2?.v || -1
	airQualityNode.pollutants["PM2.5"].amount = aqicnData.iaqi.pm25?.v || -1
	airQualityNode.pollutants.OZONE.amount = aqicnData.iaqi.o3?.v || -1
	airQualityNode.pollutants.PM10.amount = aqicnData.iaqi.pm10?.v || -1

	airQualityNode.metadata.latitude = aqicnData.city.geo[0]
	airQualityNode.metadata.longitude = aqicnData.city.geo[1]
	airQualityNode.metadata.reported_time = timeConversion(new Date(aqicnData.time.iso), 'remain')
	airQualityNode.metadata.read_time = timeConversion(new Date(), 'remain')
	airQualityNode.metadata.expire_time = timeConversion（新日期（aqicnData.time.iso），“add-1h-floor”）
	airQualityNode.metadata.language = 语言

	返回airQualityNode
}

函数时间转换（时间，动作）{
	开关（操作）{
		案例“剩余”：
			time.setMilliseconds（0）；
			休息；
		案例“add-1h-floor”：
			time.setHours(time.getHours() + 1);
			time.setMinutes（0、0、0）；
			休息；
		默认值：
			console.log（“转换操作的时间错误”。）；
	}
	return time.getTime() / MillisecondsConversion；
}


$httpClient.get(`https://api.waqi.info/feed/geo:${lat};${lng}/?token=${aqicnToken}`，函数（错误，_response，数据）{
	如果（错误）{
		let body = $response.body
		$done({正文})
	}其他{
		let body = modifyWeatherResp($response.body, data)
		$done({正文})
	}
}）；
