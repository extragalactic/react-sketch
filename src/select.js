/*eslint no-unused-vars: 0*/
'use strict';

import FabricCanvasTool from './fabrictool'

class Select extends FabricCanvasTool {

    configureCanvas(props) {
        let canvas = this._canvas;
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.forEachObject((o) => {
            console.log(o)
            o.selectable = o.evented = true;
        });
        const background = canvas.item(0);
        background.selectable = background.evented = false; // first (background) image not selectable
    }
}

export default Select;