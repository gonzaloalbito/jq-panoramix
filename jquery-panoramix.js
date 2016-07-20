/**
 *	jQuery Panoramix
 *	Copyright (c) 2012 Gonzalo Albito Méndez Rey
 *	Licensed under GNU GPL 3.0 (https://www.gnu.org/licenses/gpl-3.0-standalone.html)
 *	@version	0.4
 *	@author		Gonzalo Albito Méndez Rey	<gonzalo@albito.es>
 *	@license	GPL-3.0
 */

$(document).ready(function(){
	
	//var pano = $.panoramix = { version: "1" };
	
	$.fn.panoramix = function(options){
			//Configuración inicial
			var defaults = {
					//Medidas
					width: "800",	//TODO sin usar
					height: "400",	//TODO sin usar
					margin: {
						width: 0,
						height: 0,
						oversize: false
					},
					//Control zoom
					zoom: {
						enabled: true,
						current: 100,
						min: 100,
						max: 100,
						step: 100,
						crop: false
					},
					//Control navegación
					nav: {
						enabled: true,
						step: 100
					},
					//Animación
					animation: {
						enabled: true,
						duration: 250
					},
					//Información	//TODO sin usar
					info: {
						title: "Panoramix",
						text: "Panoramix 0.1b by SouLHuNTeR"
					},
					//Composición
					image: {
						url: "panoramix/panoramix.jpg",
						path: "panoramix/panoramix",
						extension: "jpg",
						separator: "-",
						alt: "Loading"
					},
					pois: false,
					//Composición
					poiCommon: {
						x: 0,
						y: 0,
						icon: "panoramix/poi.png",
						iconW: 20,
						iconH: 20,
						label: false,
						title: false,
						content: false,
						action: false,
						zoomMin: false,
						zoomMax: false
					},
					dummy: false
				};
			options = $.extend({}, defaults, options);
			
			this.each(function(i, _element){
				var element = $(_element);
				var panoramix = new Panoramix(options, element);
				//panoramix.init();
			});
			
			return this;
		};
		
	function Panoramix(options, element){
			var settings = options;
			var parent = element;
			var space = null;
			var pano = null;
			var image = null;
			var table = null;
			var pois = null;
			var poisDiv = null;
			var control = null;
			var zoomControl = null;
			var navControl = null;
			var zoom = settings.zoom.current;
			var locked = false;
			
			
			var loadImage = function(url, imgClass){
					var img = null;
					if(url){
						var cls = imgClass? "class=\""+imgClass+"\"" : "";
						img = $("<img "+cls+" src=\""+url+"\" alt=\""+settings.image.alt+"\"/>");
						img.load(function(){
								img.attr("width", img.width());
								img.attr("height", img.height());
							});
						img.srcWidth = function(){
								return parseInt(this.attr("width"));
							};
						img.srcHeight = function(){
								return parseInt(this.attr("height"));
							};
					}
					return img;
				};
			
			
			var unlock = function(){
					locked = false;
				};
			
			
			var unlockAndUpdate = function(){
					unlock();
					updateTableImages();
				};
			
			
			var setPosition = function(x, y, animated){
					animated = settings.animation.enabled && animated;
					if(!locked){
						locked = animated? true : false;
						if(x == undefined){
							x = (space.width()-pano.width())/2;
						}
						else if(x < 0){
							x = 0;
						}
						else if(x > (space.width()-pano.width())){
							x = space.width()-pano.width();
						}
						if(y == undefined){
							y = (space.height()-pano.height())/2;
						}
						else if(y < 0){
							y = 0;
						}
						else if(y > (space.height()-pano.height())){
							y = space.height()-pano.height();
						}
						if(animated){
							pano.animate({"left": x+"px", "top": y+"px"}, {duration: settings.animation.duration, queue: false, complete: unlockAndUpdate});
						}
						else{
							pano.css({left: x, top: y});
							updateTableImages();
						}
					}
				};
			
			
			var addPosition = function(x, y){
					x += pano.position().left;
					y += pano.position().top;
					setPosition(x, y, settings.animation.enabled);
				};
			
			
			var setZoom = function(newZoom){
					newZoom = parseInt(newZoom);
					if(newZoom < settings.zoom.min){
						newZoom = settings.zoom.min;
					}
					else if(newZoom > settings.zoom.max){
						newZoom = settings.zoom.max;
					}
					if(!locked && zoom!=newZoom){
						locked = settings.animation.enabled;
						zoom = newZoom;
						updateZoom(true);
					}
				};
			
			
			var addZoom = function(delta){
					setZoom(zoom+(delta*settings.zoom.step));
				};
			
			
			var updateTable = function(){
					table.html("");
					var step = zoom;
					var size = settings.zoom.crop;
					if(size && size>0 && step>settings.zoom.current && step<=settings.zoom.max){
						var width = image.width();
						var height = image.height();
						table.css("top", -height);
						var path = settings.image.path;
						var ext = settings.image.extension;
						var sep = settings.image.separator;
						
						var x, y, w, h = 0;
						var xCount = parseInt(width/size);
						var xRest = parseInt(width%size);
						var yCount = parseInt(height/size);
						var yRest = parseInt(height%size);
						for(y=0; (y<yCount || (y==yCount && yRest>0)); y++){
							h = (y==yCount)? yRest : size;
							var tr = $("<tr></tr>");
							for(x=0; (x<xCount || (x==xCount && xRest>0)); x++){
								w = (x==xCount)? xRest : size;
								var td = $("<td style=\"width:"+w+"px; height:"+h+"px\"></tr>");
								td.attr("src", path+"/"+step+"/"+x+sep+y+"."+ext);
								td.appendTo(tr);
							}
							tr.appendTo(table);
						}
						updateTableImages();
					}
				};
			
			
			var updateTableImages = function(){
					var children = table.find("td").filter("[src]");
					var pt = parent.offset().top;
					var pl = parent.offset().left;
					var pb = pt+parent.height();
					var pr = pl+parent.width();
					children.each(function(i){
							var td = $(this);
							if(td.html()==""){
								var t = td.offset().top;
								var l = td.offset().left;
								var b = t+td.height();
								var r = l+td.width();
								if(pt<b && pl<r && pb>t && pr>l){
									var img = loadImage(td.attr("src"));
									td.html(img);
								}
							}
						});
				};
			
			
			var updatePois = function(animated){
					if(pois && pois.length!=undefined){
						for(var i=0; i<pois.length; i++){
							poi = pois[i];
							scale = zoom/100;
							var x = scale*poi.x();
							var y = scale*poi.y();
							var disp = poi.visible(zoom)? "block" : "none";
							if(animated){
								poi.animate({left: x+"px", top: y+"px"}, {duration: settings.animation.duration, queue: false});
								poi.css({display: disp});
							}
							else{
								poi.css({left: x+"px", top: y+"px", display: disp});
							}
						}
					}
				};
			
			
			//TODO
			var updateMeasures = function(animated){
					//Parent measures
					var pw = parent.width();
					var ph = parent.height();
					
					//Margin measures
					var mw = settings.margin.width;
					var mh = settings.margin.height;
					
					//Pano original measures
					var w0 = pano.width();
					var h0 = pano.height();
					var x0 = pano.position().left;
					var y0 = pano.position().top;
					var w, h, x, y;		//Pano target vars
					
					//Space original measures
					var sw0 = space.width();
					var sh0 = space.height();
					var sw, sh, sx, sy;	//Space target vars
					
					//Pano measure operations
					var scale = zoom/100;
					w = scale*image.srcWidth();
					h = scale*image.srcHeight();
					
					//Space measure operations
					sw = (2*w)-pw+mw;
					sh = (2*h)-ph+mh;
					if(sw<pw && settings.margin.oversize){
						sw = pw;
					}
					if(sw<w){
						sw=w+mw;
					}
					if(sh<ph && settings.margin.oversize){
						sh = ph;
					}
					if(sh<h){
						sh=h+mh;
					}
					
					//Space position operations
					sx = (pw-sw)/2;
					sy = (ph-sh)/2;
	
					var rx = ((sw0/2)-x0)/w0;
					var ry = ((sh0/2)-y0)/h0;
					
					//Pano location.
					x = x0+(((sw-sw0)/2)-((w-w0)*rx));
					y = y0+(((sh-sh0)/2)-((h-h0)*ry));
					if(x<0){
						x = 0;
					}
					else if(x>(sw-w)){
						x = sw-w;
					}
					if(y<0){
						y = 0;
					}
					else if(y>(sh-h)){
						y = sh-h;
					}
					
					//Apply values.
					space.width(sw);
					space.height(sh);
					if(animated){
						var t = settings.animation.duration;
						space.animate({"left": sx+"px", "top": sy+"px"}, {duration: t, queue: false});
						pano.animate({"width": w+"px", "height": h+"px", "left": x+"px", "top": y+"px"}, {duration: t, queue: false});
						image.animate({"width": w+"px", "height": h+"px"}, {duration: t, queue: false, complete: unlock});
					}
					else{
								space.css({
									left : sx,
									top : sy
								});
								pano.width(w);
								pano.height(h);
								pano.css({
									left : x,
									top : y
								});
								image.width(w);
								image.height(h);
							}
				};
			
			
			var updateZoomControl = function(animated){		//TODO Image-based zoom
					var children = zoomControl.find("td");
					children.css("font-weight", "normal");
					children.filter("[name="+zoom+"]").css("font-weight", "bolder");
				};
			
			
			var updateZoom = function(animated){
					animated = settings.animation.enabled && animated;
					updateMeasures(animated);
					updatePois(animated);
					updateZoomControl(animated);
					if(animated){
						table.html("");
						setTimeout(updateTable, settings.animation.duration);
					}
					else{
						updateTable();
					}
				};
				
			
			var fillPois = function(){
					var poisList = settings.pois;
					if(poisList && poisList.length!=undefined){
						pois = new Array(poisList.length);
						var poiCom = settings.poiCommon;
						for(var i=0; i<poisList.length; i++){
							poiItem = poisList[i];
							poiItem = $.extend({}, poiCom, poiItem);
							pois[i] = buildPoi(poiItem);
						}
					}
				};
			
			
			var buildPoi = function(poiItem){
					var w = poiItem.iconW;
					var h = poiItem.iconH;
					var click = poiItem.action? "onClick=\""+poiItem.action+"\" style=\"cursor: pointer\"" : "";
					var poi = $("<div class=\"poi\" "+click+"></div>");
					var content = $("<div class=\"poiContent\">"+(poiItem.content?poiItem.content:"")+"</div>");
					var img = $("<img src=\""+poiItem.icon+"\" alt=\""+poiItem.label+"\"/>");
					var icon = $("<div class=\"poiIcon\"></div>");
					icon.css({left: (-w/2)+"px", top: (-h/2)+"px", width: w+"px", height: h+"px", background: "top fixed no-repeat url('"+poiItem.icon+"')"});
					/*poi.click(function(){	//TODO Implement?
							var tmp = $(this).find(".poiContent");
							var over = tmp.css("overflow")=="hidden"?"visible":"hidden";
							tmp.css({overflow: over});
						});*/
					
					img.appendTo(icon);
					content.appendTo(poi);
					icon.appendTo(poi);
					poi.ready(function(){
							poi.attr("x", poiItem.x);
							poi.attr("y", poiItem.y);
							poi.attr("w", w);
							poi.attr("h", h);
							poi.attr("zoommin", poiItem.zoomMin);
							poi.attr("zoommax", poiItem.zoomMax);
						});
					poi.x = function(){
							return parseInt(this.attr("x"));
						};
					poi.y = function(){
							return parseInt(this.attr("y"));
						};
					poi.w = function(){
							return parseInt(this.attr("w"));
						};
					poi.h = function(){
							return parseInt(this.attr("h"));
						};
					poi.zoomMin = function(){
							return parseInt(this.attr("zoommin"));
						};
					poi.zoomMax = function(){
							return parseInt(this.attr("zoommax"));
						};
					poi.visible = function(zoom){
							var min = this.attr("zoommin");
							var max = this.attr("zoommax");
							return (!min || min=="false" || zoom>=parseInt(min)) && (!max || max=="false" || zoom<=parseInt(max));
						};
					return poi;
				};
			
			
			var buildPois = function(){
					poisDiv = $("<div class=\"pois\"></div>");
					fillPois();
					if(pois && pois.length!=undefined){
						for(var i=0; i<pois.length; i++){
							pois[i].appendTo(poisDiv);
						}
					}
					poisDiv.ready(function(){
							updatePois();
						});
				};
				
			var buildNavControl = function(){	//TODO Image-based nav
					if(settings.nav.enabled)
					{
						navControl = $("<table class=\"panoramixNav\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"></table>");
						var row1 = $("<tr></tr>");
						var row2 = $("<tr></tr>");
						var row3 = $("<tr></tr>");
						
						var upLeft = $("<td>UL</td>");
						var up = $("<td>UP</td>");
						var upRight = $("<td>UR</td>");
						var left = $("<td>LE</td>");
						var center = $("<td>CE</td>");
						var right = $("<td>RI</td>");
						var downLeft = $("<td>DL</td>");
						var down = $("<td>DO</td>");
						var downRight = $("<td>DL</td>");
						upLeft.click(function(){
								addPosition(settings.nav.step, settings.nav.step);
							});
						up.click(function(){
								addPosition(0, settings.nav.step);
							});
						upRight.click(function(){
								addPosition(-settings.nav.step, settings.nav.step);
							});
						left.click(function(){
								addPosition(settings.nav.step, 0);
							});
						center.click(function(){
								setPosition(undefined, undefined, true);
							});
						right.click(function(){
								addPosition(-settings.nav.step, 0);
							});
						downLeft.click(function(){
								addPosition(settings.nav.step, -settings.nav.step);
							});
						down.click(function(){
								addPosition(0, -settings.nav.step);
							});
						downRight.click(function(){
								addPosition(-settings.nav.step, -settings.nav.step);
							});
						upLeft.appendTo(row1);
						up.appendTo(row1);
						upRight.appendTo(row1);
						left.appendTo(row2);
						center.appendTo(row2);
						right.appendTo(row2);
						downLeft.appendTo(row3);
						down.appendTo(row3);
						downRight.appendTo(row3);
						row1.appendTo(navControl);
						row2.appendTo(navControl);
						row3.appendTo(navControl);
					}
				};
			
			
			var buildZoomControl = function(){	//TODO Image-based zoom
					if(settings.zoom.enabled)
					{
						zoomControl = $("<table class=\"panoramixZoom\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"></table>");
						var file = $("<tr></tr>");
						var fileTmp = file.clone();
						var minus = $("<td name=\"minus\">-</td>");
						minus.click(function(){
								addZoom(-1);
							});
						minus.appendTo(fileTmp);
						fileTmp.appendTo(zoomControl);
						for(var i=settings.zoom.min; i<=settings.zoom.max; i+=settings.zoom.step)
						{
							fileTmp = file.clone();
							var step = $("<td name=\""+i+"\">"+i+"</td>");
							step.click(function(){
									setZoom($(this).attr("name"));
								});
							step.appendTo(fileTmp);
							fileTmp.appendTo(zoomControl);
						}
						fileTmp = file.clone();
						var plus = $("<td name=\"plus\">+</td>");
						plus.click(function(){
								addZoom(1);
							});
						plus.appendTo(fileTmp);
						fileTmp.appendTo(zoomControl);
					}
				};
			
			
			var buildControl = function(){
					control = $("<div class=\"panoramixCtr\"/></div>");
					buildNavControl();
					buildZoomControl();
					control.ready(function(){
						var l = (navControl.width()-zoomControl.width())/2;
						zoomControl.css({left: l});
					});
					navControl.appendTo(control);
					zoomControl.appendTo(control);
					control.appendTo(parent);
				};
			
			
			var buildPano = function(){
					image = loadImage(settings.image.url, "panoramix");
					table = $("<table class=\"panoramix\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"></table>");
					pano = $("<div class=\"panoramix\"/></div>");
					space = $("<div class=\"panoramixScr\"/></div>");
					buildPois();
					
					image.appendTo(pano);
					poisDiv.appendTo(pano);
					table.appendTo(pano);
					pano.appendTo(space);
					space.appendTo(parent);
				};
			
			
			var build = function(){
					buildControl();
					buildPano();
				};
			
			
			var show = function(){
					updateZoom();
					setPosition();
				};
				
			var init = function(){
					build();
					
					pano.draggable({
							containment: "parent",
							cursor: "move",
							stop: function(event, ui){
									updateTableImages();
								}
						});
					
					parent.mousewheel(function(event, delta){
							addZoom(delta);
							return false;
						});

					$(window).load(function(){
							show();
						});
				};
			
			init();
			
		}
	
});











