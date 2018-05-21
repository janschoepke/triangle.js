var Triangle = (function Triangle() {
    //private methods
    var defaultSettings = {};

    var injectStyle = function (css) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    };

    var createStyleSheet = function () {
        var length = this.defaultSettings.colors.length;

    }

    return function TriangleConstructor(settings) {
        var _this = this;
        for(var key in settings) defaultSettings[key] = settings[key];
        var sheets = document.styleSheets;
        console.log(sheets);

        injectStyle('body {font-family: Arial}');

        _this.reinit = function (settings) {
            for(var key in settings) defaultSettings[key] = settings[key];
        };
    };
}());