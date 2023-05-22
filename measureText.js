function measureText(text, font) {
    // Create a temporary div element
    var elem = document.createElement('div');
    document.body.appendChild(elem);
    
    // Apply the same font and text to the div
    elem.style.font = font;
    elem.style.padding = "0";
    elem.style.margin = "0";
    elem.innerText = text;
    
    // Measure the div's size
    var width = elem.offsetWidth;
    var height = elem.offsetHeight;
    
    // Remove the div from the document after measurement
    document.body.removeChild(elem);
    
    // Return the measured size
    return { width: width, height: height };
}