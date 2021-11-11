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

            header: {
                font: {family: 'Arial', size: 50, color: '#000000'}, // Font will be bold
                barColor: '#505050', 
                padding: { top: 10, bottom: 10, left: 10, right: 10 } 
            },

            content: {
                font: {family: 'Arial', size: 50, color: '#000000'}, // Font will be regular
                lineSpacing: 0.5, // 0 is no spacing, 1 is 1 fontHeight of space
                padding: {top: 20, bottom: 20, left: 20, right: 20},
            },
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

            if (config.header !== undefined) {
                if (config.header.font !== undefined) { 
                    if (config.header.font.family !== undefined) this.config.header.font.family = config.header.font.family;
                    if (config.header.font.size !== undefined) this.config.header.font.size = config.header.font.size;
                    if (config.header.font.color !== undefined) this.config.header.font.color = config.header.font.color;
                }
                if (config.header.barColor !== undefined) this.config.header.barColor = config.header.barColor;
                if (config.header.padding !== undefined) {
                    if (config.header.padding.left !== undefined) this.config.header.padding.left = config.header.padding.left;
                    if (config.header.padding.right !== undefined) this.config.header.padding.right = config.header.padding.right;
                    if (config.header.padding.top !== undefined) this.config.header.padding.top = config.header.padding.top;
                    if (config.header.padding.bottom !== undefined) this.config.header.padding.bottom = config.header.padding.bottom;
                }
            }

            if (config.content !== undefined) {

                if (config.content.font !== undefined) { 
                    if (config.content.font.family !== undefined) this.config.content.font.family = config.content.font.family;
                    if (config.content.font.size !== undefined) this.config.content.font.size = config.content.font.size;
                    if (config.content.font.color !== undefined) this.config.content.font.color = config.content.font.color;
                }

                if (config.content.lineSpacing !== undefined) this.config.content.lineSpacing = config.content.lineSpacing;

                if (config.content.padding !== undefined) { 
                    if (config.content.padding.left !== undefined) this.config.content.padding.left = config.content.padding.left;
                    if (config.content.padding.right !== undefined) this.config.content.padding.right = config.content.padding.right;
                    if (config.content.padding.top !== undefined) this.config.content.padding.top = config.content.padding.top;
                    if (config.content.padding.bottom !== undefined) this.config.content.padding.bottom = config.content.padding.bottom;
                }
            }
        }

        // Create Canvas
        const canvas = createCanvas(this.config.size.width, this.config.size.height);
        
        //Set Canvas Properties -- Text alignment is Top Start
        this.context = setCanvasContext(canvas, this.config.backgroundColor);

        // Header
        let headerHeight = placeHeader(canvas, this.context, this.header, this.config.header);

       // Determine Word Wrap and Place Text
        let boundingBox = {
            top: headerHeight + this.config.content.padding.top, 
            bottom: canvas.height - this.config.content.padding.bottom,
            left: this.config.content.padding.left,
            right: canvas.width - this.config.content.padding.right 
        }

        placeText(canvas, this.context, boundingBox, this.content, this.config.content);

        this.context.save();

        this.texture = new THREE.CanvasTexture(canvas);

        // Create Plane and Apply Texture
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

function setCanvasContext(canvas, backgroundColor) {
    let context = canvas.getContext('2d');
    context.textAlign = 'start';
    context. textBaseline = 'top';
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return context
}


function placeHeader(canvas, context, header, headerConfig) {
    context.font = 'Bold ' + headerConfig.font.size + 'px ' + headerConfig.font.family;

    context.fillStyle = headerConfig.barColor;
    context.fillRect(0, 0, canvas.width, context.measureText('M').width + headerConfig.padding.top + headerConfig.padding.bottom); 

    context.fillStyle = headerConfig.font.color; 
    context.fillText(header, headerConfig.padding.left, headerConfig.padding.top, canvas.width - headerConfig.padding.left - headerConfig.padding.right);

    // Return Height of the Header Box
    return context.measureText('M').width + headerConfig.padding.top + headerConfig.padding.bottom;
}


function wordWrap(boundingBox, content, context) {
    let lineLength = boundingBox.right - boundingBox.left;
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


function placeText(canvas, context, boundingBox, content, contentConfig) {

    context.font = contentConfig.font.size + 'px ' + contentConfig.font.family;
    context.fillStyle = contentConfig.font.color;

    let lines = wordWrap(boundingBox, content, context);

    for (let iter = 0; iter < lines.length; iter++) {

        let fontHeight = context.measureText('M').width;

        // Offset Lines from Top: top of bounding box + height of previous lines + previous line spacing
        let lineHeight = boundingBox.top + iter * fontHeight + (iter * fontHeight * contentConfig.lineSpacing);

        if (lineHeight < boundingBox.bottom - fontHeight)
            context.fillText(lines[iter], boundingBox.left, lineHeight);

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