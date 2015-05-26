describe('FormField component', function() {
  var mockRegistry,
      onSearch,
      onUpdate,
      formFieldPath = buildSrcPath('component/FormField'),
      SearchField,
      mockSearchField;

  beforeEach(function() {

    onSearch = jasmine.createSpy();
    onUpdate = jasmine.createSpy('onUpdate');

    resetDOM();

    mockery.enable({
      warnOnReplace:false,
      useCleanCache: true
    });

    mockSearchField = React.createClass({
      render: function() {
        return (
          /* jshint quotmark:false */
          <div>
            <i onClick={onSearch} />
            <div>
              <input
                ref='searchFieldInput'
                type='search' />
            </div>
          </div>
        );
      }
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/Loading': {
        Loading: noop
      },
      'mixin/validation': {},
      'mixin/formField': {},
      'utility/devices': {
        isMobileBrowser: noop
      },
      'react-forms': {
        Form: mockSearchField,
        FormFor: mockSearchField,
        schema: {
          Property: mockSearchField
        },
        input: noop,
        validation: noop
      },
      'component/FormField': {
        SearchField: noop
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'init',
          'setLocale',
          'getLocale',
          't',
          'isRTL'
        ])
      }
    });

    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(formFieldPath);

    SearchField = require(formFieldPath).SearchField;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should call onSearch when search icon is clicked', function() {
    var searchField = React.render(
          <SearchField onSearchIconClick={onSearch} />,
          global.document.body
        ),
        searchFieldNode = searchField.getDOMNode();

    ReactTestUtils.Simulate.click(searchFieldNode.querySelector('i'));

    expect(onSearch)
      .toHaveBeenCalled();
  });

  it('should clear input and call props.onUpdate when clear icon is clicked', function() {
    var searchField = React.render(
          <SearchField onUpdate={onUpdate} />,
          global.document.body
        ),
        searchFieldNode = searchField.getDOMNode(),
        searchInputNode = searchFieldNode.querySelector('input');

    searchInputNode.value = 'Search string';

    ReactTestUtils.Simulate.click(searchFieldNode.querySelector('.Icon--clearInput'));

    expect(searchInputNode.value)
      .toEqual('');

    expect(onUpdate)
      .toHaveBeenCalled();
  });

});
