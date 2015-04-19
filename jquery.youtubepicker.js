;(function($){
	
	var defaults = {
		'prefix' : 'youtubepicker',
		'minChar' : 3,
		'searchDelay' : 1000,
		'channel' : '',
		'preview' : true,
		'itemsPerPage' : 50,
		'offset' : {'x':0, 'y':0},
		'nanoScroller' : {'preventPageScrolling' : true},
		'cloneField' : true,
		'language' : {
			'buttons' : {
				'preview' : 'Preview',
				'select' : 'Select',
				'close' : '&times;' 
			},
			'labels' : {
				'views' : 'Views',
				'noRecords' : 'No records'
			}
		}
	};

	function template(type, data){
		var html     = '';
		var prefix   = data.prefix;
		var language = data.language;
		switch(type){
			case 'panel':
			 	html = 	'<div id="'+prefix+'-'+data.id+'" class="'+prefix+'">' +
							'<div class="'+prefix+'-wrap">' +
								'<div class="'+prefix+'-results nano">' +
									'<div class="'+prefix+'-content nano-content">' +
									'</div>' +
									'<div class="'+prefix+'-no-records">'+language.labels.noRecords+'</div>' +
								'</div>' +
								'<div class="'+prefix+'-preview">' +
									'<div class="'+prefix+'-actions">' +
										'<a herf="javascript:;" class="'+prefix+'-preview-select-btn">'+language.buttons.select+'</a>' +
										'<a herf="javascript:;" class="'+prefix+'-preview-close-btn">'+language.buttons.close+'</a>' +
									'</div>' +
									'<div class="'+prefix+'-player"></div>' +
								'</div>' +
							'</div>' +
						'</div>';
				break;
			case 'item':
				html =	'<div class="'+prefix+'-item">' + 
							'<div class="'+prefix+'-thumbnail">' +
								'<p class="'+prefix+'-duration">'+data.duration.hours+':'+data.duration.minutes+':'+data.duration.minutes+'</p>' +
								'<img src="http://i.ytimg.com/vi/'+data.vid+'/default.jpg"/>' +
							'</div>' +
							'<div class="'+prefix+'-info">' +
								'<p class="'+prefix+'-title">'+data.title+'</p>' +
								'<div class="'+prefix+'-rating">' +
									'<div class="'+prefix+'-likes" style="width:'+data.likes+'%"></div>' +
								'</div>' +
								'<div class="'+prefix+'-view-count">'+data.views+' <span>'+language.labels.views+'</span></div>' +
							'</div>' +
							'<div class="'+prefix+'-actions">' +
								'<a class="'+prefix+'-preview-btn" href="javascript:;">'+language.buttons.preview+'</a>' +
								'<a class="'+prefix+'-select-btn" href="javascript:;">'+language.buttons.select+'</a>' +
							'</div>' +
						'</div>';
				break;
			case 'iframe':
				html = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+data.vid+'?autoplay=1" frameborder="0" allowfullscreen></iframe>';
				break;
		}
		return html;
	}

	function secondsToDuration(seconds){
		seconds = parseInt(seconds, 10);
		var hours   = Math.floor(seconds / 3600);
		var dv_min  = seconds % 3600;
		var minutes = Math.floor(dv_min / 60);
		seconds = Math.round(dv_min % 60);
		return {
			hours   : (hours<10 ? '0' : '') + hours,
			minutes : (minutes<10 ? '0' : '') + minutes,
			seconds : (seconds<10 ? '0' : '') + seconds
		};
	}

	function search(field, index, max, channel){
		max   = parseInt(max, 10);
		index = (max * (parseInt(index, 10)-1)) + 1;
		var term = field.val();
		var data = {
			'q' : term,
			'v' : 2,
			'format' : 5,
			'max-results' : max,
			'start-index' : index,
			'alt' : 'jsonc'
		};
		var url = 'http://gdata.youtube.com/feeds/api/' + (channel ? 'users/' + channel + '/uploads' : 'videos');
		field.trigger('loadInit', {field:field});
		$.getJSON(url, data, function(data){
			data = $.extend({}, data, {field:field, hasItems:Boolean(data.data.items)});
			field.trigger('loadComplete', data);
		})
		.fail(function(){
			field.trigger('loadError', {field:field});
		});
	}

	function populate(results){
		if(!results.field) return;
		var options = results.field.data('YPFieldData');
		var panel = $('#'+options.prefix+'-'+options.ypid);
		var content = panel.find('.'+options.prefix+'-content');
		var noRecords = panel.find('.'+options.prefix+'-no-records');
		if(!results.hasItems){
			noRecords.show();
		}else{
			var data = results.data;
			var i, d;
			noRecords.hide();
			for(i in data.items){
				if(data.items.hasOwnProperty(i)){
					d = data.items[i];
					d = {
							title : d.title,
							vid : d.id,
							views : d.viewCount,
							thumb : d.thumbnail.sqDefault,
							likes : Math.round((100 * d.likeCount) / d.ratingCount),
							prefix : options.prefix,
							language : options.language,
							duration : secondsToDuration(d.duration)
						};
					content.append(template('item', d));
					$.data(panel.find('.'+options.prefix+'-item:last')[0], 'YPItemData', d);
				}
			}
		}
		panel.find('.nano').nanoScroller();
	}

	function closePreview(panel){
		var prefix  = panel.attr('class');
		var preview = panel.find('.'+prefix+'-preview');
		if(preview.hasClass('show')){
			preview.removeClass('show');
		}
		panel.find('.'+prefix+'-player').empty();
	}

	$.fn.youtubepicker = function(options){
		var settings = $.extend({}, defaults, $.fn.youtubepicker.options, options);
		return this.each(function(){
			var field    = $(this);
			var id       = new Date().getTime();
			var index    = 1;
			var timer    = null;
			var lastTerm = '';
			var panel    = template('panel', {id:id, prefix:settings.prefix, language:settings.language});

			if(settings.cloneField){
				var clone = field.clone(true);
				field.removeAttr('name');
				clone.insertAfter(field);
				clone.hide().removeAttr('class');				
			}

			$.data(field[0], 'YPFieldData', {ypid:id, prefix:settings.prefix, language:settings.language});
			
			$(panel).insertAfter(field);
			panel = $('#'+settings.prefix+'-'+id);

			if(settings.offset.x){
				panel.css('margin-left', parseInt(settings.offset.x, 10)+'px');
			}

			if(settings.offset.y){
				panel.css('margin-top', parseInt(settings.offset.y, 10)+'px');
			}

			if($.isFunction(panel.find('.nano').nanoScroller)){
				panel.find('.nano').nanoScroller(setTimeout.nanoScroller)
					.on('scrollend', function(){
						index++;
						search(field, index, settings.itemsPerPage, settings.channel);
					});
			}

			field.on('keyup', function(){
				var _this = $(this);
				var term = _this.val();
				var content = panel.find('.'+settings.prefix+'-content');
				clearTimeout(timer);
				if(!term.length){
					content.empty();
				}else if(term.length >= settings.minChar && lastTerm !== term){
					closePreview(panel);
					timer = setTimeout(function(){
						lastTerm = term;
						search(field, index, settings.itemsPerPage, settings.channel);
						content.empty();
					}, settings.searchDelay);
				}
			})
			.on('focus', function(){
				$('.'+settings.prefix).hide();
				if(!panel.is(':visible')){
					panel.show();
				}
			})
			.on('blur', function(){
				if(!panel.is(':hover')){
					panel.hide();
				}
			})
			.on('loadComplete', function(ev, data){
				populate(data);
				panel.find('.'+settings.prefix+'-select-btn').on('click', function(){
					var data = $(this).closest('.'+settings.prefix+'-item').data('YPItemData');
					if(settings.cloneField){
						clone.val(data.vid);
						data = $.extend({}, data, {clone:clone, field:field, term:lastTerm});
					}
					field.trigger('itemSelected', data);
					panel.hide();
					closePreview(panel);
				});
				panel.find('.'+settings.prefix+'-preview-btn').on('click', function(){
					var item    = $(this).closest('.'+settings.prefix+'-item');
					var vid     = item.data('vid');
					var iframe  = template('iframe', {vid:vid});
					var preview = panel.find('.'+settings.prefix+'-preview');
					preview.find('.'+settings.prefix+'-preview-select-btn').off().click(function(){
						item.find('.'+settings.prefix+'-select-btn').click();
					});
					preview.addClass('show').show();
					panel.find('.'+settings.prefix+'-player').html(iframe);
				});
			});

			$('.'+settings.prefix+'-preview-close-btn').click(function(){
				closePreview(panel);
				return false;
			});

		});
	};

})(jQuery);