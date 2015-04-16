YoutubePicker
================
Search and select videos on YouTube without leaving the page.

Dependencies
================
- [jQuery](https://jquery.com/ "jQuery")
- [nanoScroller.js](http://jamesflorentino.github.io/nanoScrollerJS/ "nanoScroller.js")

Examples
================
- [Basic usage](https://github.com/airesvsg/youtubepicker/blob/master/examples/example1.html)
```javascript
$('.my-field').youtubepicker();
```
- [Search videos from Google](https://github.com/airesvsg/youtubepicker/blob/master/examples/example2.html)
```javascript
$('.my-field').youtubepicker({channel:'Google'});
```
- [Select multiple videos](https://github.com/airesvsg/youtubepicker/blob/master/examples/example3.html)
- [Select multiple videos with sorting](https://github.com/airesvsg/youtubepicker/blob/master/examples/example4.html)

Options
================
Option | Default 
-------|---------
prefix | youtubepicker
minChar | 3 
searchDelay | 1000 
channel | &nbsp;
preview | true 
itemsPerPage | 50 
offset | {'x':0, 'y':0} 
nanoScroller | {'preventPageScrolling':true}
cloneField | true
language | 
buttons | 'buttons' : {'preview' : 'Preview', 'select' : 'Select', 'close' : '`&times;`' } 
labels | 'labels' : { 'views' : 'Views', 'noRecords' : 'No records' }

Events
================
Event | Description
------|------------
loadInit | Fired before sending data to the YouTube.
loadComplete | Fired when you receive the search data.
loadError | Fired if you have a trouble.
itemSelected | Fired when you select some video.

####How to use
```javascript
$('.my-field').youtubepicker()
  .on('itemSelected', function(ev, data){
    alert(data.vid + ' : ' + data.title);
  })
  .on('loadError', function(ev, data){
    alert('Error');
  });
```