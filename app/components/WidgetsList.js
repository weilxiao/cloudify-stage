/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

import Widget from '../containers/Widget';

export default class WidgetsList extends Component {

    static propTypes = {
        pageId: PropTypes.string.isRequired,
        widgets: PropTypes.array.isRequired
    };

    componentDidMount () {
        $('.grid-stack').gridstack({
            cellHeight : 80,
            verticalMargin: 10
        });

        //$('.widget').flip();
    }

    componentWillUpdate(nextProps) {
        var gridStack = $('.grid-stack').data('gridstack');
        // Remove widgets if needed
        const toRemove = _.differenceWith(this.props.widgets, nextProps.widgets, (a, b) => {
            return (a.id === b.id)
        });
        toRemove.forEach(function(r){
            const el = document.getElementById(r.id)
            gridStack.removeWidget(el,false);
        });

        //$('.widget').flip();

    }
    componentDidUpdate(prevProps, prevState) {

        var gridStack = $('.grid-stack').data('gridstack');

        const toAdd = _.differenceWith(this.props.widgets,prevProps.widgets, (a, b) => {
            return (a.id === b.id)
        });

        toAdd.forEach(function(w){
            const el = document.getElementById(w.id)
            gridStack.makeWidget(el);
        });
    }

    render() {
        return (
            <div className="grid-stack">

                {/* temp example widgets */}
                {
                    this.props.widgets.map(function(widget){
                        return <Widget key={widget.id} widget={widget} pageId={this.props.pageId}></Widget>;
                    },this)
                }

            </div>
        );
    }
}

