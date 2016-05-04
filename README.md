YouTubePicker
================
Search and select videos on YouTube without leaving the page.

![YouTubePicker](http://www.airesgoncalves.com.br/youtubepicker/youtubepicker-v2.png)

- [Dependencies](#dependencies)
- [Options](#options)
- [Events](#events)
- [Migrate](#migrate)
- [Examples](#examples)

Dependencies
================
- [jQuery](https://jquery.com/ "jQuery")
- [nanoScroller.js](http://jamesflorentino.github.io/nanoScrollerJS/ "nanoScroller.js")

Options
================
```JSON
{
	"key": "AIzaSyAuHQVhEmD4m2AXL6TvADwZIxZjNogVRF0",
	"prefix": "youtubepicker",
	"minChar": 3,
	"searchDelay": 2,
	"preview": true,
	"cloneField": true,
	"offset": {
		"x": 0, 
		"y": 0
	},
	"language": {
		"buttons": {
			"preview": "Preview",
			"select": "Select",
			"close": "&times;" 
		},
		"labels": {
			"views": "Views",
			"noRecords": "No records",
			"loading": "Loading..."
		}
	},
	"searchParams": { 
		"maxResults": 50,
		"order": "relevance",
		"channelId": "",
		"channelType": "",
		"eventType": "",
		"location": "",
		"locationRadius": "",
		"publishedAfter": "",
		"publishedBefore": "",
		"regionCode": "",
		"relatedVideoId": "",	
		"safeSearch": "none",
		"topicId": "",
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
}
```

- [Documentation explaining each search parameter](https://developers.google.com/youtube/v3/docs/search/list)

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
$('.my-field').youtubepicker()
  .on('itemSelected', function(ev, data){
    alert(data.vid + ' : ' + data.title);
  });
```

Migrate
================
#### v1
```javascript
var credentials = { 
	'API_KEY': 'AIzaSyAuHQVhEmD4m2AXL6TvADwZIxZjNogVRF0'
};

var options = {
	'channelId': 'UCK8sQmJBp8GCxrOtXWBpyEA'
};

$('.my-field').youtubepicker(credentials, options);
```

#### v2
```javascript
var options = {
	'key': 'AIzaSyAuHQVhEmD4m2AXL6TvADwZIxZjNogVRF0',
	'searchParams': {
		'channelId': 'UCK8sQmJBp8GCxrOtXWBpyEA'
	} 
};

$('.my-field').youtubepicker(options);
```

Examples
================
- [Basic usage](https://github.com/airesvsg/youtubepicker/blob/master/examples/example1.html)
- [Search videos from Google](https://github.com/airesvsg/youtubepicker/blob/master/examples/example2.html)
- [Select multiple videos](https://github.com/airesvsg/youtubepicker/blob/master/examples/example3.html)
- [Select multiple videos with sorting](https://github.com/airesvsg/youtubepicker/blob/master/examples/example4.html)
