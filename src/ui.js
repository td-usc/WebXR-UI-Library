import * as THREE from 'three'

class TextBox {
    
    constructor(content, config) {

        // Default Content
        this.content = "";

        // Default Config
        this.config = {
            position: { x: 0, y: 1, z: 0 },
            size: { width: 1, height: 1},
            backgroundColor: '#909090',
            opacity: 1,
            font: {family: 'Arial', size: 50, color: '#000000'},
            lineSpacing: 0.5, // 0 is no spacing, 1 is 1 fontHeight of space
            padding: {top: 20, bottom: 20, left: 20, right: 20},
        }

        // Read in content
        if (content !== undefined) this.content = content;

       // Read in config
        if (config !== undefined) {
          if (config.position !== undefined) { 
              if (config.position.x !== undefined) this.config.position.x = config.position.x;
              if (config.position.y !== undefined) this.config.position.y = config.position.y;
              if (config.position.y !== undefined) this.config.position.y = config.position.y;
          }
          
          if (config.size !== undefined) { 
              if (config.size.width !== undefined) this.config.size.width = config.size.width;
              if (config.size.height !== undefined) this.config.size.height = config.size.height;
          }

          if (config.backgroundColor !== undefined) this.config.backgroundColor = config.backgroundColor;
          if (config.opactiy !== undefined) this.config.opacity = config.opacity;

          if (config.font !== undefined) { 
              if (config.font.family !== undefined) this.config.font.family = config.font.family;
              if (config.font.size !== undefined) this.config.font.size = config.font.size;
              if (config.font.color !== undefined) this.config.font.color = config.font.color;
          }

          if (config.lineSpacing !== undefined) this.config.lineSpacing = config.lineSpacing;

          if (config.padding !== undefined) { 
              if (config.padding.left !== undefined) this.config.padding.left = config.padding.left;
              if (config.padding.right !== undefined) this.config.padding.right = config.padding.right;
              if (config.padding.top !== undefined) this.config.padding.top = config.padding.top;
              if (config.padding.bottom !== undefined) this.config.padding.bottom = config.padding.bottom;
          }
       }

        // Create Canvas
        const canvas = createCanvas(this.config.size.width, this.config.size.height);
        this.context = canvas.getContext('2d');

        // Set Canvas Properties
        this.context.font = this.config.font.size + 'px ' + this.config.font.family;
        this.context.textAlign = 'start';
        this.context. textBaseline = 'top';
        this.context.fillStyle = this.config.backgroundColor;
        this.context.fillRect(0, 0, canvas.width, canvas.height);
        this.context.fillStyle = this.config.font.color; 

       // Determine Word Wrap
       let lineLength = canvas.width - this.config.padding.left - this.config.padding.right;
       this.lines = wordWrap(lineLength, this.content, this.context);

        // Place Text
        for (let iter = 0; iter < this.lines.length; iter++) {

            let fontHeight = this.context.measureText('M').width;

            let lineHeight = this.config.padding.top + iter * fontHeight + ((iter + 1) * fontHeight * this.config.lineSpacing);

            if (lineHeight < canvas.height - this.config.padding.bottom - fontHeight)
                this.context.fillText(this.lines[iter], 10 + this.config.padding.left, lineHeight);

        }

        this.context.save();

        this.texture = new THREE.CanvasTexture(canvas);

        // Create plane to put text onto
        const planeGeometry = new THREE.PlaneGeometry( this.config.size.width, this.config.size.height );
        const planeMaterial = new THREE.MeshBasicMaterial( {map: this.texture, side: THREE.DoubleSide, transparent: true, opacity: this.config.opacity} );
        this.mesh = new THREE.Mesh( planeGeometry, planeMaterial );
        this.mesh.position.set(this.config.position.x, this.config.position.y , this.config.position.z);
    }

}


function createCanvas(width, height) {
    let canvas = document.createElement('canvas');
    canvas.width = width * 512;
	canvas.height = height * 512;
    document.body.appendChild(canvas);
    return canvas;
}


function wordWrap(lineLength, content, context) {
    let lines = [];
    if (lineLength > context.measureText(content).width) lines[0] = content;
    else {
        let words = content.split(" ");
        let lineIter = 0;
        for (const word of words) {
            if (lineLength > context.measureText(lines[lineIter] + word).width) {
                lines[lineIter] === undefined ? lines[lineIter] = (word + " ") : lines[lineIter] += (word + " ");
            }
            else {
                lineIter++;
                lines[lineIter] === undefined ? lines[lineIter] = (word + " ") : lines[lineIter] += (word + " ");
            }
        }
    }
    return lines;
 }

export { TextBox };