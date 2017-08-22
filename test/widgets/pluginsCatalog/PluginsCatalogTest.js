/**
 * Created by Tamer on 20/08/2017.
 */
import {mount} from 'enzyme';
import {expect} from 'chai';

import * as Basic from '../../../app/components/basic';

// import sinon from 'sinon';

import PluginsCatalogRow
  from '../../../widgets/pluginsCatalog/src/PluginsCatalogRow';

import PluginsCatalogModal
  from '../../../widgets/pluginsCatalog/src/PluginsCatalogModal';

describe ('(Widget) PluginsCatalog', () => {
  let wrapper;
  let widget;
  global.Stage = {Basic, ...global.Stage};

  // global.fetchMock.debug = true;
  let pluginsList = global.fetchMock.register ('GET.plugins.json', __dirname);

  // register the widget
  require ('../../../widgets/pluginsCatalog/src/widget');

  before (function (done) {
    global.WidgetParser.render ('pluginsCatalog').then (curr => {
      widget = curr;
      done ();
    });
  });

  beforeEach (function () {
    wrapper = mount (widget);
  });

  it ('renders...', () => {
    // expect ([1]).to.have.length (1);
    expect (wrapper).to.have.length (1);
  });

  it ('Receive data and Render Table', () => {
    let {DataTable} = Stage.Basic;
    expect (wrapper.find (DataTable)).to.have.length (1); // is table rendered
    expect (wrapper.find (DataTable.Row).length).to.equal (pluginsList.length); // render all rows

    let row = wrapper.find (DataTable.Row);
    row.forEach ((item, idx) => {
      expect (item.childAt (1).props ().children).to.equal (
        pluginsList[idx].title
      ); // check title
      expect (item.childAt (2).props ().children).to.equal (
        pluginsList[idx].version
      ); // check version
    });
  });

  it ('PluginsCatalogRow onClick and Childs Count', () => {
    let {DataTable} = Stage.Basic;

    let row = wrapper.find (DataTable.Row);
    row.forEach ((item, idx) => {
      item.simulate ('click'); // allowing PluginsCatalogRow to render
      let row = wrapper.find (PluginsCatalogRow);
      expect (row.childAt (0).props ().children).to.equal (
        pluginsList[idx].description
      );
    });
  });

  it ('Rendering wagons links', () => {
    let {DataTable, Button} = Stage.Basic;

    let row = wrapper.find (DataTable.Row);
    row.forEach ((item, idx) => {
      item.simulate ('click');
      let upload = wrapper.find (PluginsCatalogRow).find (Button);
      expect (upload.length).to.equal (pluginsList[idx].wagons.length);
    });
  });

  it ('Open Upload modal', () => {
    let {DataTable, Button} = Stage.Basic;

    let row = wrapper.find (DataTable.Row);
    row.forEach ((item, idx) => {
      item.simulate ('click');
      let upload = wrapper.find (PluginsCatalogRow).find (Button);
      upload.first ().simulate ('click');

      let modal = wrapper.find (PluginsCatalogModal);
      expect (modal.props ().open).to.equal (true); // check open state
    });
  });
});
