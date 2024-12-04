var mobilenet = require('@tensorflow-models/mobilenet')

const dropZone = document.getElementById('dropZone');
const output = document.getElementById('output');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.style.borderColor = 'green';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ccc';
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.style.borderColor = '#ccc';

    const items = event.dataTransfer.items;
    
    for (let i = 0; i < items.length; i++) {
        console.log(items[i])
        if (items[i].kind === 'file') {
            const file = items[i].getAsFile();
            const reader = new FileReader();

            reader.onload = function(event) {
                displayImage(event.target.result);
            }
            reader.readAsDataURL(file);
        } else if (items[i].kind === 'string' && items[i].type === 'text/uri-list') {
            items[i].getAsString((url) => {
                displayImage(url);
            });
        }
    }
});

function displayImage(src) {
    const link = document.createElement('img');
    link.src = src;
    output.appendChild(link);

    mobilenet.load().then(model => {
    model.classify(link).then(predictions => {
        let foundATruck
        predictions.forEach(p => {
            foundATruck = foundATruck || p.className.includes("truck")
        })
        if (foundATruck) alert("TRUCK DETECTED!")
    });
  });
}
