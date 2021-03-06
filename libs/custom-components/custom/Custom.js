'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// var _Base = require('../../../../node_modules/formiojs/components/base/Base');
var _Base = require('formiojs');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CustomComponent = function (_BaseComponent) {
  _inherits(CustomComponent, _BaseComponent);

  function CustomComponent() {
    _classCallCheck(this, CustomComponent);

    return _possibleConstructorReturn(this, (CustomComponent.__proto__ || Object.getPrototypeOf(CustomComponent)).apply(this, arguments));
  }

  _createClass(CustomComponent, [{
    key: 'setHTML',
    value: function setHTML() {
      this.element.innerHTML = this.interpolate(this.component.html);
    }
  }, {
    key: 'build',
    value: function build() {
      var _this2 = this;

      this.element = this.ce('div', {
        id: this.id,
        class: 'form-group ' + this.component.customClass
      });

      this.element.component = this;

      if (this.options.builder) {
        var editorElement = this.ce('div');
        this.addQuill(editorElement, this.wysiwygDefault, function (element) {
          _this2.component.html = element.value;
        }).then(function (editor) {
          editor.setContents(editor.clipboard.convert(_this2.component.html));
        });
        this.element.appendChild(editorElement);
      } else {
        this.setHTML();
      }

      if (this.component.refreshOnChange) {
        this.on('change', function () {
          return _this2.setHTML();
        });
      }
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return CustomComponent.schema();
    }
  }, {
    key: 'emptyValue',
    get: function get() {
      return '';
    }
  }], [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _Base2.default.schema.apply(_Base2.default, [{
        type: 'custom',
        key: 'custom',
        input: false,
        html: ''
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Custom',
        group: 'basic',
        icon: 'fa fa-html5',
        documentation: 'http://help.form.io/userguide/#custom-component',
        weight: 100,
        schema: CustomComponent.schema()
      };
    }
  }]);

  return CustomComponent;
}(_Base2.default);

exports.default = CustomComponent;