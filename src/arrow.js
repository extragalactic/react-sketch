/*eslint no-unused-vars: 0*/
'use strict';

import FabricCanvasTool from './fabrictool'
const fabric = require('fabric').fabric;

class Arrow extends FabricCanvasTool {

    configureCanvas(props) {
        let canvas = this._canvas;
        canvas.isDrawingMode = canvas.selection = false;
        canvas.forEachObject((o) => o.selectable = o.evented = false);
        this._width = props.lineWidth;
        this._color = props.lineColor;
    }

    doMouseDown(o) {
        this.isDown = true;
        let canvas = this._canvas;
        var pointer = canvas.getPointer(o.e);
        var points = [pointer.x, pointer.y, pointer.x, pointer.y];
        this.line = new fabric.Line(points, {
            strokeWidth: this._width,
            fill: this._color,
            stroke: this._color,
            originX: 'center',
            originY: 'center',
            selectable: true,
            evented: true,
            objName: 'ArrowLine',
        });

        let centerX = (this.line.x1 + this.line.x2) / 2,
            centerY = (this.line.y1 + this.line.y2) / 2;
        let deltaX = this.line.left - centerX,
            deltaY = this.line.top - centerY;

        this.arrowhead = new fabric.Triangle({
            left: this.line.get('x1') + deltaX,
            top: this.line.get('y1') + deltaY,
            originX: 'center',
            originY: 'center',
            hasBorders: true,
            hasControls: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            selectable: true,
            evented: true,            
            angle: -45,
            width: this._width * 6,
            height: this._width * 6,
            fill: this._color,
            stroke: this._color,
            objName: 'ArrowHead',
        });

        canvas.insertAt(this.line, 1);
        canvas.insertAt(this.arrowhead, 1);
    }

    doMouseMove(o) {
        var x1, y1, x2, y2; 

        if (!this.isDown) return;
        let canvas = this._canvas;
        var pointer = canvas.getPointer(o.e);
        this.line.set({x2: pointer.x, y2: pointer.y});

        x1 = this.line.get('x1');
        y1 = this.line.get('y1');
        x2 = this.line.get('x2');
        y2 = this.line.get('y2');

        let centerX = (this.line.x1 + this.line.x2) / 2,
            centerY = (this.line.y1 + this.line.y2) / 2;
        let deltaX = this.line.left - centerX,
            deltaY = this.line.top - centerY;

        this.arrowhead.set('left', this.line.get('x2') + deltaX);
        this.arrowhead.set('top', this.line.get('y2') + deltaY);

        const angle = this.calcArrowAngle(x2, y2, x1, y1);
        this.arrowhead.set('angle', angle - 90);

        this.line.setCoords();
        canvas.renderAll();
    }

    doMouseUp(o) {

        this.arrowGroup = new fabric.Group([ this.line, this.arrowhead ], {
            selectable: true,
            evented: true
        });
        let canvas = this._canvas;      
        canvas.add(this.arrowGroup);
     
        canvas.remove(this.line);
        canvas.remove(this.arrowhead);

        this.isDown = false;
    }

    doMouseOut(o) {
        // this.isDown = false;
    }

    calcArrowAngle(x1, y1, x2, y2) {
        var angle = 0,
            x, y;

        x = (x2 - x1);
        y = (y2 - y1);

        if (x === 0) {
            angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
        } else if (y === 0) {
            angle = (x > 0) ? 0 : Math.PI;
        } else {
            angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
        }

        return (angle * 180 / Math.PI);
    }
}

export default Arrow;
