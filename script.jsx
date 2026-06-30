#target photoshop

// ==================================================================================
// DocInfo Engine
// Version: 1.3
// Author: TheMaestr-o (adapted November 2025)
// English:
// This script collects the key technical specifications of the active Photoshop document:
// - Dimensions in pixels (px), centimeters (cm), and inches (in).
// - Resolution (PPI and PPCM).
// - Megapixel count (MP), Color Mode, Bit Depth, and Color Profile.
// - Aspect ratio, including the Farey fraction representation.
// All data is inserted into a new text layer placed at the Top Left corner of the document.
// ==================================================================================

// We wrap the main logic in an Immediately Invoked Function Expression (IIFE)
// to make the "return" in the error check legal.
(function() {

    if (app.documents.length === 0) {
        // We cannot use alert(), so we just stop the script execution
        return;
    }

    var savedRuler = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;



    var w = doc.width.value;
    var h = doc.height.value;

    var colorMode = doc.mode.toString().split(".")[1];
    var bitDepth = doc.bitsPerChannel.toString().split(".")[1];
    var colorProfile = doc.colorProfileName;

    var r = gcd(w, h);
    var mp = w * h / 1000000;
    var pix = w * h;
    var ppiRes = doc.resolution;
    var ppcmRes = ppiRes / 2.54;
    var ratio = w / h;
    var docName = doc.name;
    var wMetric = w / 72 * 2.54;
    var hMetric = h / 72 * 2.54;
    var wInches = w / 72;
    var hInches = h / 72;



    var docInfo =
        'Name: ' + docName + '\r' +
        'Color Profile: ' + colorProfile + '\r' +
        'Color Mode: ' + colorMode + ' / ' + bitDepth + '\r' +
        'Dimensions: ' + w + ' x ' + h + ' px' + '\r' +
        'Dimensions: ' + (wMetric.toFixed(2)) + ' x ' + (hMetric.toFixed(2)) + ' cm / ' + (wInches.toFixed(2)) + ' x ' + (hInches.toFixed(2)) + ' in' + '\r' +
        'Resolution: ' + ppiRes.toFixed(1) + ' ppi / ' + ppcmRes.toFixed(2) + ' ppcm' + '\r' +
        'Megapixel Value: ' + mp.toFixed(1) + ' MP' + ' (' + pix + ' px)' + '\r' +
        'Aspect Ratio: ' + ratio.toFixed(2) + ':1' + ' / ' + (ratio * 2).toFixed(2) + ':2 / ' + (ratio * 4).toFixed(2) + ':4' + ' (Basic)' + '\r' +
        'Aspect Ratio (Farey): ' + aspect_ratio(w / h, 50).toString().replace(',', ':');



    var textLayer = doc.artLayers.add();
    textLayer.kind = LayerKind.TEXT;
    textLayer.name = "Document Info";


    // Set the position of the text layer to the top left corner with a small padding (50px)
    var paddingX = 50;
    var paddingY = 50;
    textItem.position = [paddingX, paddingY];


    app.preferences.rulerUnits = savedRuler;

}());



function gcd(a, b) {
    return (b == 0) ? a : gcd(b, a % b);
}

// Function to find the closest simple fractional aspect ratio (Farey method)
function aspect_ratio(val, lim) {
    var lower = [0, 1];
    var upper = [1, 0];

    while (true) {
        var mediant = [lower[0] + upper[0], lower[1] + upper[1]];

        if (val * mediant[1] > mediant[0]) {
            if (lim < mediant[1]) {
                return upper;
            }
            lower = mediant;
        } else if (val * mediant[1] == mediant[0]) {
            if (lim >= mediant[1]) {
                return mediant;
            }
            if (lower[1] < upper[1]) {
                return lower;
            }
            return upper;
        } else {
            if (lim < mediant[1]) {
                return lower;
            }
            upper = mediant;
        }
    }
}
