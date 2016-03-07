;(function($){
	
	var endpoint = 'https://www.googleapis.com/youtube/v3/';
	
	var defaults = {
		'prefix': 'youtubepicker',
		'minChar': 3,
		'searchDelay': 2,
		'preview': true,
		'cloneField': true,
		'offset': {
			'x': 0, 
			'y': 0
		},
		'nanoScroller': {
			'preventPageScrolling': true
		},
		'language': {
			'buttons': {
				'preview': 'Preview',
				'select': 'Select',
				'close': '&times;' 
			},
			'labels': {
				'views': 'Views',
				'noRecords': 'No records',
				'loading': 'Loading...'
			}
		}
	};

	var searchParams = {
		'channelId': '',
		'channelType': '',
		'eventType': '',
		'location': '',
		'locationRadius': '',
		'maxResults': 50,
		'order': 'relevance',
		'publishedAfter': '',
		'publishedBefore': '',
		'regionCode': '',
		'relatedVideoId': '',
		'relevanceLanguage': '',
		'safeSearch': 'none',
		'topicId': '',
		'type': 'video',
		'videoCaption': 'any',
		'videoCategoryId': '',
		'videoDefinition': 'any',
		'videoDimension': 'any',
		'videoDuration': 'any',
		'videoEmbeddable': 'any',
		'videoLicense': 'any',
		'videoSyndicated': 'any',
		'videoType': 'any',
	};

	var search = function(credentials, params){
		var _this = this;
		var results;
		var pageToken;
		var args;
		var getCredentials = function(key){
			key = key||'API_KEY';
			return typeof credentials === 'object' && credentials.hasOwnProperty(key) ? credentials[key] : false;
		};
		var getParams = function() {
			var tmp = { 
				'key': getCredentials(),
				'part': 'snippet',
				'pageToken': pageToken||'',
				'q': args && args.hasOwnProperty('query') ? args.query : ''
			};
			var p;
			for(p in searchParams){
				if(searchParams.hasOwnProperty(p) && params.hasOwnProperty(p) && params[p].toString().length){
					tmp[p] = params[p];
				}
			}
			return ( params = tmp );
		};
		this.doSearch = function() {
			if(arguments.length){
				args = $.extend({}, {query:'', onLoadInit:false, onLoadComplete:false, onLoadError:false}, arguments[0]);
				if(args.query.length && getCredentials()){					
					var _this = this;
					var url   = endpoint + 'search';
					results   = false;
					getParams();
					if($.isFunction(args.onLoadInit)){
						args.onLoadInit.call(this, {params:params, url:url});
					}
					$.getJSON(url, params, function(data){
						results = data;
						if($.isFunction(args.onLoadComplete)){
							args.onLoadComplete.call(_this, data);
						}
					})
					.fail(function(data){
						if($.isFunction(args.onLoadError)){
							args.onLoadError.call(_this, data);
						}
					});
				}
			}
			return this;
		};
		var page = function(direction){
			if(results && results.hasOwnProperty(direction)){
				pageToken = results[direction];
				return _this.doSearch(args);			
			}
			return false;
		};
		this.nextPage = function(){
			return page('nextPageToken');
		};
		this.prevPage = function(){
			return page('prevPageToken');
		};
		return this;
	};

	var utils = function(id, settings){
		var _this     = this;
		var prefix    = settings.prefix;
		var language  = settings.language;
		this.template = function(type, data) {
			var html    = '';
			var preview = '';
			switch(type){
				case 'panel':
					if(settings.preview) {
						preview = 	'<div class="'+prefix+'-preview">' +
										'<div class="'+prefix+'-actions">' +
											'<a herf="javascript:;" class="'+prefix+'-preview-select-btn">'+language.buttons.select+'</a>' +
											'<a herf="javascript:;" class="'+prefix+'-preview-close-btn">'+language.buttons.close+'</a>' +
										'</div>' +
										'<div class="'+prefix+'-player"></div>' +
									'</div>';
					}
				 	
				 	html = 	'<div id="'+prefix+'-'+id+'" class="'+prefix+' '+prefix+'-panel">' +
								'<div class="'+prefix+'-wrap">' +
									'<div class="'+prefix+'-results nano">' +
										'<div class="'+prefix+'-content nano-content"></div>' +
										'<div class="'+prefix+'-loader">'+language.labels.loading+'</div>' +
										'<div class="'+prefix+'-no-records">'+language.labels.noRecords+'</div>' +
									'</div>' +
									preview  +
									'</div>' +
							'</div>';
					break;
				case 'item':
					if(settings.preview){
						preview = '<a class="'+prefix+'-preview-btn" href="javascript:;">'+language.buttons.preview+'</a>';
					}
					html =	'<div class="'+prefix+'-item">' + 
								'<div class="'+prefix+'-thumbnail">' +
									'<img src="'+data.thumb+'"/>' +
								'</div>' +
								'<div class="'+prefix+'-info">' +
									'<p class="'+prefix+'-title">'+data.title+'</p>' +
									'<p class="'+prefix+'-description">'+data.description+'</p>' +
								'</div>' +
								'<div class="'+prefix+'-actions">' +
									preview +
									'<a class="'+prefix+'-select-btn" href="javascript:;">'+language.buttons.select+'</a>' +
								'</div>' +
							'</div>';
					break;
				case 'player':
					html = '<embed width="100%" height="100%" src="http://youtube.com/v/'+data.vid +
							'&autoplay=1&showsearch=0&iv_load_policy=3&fs=0&rel=0&loop=0"' +
							' type="application/x-shockwave-flash"></embed>';
					break;
			}
			return html;
		};
		this.populate = function(results){
			var panel     = $('#'+settings.prefix+'-'+id);
			var content   = panel.find('.'+settings.prefix+'-content');
			var noRecords = panel.find('.'+settings.prefix+'-no-records');
			if(!results.hasItems){
				noRecords.show();
			}else{
				noRecords.hide();
				var i;
				var d;
				for(i in results.items){
					if(results.items.hasOwnProperty(i)){
						d = results.items[i];
						d = {
							vid 		: d.id.videoId,
							title 		: d.snippet.title,
							description : d.snippet.description,
							thumb 		: d.snippet.thumbnails.default.url
						};
						content.append(_this.template('item', d));
						$.data(panel.find('.'+prefix+'-item:last')[0], 'YPItemData', d);
					}
				}
			}
			this.preview(panel).click();
			panel.find('.nano').nanoScroller();
		};
		this.select = function(panel, field, clone) {
			panel.find('.'+prefix+'-select-btn').off().on('click', function(){
				var data = $(this).closest('.'+prefix+'-item').data('YPItemData');
				if(settings.cloneField){
					clone.val(data.vid);
					data = $.extend({}, data, {clone:clone, term:field.val()});
				}
				field.trigger('itemSelected', data);
				panel.hide();
			});
		};
		this.preview = function(panel){
			var that = this;
			var self = that.preview;
			
			self.close = function() {
				var preview = panel.find('.'+prefix+'-preview');
				if(preview.hasClass('show')){
					preview.removeClass('show');
				}
				panel.find('.'+prefix+'-player').empty();
				panel.find('.'+prefix+'-preview-btn.current').removeClass('current');
			};
			
			self.click = function() {
				panel.find('.'+prefix+'-preview-btn').off().on('click', function(){
					var data = $(this).closest('.'+prefix+'-item').data('YPItemData');
					var player = panel.find('.'+prefix+'-preview').addClass('show').find('.'+prefix+'-player');
					player.html(that.template('player', data));
					panel.find('.'+prefix+'-preview-btn').removeClass('current');
					$(this).addClass('current');
				});
			};

			panel.find('.'+prefix+'-preview-close-btn').click(function(){
				self.close();
				return;
			});
			
			panel.find('.'+prefix+'-preview-select-btn').click(function(){
				panel.find('.'+prefix+'-preview-btn.current').parent().find('.'+prefix+'-select-btn').click();
				self.close();
				return;
			});
			
			return self;
		};
		return this;
	};
	
	$.fn.youtubepicker = function(credentials, options){
		var settings = $.extend({}, defaults, options);
		var _search  = new search(credentials, settings);
		
		if(credentials && credentials.hasOwnProperty('API_KEY')){
			return this.each(function(){
				var timer    = null;
				var clone    = null;
				var field    = $(this);
				var id       = new Date().getTime();
				var lastTerm = '';
				var _utils = new utils(id, settings);
				
				if(settings.cloneField){
					clone = field.clone(true);
					field.removeAttr('name');
					clone.insertAfter(field);
					clone.hide().removeAttr('class').removeAttr('id');
				}

				var panel = _utils.template('panel');
				$(panel).insertAfter(field);
				panel = $('#'+settings.prefix+'-'+id);

				var offset = (field.offset().left - panel.parent().offset().left);
				if(settings.offset.x){
					offset += parseInt(settings.offset.x, 10);
				}
				panel.css('margin-left', offset);

				offset = 0;
				if(settings.offset.y){
					offset += parseInt(_search.offset.y, 10);
				}
				panel.css('margin-top', offset);

				if($.isFunction(panel.find('.nano').nanoScroller)){
					panel.find('.nano')
						.nanoScroller(setTimeout.nanoScroller)
							.on('scrollend', function(){
								_search.nextPage();
							});
				}
				
				field.on('keyup', function(){
					var term = $(this).val();
					var content = panel.find('.'+settings.prefix+'-content');
					_utils.preview(panel).close();
					clearTimeout(timer);
					if(!term.length){
						content.empty();
					}else if(term.length >= settings.minChar && lastTerm !== term){
						timer = setTimeout(function(){
							lastTerm = term;
							content.empty();
							_search.doSearch({
								query: term, 
								onLoadInit : function(){
									panel.addClass('loading');
									field.trigger('loadInit', {term:term});
								},
								onLoadComplete : function(data){
									data = $.extend({}, data, {hasItems:Boolean(data.items)});
									_utils.populate(data);
									field.trigger('loadComplete', data);
									_utils.select(panel, field, clone);
									panel.removeClass('loading');
								}, 
								onLoadError : function(data){
									field.trigger('loadError', data);
								}
							});
						}, (parseInt(settings.searchDelay, 10) * 1000));
					}
				})
				.on('focus', function(){
					$('.'+settings.prefix+'.panel').hide();
					if(!panel.is(':visible')){
						panel.show();
					}
				})
				.on('blur', function(){
					if(!panel.is(':hover')){
						panel.hide();
					}
				});
			});
		}
	};

})(jQuery);