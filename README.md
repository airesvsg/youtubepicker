YouTubePicker
================
Search and select videos on YouTube without leaving the page.

![YouTubePicker](http://www.airesgoncalves.com.br/youtubepicker/youtubepicker-v2.png)

Dependencies
================
- [jQuery](https://jquery.com/ "jQuery")
- [nanoScroller.js](http://jamesflorentino.github.io/nanoScrollerJS/ "nanoScroller.js")

Examples
================
- [Basic usage](https://github.com/airesvsg/youtubepicker/blob/master/examples/example1.html)
- [Search videos from Google](https://github.com/airesvsg/youtubepicker/blob/master/examples/example2.html)
- [Select multiple videos](https://github.com/airesvsg/youtubepicker/blob/master/examples/example3.html)
- [Select multiple videos with sorting](https://github.com/airesvsg/youtubepicker/blob/master/examples/example4.html)

Credentials
================
- [How to obtain the api key](https://developers.google.com/youtube/v3/getting-started)

Key 	| Value
--------|--------
API_KEY | my-api-key

Options
================
```JSON
{
	"prefix": "youtubepicker",
	"minChar": 3,
	"searchDelay": 2,
	"preview": true,
	"cloneField": true,
	"offset": {
		"x":0, 
		"y":0
	},
	"nanoScroller": {
		"preventPageScrolling":true
	},
	"language": {
		"buttons": {
			"preview":"Preview", 
			"select":"Select", 
			"close":"&times;"
		},
		"labels": {
			"views":"Views", 
			"noRecords":"No records", 
			"loading":"Loading..."
		}
	}
}
```

Options - Search parameters
================
- [Click to see documentation explaining each parameter](https://developers.google.com/youtube/v3/docs/search/list)

```JSON
{
	"channelId": "",
	"channelType": "",
	"eventType": "",
	"location": "",
	"locationRadius": "",
	"maxResults": "50",
	"order": "relevance",
	"publishedAfter": "",
	"publishedBefore": "",
	"regionCode": "",
	"relatedVideoId": "",	
	"safeSearch": "none",
	"topicId": "",
	"type": "video",
	"videoCaption": "any",
	"videoCategoryId": "",
	"videoDefinition": "any",
	"videoDimension": "any",
	"videoDuration": "any",
	"videoEmbeddable": "any",
	"videoLicense": "any",
	"videoSyndicated": "any",
	"videoType": "any"	
}
```

Events
================
Event | Description
------|------------
loadInit 		| Fired before sending data to the YouTube.
loadComplete 	| Fired when you receive the search data.
loadError 		| Fired if you have a trouble.
itemSelected 	| Fired when you select some video.

#### How to use
```javascript
var credentials = {
	"API_KEY": "my-api-key"
};

var options = {
	"maxResults": 25
};

$('.my-field').youtubepicker(credentials, options)
  .on('itemSelected', function(ev, data){
    alert(data.vid + ' : ' + data.title);
  })
  .on('loadError', function(ev, data){
    alert('Error');
  });
```
