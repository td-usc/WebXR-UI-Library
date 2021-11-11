import * as THREE from 'three'

class TextBox {
    
    constructor(header, content, config) {

        // Default Header
        this.header = "";

        // Default Content
        this.content = "";

        // Default Config
        this.config = {
            position: { x: 0, y: 1, z: 0 },
            rotation: {x: 0, y: 0, z: 0 }, // Rotation in Degrees
            size: { width: 1, height: 1},
            backgroundColor: '#909090',
            opacity: 1,
            font: {family: 'Arial', size: 50, color: '#000000'},
            lineSpacing: 0.5, // 0 is no spacing, 1 is 1 fontHeight of space
            padding: {top: 20, bottom: 20, left: 20, right: 20},
            header: {textColor: '#000000', barColor: '#505050'},
        }

        // Read in Header
        if (header !== undefined) this.header = header;

        // Read in Content
        if (content !== undefined) this.content = content;

       // Read in Config
        if (config !== undefined) {
          if (config.position !== undefined) { 
              if (config.position.x !== undefined) this.config.position.x = config.position.x;
              if (config.position.y !== undefined) this.config.position.y = config.position.y;
              if (config.position.y !== undefined) this.config.position.y = config.position.y;
          }

          if (config.rotation !== undefined) { 
            if (config.rotation.x !== undefined) this.config.rotation.x = config.rotation.x;
            if (config.rotation.y !== undefined) this.config.rotation.y = config.rotation.y;
            if (config.rotation.y !== undefined) this.config.rotation.y = config.rotation.y;
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

          if (config.header !== undefined) {
            if (config.header.text !== undefined) this.config.header.text = config.header.text;
            if (config.header.textColor !== undefined) this.config.header.textColor = config.header.textColor;
            if (config.header.barColor !== undefined) this.config.header.barColor = config.header.barColor;
          }
       }

        // Create Canvas
        const canvas = createCanvas(this.config.size.width, this.config.size.height);
        this.context = canvas.getContext('2d');

        // Set Canvas Properties
        this.context.textAlign = 'start';
        this.context. textBaseline = 'top';
        this.context.fillStyle = this.config.backgroundColor;
        this.context.fillRect(0, 0, canvas.width, canvas.height);

        // Header
        placeHeader(canvas, this.context, this.header, this.config.header, this.config.font, this.config.padding);

        // Set Font for Body
        this.context.font = this.config.font.size + 'px ' + this.config.font.family;
        this.context.fillStyle = this.config.font.color; 

       // Determine Word Wrap
       let lineLength = canvas.width - this.config.padding.left - this.config.padding.right;
       this.lines = wordWrap(lineLength, this.content, this.context);

        // Place Text
        placeText(canvas, this.context, this.lines, this.config.padding, this.config.lineSpacing, this.config.header.text);

        this.context.save();

        this.texture = new THREE.CanvasTexture(canvas);

        // Create Plane to Put Texture Onto
        this.mesh = createPlane(this.config.position, this.config.rotation, this.config.size, this.config.opacity, this.texture);
    }

}


function createCanvas(width, height) {
    let canvas = document.createElement('canvas');
    canvas.width = width * 512;
	canvas.height = height * 512;
    document.body.appendChild(canvas);
    return canvas;
}


function placeHeader(canvas, context, header, headerConfig, font, padding) {
    context.font = 'Bold ' + font.size + 'px ' + font.family;

    context.fillStyle = headerConfig.barColor;
    context.fillRect(0, 0, canvas.width, context.measureText('M').width + padding.top); 

    context.fillStyle = headerConfig.textColor; 
    context.fillText(header, padding.left / 2, padding.top / 2);
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


function placeText(canvas, context, lineArray, padding, lineSpacing) {
    for (let iter = 0; iter < lineArray.length; iter++) {

        let fontHeight = context.measureText('M').width;

        // Offset Lines from Top: padding + height of previous lines + line spacing + height of header
        let lineHeight = padding.top + iter * fontHeight + ((iter + 1) * fontHeight * lineSpacing) + fontHeight;

        if (lineHeight < canvas.height - padding.bottom - fontHeight)
            context.fillText(lineArray[iter], 10 + padding.left, lineHeight);

    }
}


function createPlane(position, rotation, size, opacity, texture) {
    const planeGeometry = new THREE.PlaneGeometry( size.width, size.height );
    const planeMaterial = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true, opacity: opacity} );
    let mesh = new THREE.Mesh( planeGeometry, planeMaterial );
    mesh.position.set(position.x, position.y , position.z);
    mesh.rotation.x = rotation.x * (Math.PI / 180);
    mesh.rotation.y = rotation.y * (Math.PI / 180);
    mesh.rotation.z = rotation.z * (Math.PI / 180);

    return mesh;
 }

export { TextBox };