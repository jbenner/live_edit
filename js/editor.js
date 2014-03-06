require.config({
    baseUrl: window.location.protocol + "//" + window.location.host
        + window.location.pathname.split("/").slice(0, -1).join("/"),
    paths: {
        ace: "js/ace"
    }
});

require(['ace/ace'], function(ace) {
	window.editor = ace.edit('editor');
	editor.setTheme('ace/theme/ambiance');
	editor.setTheme('ace/theme/chrome');
	editor.setTheme('ace/theme/eclipse');
	editor.setTheme('ace/theme/github');
	editor.setTheme('ace/theme/merbivore');
	editor.setTheme('ace/theme/clouds_midnight');
	editor.setTheme('ace/theme/terminal');
	editor.setTheme('ace/theme/tomorrow_night');
	editor.setTheme('ace/theme/xcode');
	editor.setTheme('ace/theme/monokai');
	editor.getSession().setMode('ace/mode/html');
	editor.setShowPrintMargin(false);

	var net = require("ace/lib/net");
	var Emmet = require(["ace/ext/emmet"]);
	var running = false;
	var previewFrame = null;
	var previewAdjust = 20;
	var queryString = {
		raw: window.location.search.replace('?','').replace('/','').split('&')
	};

	for (var param in queryString.raw) {
		queryString[queryString.raw[param].substring(0,queryString.raw[param].indexOf('='))] = queryString.raw[param].substring(queryString.raw[param].indexOf('=') + 1);
	}

	net.loadScript("http://nightwing.github.io/emmet-core/emmet.js", function() {
    	editor.setOption("enableEmmet", true);
   	});

	var previewFrameAdjust = function() {
		previewFrame.style.height = previewFrame.contentWindow.document.body.scrollHeight + previewAdjust + 'px';
		previewFrame.style.width = previewFrame.contentWindow.document.body.scrollWidth + previewAdjust + 'px';
	};

	var previewFrameUpdate = function() {
		if (running) {
			return false;
		}
		running = true;

		if (previewFrame === null) {
			$('div.container.main').append('<iframe id="previewFrame"></iframe>');
			previewFrame = document.getElementById('previewFrame');
		}

		$('body', previewFrame.contentWindow.document).html(editor.getValue());
		previewFrameAdjust();

		running = false;
	};

	if (queryString.partial && queryString.layout) {
		$.get('/mockups/' + queryString.layout + '/' + queryString.partial, function(data) {
			editor.setValue(data);
		});
	}

	editor.on('change', function() {
		setTimeout(function() {
			previewFrameUpdate();
		}, 1000);
	});

	$('.btn-refresh').click(function() {
		location.reload();
	});

	$('#displayToggle').change(function() {
		switch ($('#displayToggle').find(':selected').val()) {
			case 'v':
				$('div.container.main').removeClass('horizontal');
				break;
			case 'h':
				$('div.container.main').addClass('horizontal');
				break;
			default:
				$('div.container.main').toggleClass('horizontal');
		}
	});

	$('#wrapToggle').change(function() {
		switch ($('#wrapToggle').find(':selected').val()) {
			case 'off':
				window.editor.getSession().setUseWrapMode(false);
				break;
			case 'auto':
				window.editor.getSession().setUseWrapMode(true);
				break;
			default:
				$('div.container.main').toggleClass('horizontal');
		}
	});

	$('#themeToggle').change(function() {
		var newTheme = 'ace/theme/' + $('#themeToggle').find(':selected').val();
		console.log(newTheme);
		editor.setTheme(newTheme);
	});

	$('#editor').removeClass('hide');
});
