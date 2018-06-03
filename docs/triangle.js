var Triangle = (function Triangle() {
    var defaultSettings = {
        colors: ['#ffffff', '#ff8a64', '#ffca27', '#f57b01', '#039be5'],
        debug: false,
        marginTop: "30vw",
        triangleHeight: "60vw",
        preloadCount: 2,
        animateOnChange: true,
        fadeIn: true
    };

    var backgroundItemCounter = 1;

    /**
     * log
     * Function to print console output when debug mode is on
     * @param {string} message
     */
    var log = function (message) {
        if(defaultSettings.debug) {
            console.log("Triangle.js: " + message);
        }
    }

    /**
     * injectStyle
     * Function to add a <style> tag with given content to HTML <head>
     * @param {string} css
     */
    var injectStyle = function (css) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.id = "triangle-style";
        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    };

    /**
     * getColorCode
     * Function to get the color code at a specified position of defaultSettings.colors array
     * @param {int} index
     * @returns {string} color code
     */
    var getColorCode = function(index) {
        var length = defaultSettings.colors.length;

        if(index >= length) {
            index = index % length;
        } else if (index < 0) {
            index = length - 1;
        }

        return defaultSettings.colors[index];
    };

    /**
     * createStyleSheet
     * Function to create the Triangle.js stylesheet
     * @returns {string} stylesheet
     */
    var createStyleSheet = function () {
        var length = defaultSettings.colors.length;
        var cssText = ".background-wrapper {" +
                "background-color: " + getColorCode(0) + ";" +
                "padding-top: " + defaultSettings.marginTop + ";" +
            "}" +
            ".square {" +
                "height: " + defaultSettings.triangleHeight + ";" +
            "}" +
            ".triangle {" +
                "height: " + (defaultSettings.triangleHeight / 4) + ";" +
            "}";

        for(var i = 0; i < length; i++) {
            cssText += ".square:nth-child(" + length + "n+" + (i+1) + ") {" +
                    "background-color: " + getColorCode(i+1) + ";" +
                "}";

            if(i % 2 === 0) {
                cssText += ".square:nth-child(" + length + "n+" + (i+1) + ") .triangle {" +
                    "background-image: linear-gradient(to right bottom, " + getColorCode(i) + " calc(0% + 1px), " + getColorCode(i) + " calc(50% + 1px), transparent calc(50% + 1px));" +
                    "}";
            } else {
                cssText += ".square:nth-child(" + length + "n+" + (i+1) + ") .triangle {" +
                    "background-image: linear-gradient(to left bottom, " + getColorCode(i) + " calc(0% + 1px), " + getColorCode(i) + " calc(50% + 1px), transparent calc(50% + 1px));" +
                    "}";
            }
        }

        return cssText;
    };

    /**
     * recalculateHeight
     * Function to calculate and insert the required number of squares and triangles to the dom
     */
    var recalculateHeight = function () {
        var body = document.body,
            html = document.documentElement;

        var height = Math.max( body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight );

        var squareHeight = document.getElementsByClassName('square')[0].clientHeight;

        while ( (height + defaultSettings.preloadCount * squareHeight) > (backgroundItemCounter * squareHeight)) {
            log("Added new square and triangle element to DOM.");
            var wrapper = document.getElementsByClassName('background-wrapper')[0];
            wrapper.insertAdjacentHTML('beforeend', '<div class="square"><div class="triangle"></div></div>');
            backgroundItemCounter++;
        }
    };

    /**
     * applyDom
     * Function to add the Triangle-wrapper element to the dom
     */
    var applyDom = function () {
      var body = document.getElementsByTagName('body')[0];
      if (defaultSettings.fadeIn) {
          body.insertAdjacentHTML('beforeend', '<div class="background-wrapper fade-in"><div class="square"><div class="triangle"></div></div></div>');
      } else {
          body.insertAdjacentHTML('beforeend', '<div class="background-wrapper"><div class="square"><div class="triangle"></div></div></div>');
      }
    };

    /**
     * renewStylesheet
     * Function to apply a new colorset to CSS
     */
    var renewStylesheet = function () {
        document.getElementById('triangle-style').outerHTML = "";

        var newStyle = createStyleSheet();
        injectStyle(newStyle);
    };

    /**
     * initalFadeIn
     * Handler for initial fade in mechanism
     */
    var initialFadeIn = function() {
        var backgroundWrapper = document.getElementsByClassName('background-wrapper')[0];
        backgroundWrapper.classList.remove('fade-in');
    };

    return function TriangleConstructor(settings) {
        var _this = this;

        for(var key in settings) defaultSettings[key] = settings[key];
        log('TriangleJS is in debug mode.');
        log(defaultSettings);

        if(defaultSettings.colors.length % 2 !== 0) {
            defaultSettings.colors.push.apply(defaultSettings.colors, defaultSettings.colors);
        }

        var style = createStyleSheet();
        log(style);
        injectStyle(style);

        applyDom();

        window.addEventListener('resize', recalculateHeight);
        recalculateHeight();

        window.setInterval(function(){
            initialFadeIn();
        }, 500);


        _this.recalculate = function() {
            recalculateHeight();
        };

        _this.changeStyle = function (newColors) {
            if(newColors.length % 2 !== 0) {
                newColors.push.apply(newColors, newColors);
            }

            defaultSettings['colors'] = newColors;

            var backgroundWrapper = document.getElementsByClassName('background-wrapper')[0];
            if(defaultSettings.animateOnChange) {
                backgroundWrapper.classList.add('change-in-progress');

                window.setTimeout(function() {
                    renewStylesheet();

                    backgroundWrapper.classList.remove('change-in-progress');
                }, 400);
            } else {
                renewStylesheet()
            }

        }
    };
}());