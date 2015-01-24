var watermark = (function() {

	var
		$work = $('#work'),
		$wm = $('#wm'), // контейнер дла ватермарка
		$bg = $('#bg'), // контейнер для исходного изображкения
		$bgImg = $('#bg__img'), // исходное изображение
		$wmImg = $('#wm__img'), // изображение ватермарк

		$opacityVal = $('#opacity-val'), // поле прозрачности
		$opacity = $('#opacity'), // 
		$xVal = $('#x-val'),
		$yVal = $('#y-val');

	$btnLeftTop = $('#lt'),
		$btnRightTop = $('#rt'),
		$btnLeftMiddle = $('#lm'),
		$btnCentMiddle = $('#cm'),
		$btnRightMiddle = $('#rm'),
		$btnLeftBottom = $('#lb'),
		$btnCentBottom = $('#cb'),
		$btnRightBottom = $('#rb'),

		$btnXPlus = $('#x-val-plus'), // кнопки изменения позиции
		$btnYPlus = $('#y-val-plus'),
		$btnXMinus = $('#x-val-minus'),
		$btnYMinus = $('#y-val-minus'),

		$btnFour = $('#but-four'), // кнопки замостить-размостить 
		$btnOne = $('#but-one'),

		$hMarginVal = $('#h-margin-val'), // инпуты полей
		$vMarginVal = $('#v-margin-val'),
		$btnHMarginPlus = $('#h-margin-plus'), // кнопки полей
		$btnHMarginMinus = $('#h-margin-minus'),
		$btnVMarginPlus = $('#v-margin-plus'),
		$btnVMarginMinus = $('#v-margin-minus'),
		$lineHMargin = $('#h-margin-line'), // красные линии
		$lineVMargin = $('#v-margin-line'),

		draggable = false,
		mode = "untile";

	var param = {
		wmWidth: 0,
		wmHeight: 0,
		bgWidth: 0,
		bgHeight: 0,
		scale: 1,
		fixedPositions: {},
		currPos: {
			left: 0,
			top: 0
		},
		currOpacity: 0.5,
		vMargin: 0,
		hMargin: 0,
		scaleStep: 0.05
	}

	// инициализация плагинов
	function initPlugins() {
		$(".slider__range").slider({
			animate: true,
			range: "min",
			value: parseInt(param.currOpacity * 100),
			min: 0,
			max: 100,
			step: 1,
			slide: onOpacityChange
		});
		$wm.css('opacity', param.currOpacity);
	}

	function initDrag() {
		$work.width($('#bg').width());
		$work.height($('#bg').height());
		$wm.draggable({
			snapTolerance: 5,
			containment: "parent",
			cursor: 'move',
			snap: $work.selector,
			drag: onDragWatermark
		});
		draggable = true;
	}

	function addEventListeners() {
		var i = 0;
		$('.one-watermark__col-link').on('click', onClickFixedButt);

		$btnXPlus.on('click', function() {
			++param.currPos.left;
			if (param.currPos.left >= param.fixedPositions.rb.left) --param.currPos.left;
			refreshPosVal();
			moveWm();
		});
		$btnYPlus.on('click', function() {
			++param.currPos.top;
			if (param.currPos.top >= param.fixedPositions.rb.top) --param.currPos.top;
			refreshPosVal();
			moveWm();
		});
		$btnXMinus.on('click', function() {
			--param.currPos.left;
			if (param.currPos.left < 0) ++param.currPos.left;
			refreshPosVal();
			moveWm();
		});
		$btnYMinus.on('click', function() {
			--param.currPos.top;
			if (param.currPos.top < 0) ++param.currPos.top;
			refreshPosVal();
			moveWm();
		});
		$btnFour.on('click', function(e) {
			e.preventDefault();
			$('.controls__switch-group-but').removeClass('active');
			$(this).addClass('active');
			$('#mode').val('tile');
			$('#one').hide();
			$('#four').show();
		});
		$btnOne.on('click', function(e) {
			e.preventDefault();
			$('.controls__switch-group-but').removeClass('active');
			$(this).addClass('active');
			$('#mode').val('untail');
			$('#four').hide();
			$('#one').show();
		});
	}

	function onOpacityChange(e, ui) {
		param.currOpacity = ui.value / 100;
		$wm.css({
			'opacity': param.currOpacity
		});
		$opacity.val(param.currOpacity);
	}

	// обработчик изменения позиций drag'n'drop
	function onDragWatermark(e, ui) {
		rmClassActive();
		if (param.scale) {
			param.currPos.left = parseInt(ui.position.left / param.scale);
			param.currPos.top = parseInt(ui.position.top / param.scale);
		}
		refreshPosVal();
	}

	function refreshPosVal() {
		$xVal.val(parseInt(param.currPos.left));
		$yVal.val(parseInt(param.currPos.top));
	}

	function rmClassActive() {
		$('.one-watermark__col-link').removeClass('one-watermark__col-link__active');
	}

	// обработчик клика по кнопке с фиксированой позицией
	function onClickFixedButt(e) {
		e.preventDefault();
		if (!draggable) return;
		rmClassActive();
		moveFixed($(this).attr('id'));
		$(this).addClass('one-watermark__col-link__active');
	}

	// перемещение ватермарки по фиксированым позициям
	function moveFixed(pos) {
		if (!pos) return;
		switch (pos) {
			case 'lt':
				param.currPos = param.fixedPositions.lt;
				break
			case 'ct':
				param.currPos = param.fixedPositions.ct;
				break
			case 'rt':
				param.currPos = param.fixedPositions.rt;
				break
			case 'lm':
				param.currPos = param.fixedPositions.lm;
				break
			case 'cm':
				param.currPos = param.fixedPositions.cm;
				break
			case 'rm':
				param.currPos = param.fixedPositions.rm;
				break
			case 'lb':
				param.currPos = param.fixedPositions.lb;
				break
			case 'cb':
				param.currPos = param.fixedPositions.cb;
				break
			case 'rb':
				param.currPos = param.fixedPositions.rb;
				break
			default:
				break
		}
		moveWm();
		refreshPosVal();
	}

	function moveWm() {
		rmClassActive();
		$('#wm').animate({
			left: param.currPos.left * param.scale,
			top: param.currPos.top * param.scale
		});
	}

	function calcPositions() {
		param.fixedPositions = {
			lt: {
				left: 0,
				top: 0
			},
			ct: {
				left: parseInt((param.bgWidth - param.wmWidth) / 2),
				top: 0
			},
			rt: {
				left: param.bgWidth - param.wmWidth,
				top: 0
			},
			lm: {
				left: 0,
				top: parseInt((param.bgHeight - param.wmHeight)) / 2,
			},
			cm: {
				left: parseInt((param.bgWidth - param.wmWidth) / 2),
				top: parseInt((param.bgHeight - param.wmHeight) / 2)
			},
			rm: {
				left: param.bgWidth - param.wmWidth,
				top: parseInt((param.bgHeight - param.wmHeight) / 2)
			},
			lb: {
				left: 0,
				top: param.bgHeight - param.wmHeight,
			},
			cb: {
				left: parseInt((param.bgWidth - param.wmWidth) / 2),
				top: param.bgHeight - param.wmHeight
			},
			rb: {
				left: param.bgWidth - param.wmWidth,
				top: param.bgHeight - param.wmHeight
			}
		}
	}

	function setParams(data) {
		if (data) {
			for (var key in data) {
				param[key] = data[key];
			}
			calcPositions();
		}
	}

	function scaleImg() {
		if (param.bgWidth >= param.bgHeight) {
			param.scale = $('#result-box').width() / param.bgWidth;
		} else {
			console.log('less');
			param.scale = $('#result-box').height() / param.bgHeight;
		}
		zoom();
		initDrag();
	}

	function zoom(scale) {
		param.scale = scale || param.scale;
		$('#bg__img').css('width', param.bgWidth * param.scale);
		$('#wm__img').css('width', param.wmWidth * param.scale);
		centeredBg();
	}

	function centeredBg() {
		$work.css('left', ($('#result-box').width() - param.bgWidth * param.scale) / 2);
		$work.css('top', ($('#result-box').height() - param.bgHeight * param.scale) / 2);
	}

	return {
		init: function() {
			initPlugins();
			addEventListeners();
		},
		setParams: setParams,
		scaleImg: scaleImg,
		getParams: function() {
			return param
		}
	};

}());