/**
 * Created by Tamer on 20/08/2017.
 */
import {mount} from 'enzyme';
import {expect} from 'chai';

import * as Basic from '../../../app/components/basic';

// import sinon from 'sinon';

import PluginsCatalogModal
  from '../../../widgets/pluginsCatalog/src/PluginsCatalogModal';

describe ('(Widget) PluginsCatalog (Modal)', () => {
  let wrapper;
  
  global.Stage = {Basic, ...global.Stage};

  global.fetchMock.debug = true;

  global.requestAnimationFrame = () => {};
  global.cancelAnimationFrame = () => {};

  beforeEach (function () {
    wrapper = mount (<PluginsCatalogModal />);
  });

  it ('renders...', () => {
    expect (wrapper).to.have.length (1);
  });

  it ('handle onClick...', () => {
    wrapper.setProps({open: true});

    let childs = wrapper.children()
    console.log(childs) // still cant access childs, dont know why
  });

});
