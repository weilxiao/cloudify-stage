/**
 * Created by Tamer on 20/08/2017.
 */
import {mount} from 'enzyme';
import {expect} from 'chai';

import * as Basic from '../../../app/components/basic';
  
// import sinon from 'sinon';

describe ('(Widget) PluginsCatalog', () => {
  let wrapper;
  let widget;
  global.Stage = {Basic, ...global.Stage};

  global.fetchMock.register('GET.plugins.json', __dirname);

  // register the widget
  require( '../../../widgets/pluginsCatalog/src/widget');

  before(function(done) {
      global.WidgetParser.render('pluginsCatalog').then(curr => {
        widget = curr;
        done();
      });
  });

  beforeEach(function() {
      wrapper = mount (widget);
  });

  it ('renders...', () => {
    // expect ([1]).to.have.length (1);
    expect (wrapper).to.have.length (1);
  });

  it ('receive data', () => {
    let {DataTable} = Stage.Basic;
    expect(wrapper.find(DataTable)).to.have.length(1); // is table rendered
  });
  
  
});
