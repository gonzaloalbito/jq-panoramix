/**
 *	jQuery Panoramix: Demo init script
 *	Copyright (c) 2012 Gonzalo Albito Méndez Rey
 *	Licensed under GNU GPL 3.0 (https://www.gnu.org/licenses/gpl-3.0-standalone.html)
 *	@version	0.4
 *	@author		Gonzalo Albito Méndez Rey	<gonzalo@albito.es>
 *	@license	GPL-3.0
 */

jQuery(document).ready(function(){
	var panoramix = jQuery("#panoramix").panoramix({
		width: "100%",
		height: "600px",
		margin: {
			width: 0,
			height: 0,
			oversize: false
		},
		zoom: {
			enabled: true,
			current: 100,
			min: 50,
			max: 550,
			step: 50,
			crop: 256
		},
		nav: {
			enabled: true,
			step: 100
		},
		animation: {
			enabled: true,
			duration: 250
		},
		label: {
			title: "Panoramix Demo",
			info: "Panoramix demo"
		},
		image: {
			url: "panoramix/medulas/panoramix.jpg",
			path: "panoramix/medulas",
			extension: "jpg",
			separator: "-",
			alt: "Loading"
		},
		poiCommon: {
			icon: "panoramix/poi.png",
			iconW: 20,
			iconH: 20,
		},
		pois: [
			{
				x: 1400,
				y: 400,
				label: "Test marker #1",
				title: false,
				content: "<div style=\"width: 200px; height: auto; border: thin solid blue; color: white; background: black\"><h4>Test marker</h4><p>There is another for zoom>=150</p></div>",
				action: false,
				zoomMin: 50
			},
			{
				x: 1656,
				y: 300,
				label: "Test marker #2",
				title: "GitHub",
				content: "<div style=\"width: 150px; height: auto; border: thin dotted red; color: black; background: white\">Abrir GitHub.com</div>",
				action: "window.open('https://github.com/gonzaloalbito/jq-panoramix');",
				zoomMin: 150
			}
		]
	});
});