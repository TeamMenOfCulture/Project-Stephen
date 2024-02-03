/* This is the code for the eye tracking implemented using
* GazeCloud API; details about GazeCloud here: 
* See README.md for reference material on the API
*/

// Calibration is complete
GazeCloudAPI.OnCalibrationComplete = function(){
    console.log('gaze Calibration Complete')
}  

// If camera access is denied
GazeCloudAPI.OnCamDenied = function(){ 
    console.log('camera access denied')  
}  

// Error messages
GazeCloudAPI.OnError = function (msg) {
    console.log('err: ' + msg)
}

// Users can click to recalibrate in real time
// # TODO : Add message to let user know about this feature
GazeCloudAPI.UseClickRecalibration = true;

// Starts eye tracking
GazeCloudAPI.StartEyeTracking();

// Draws a circle around where we are looking right now, for demonstration purposes
function draw(gazeX, gazeY) {
    
    // Finds canvas on HTML document
    var canvas = document.getElementById('circle');

    // Always same size as window
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize()
    
    // Draws the circle
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d'); 
        
        // Uses user's eye position
        var X = gazeX;
        var Y = gazeY;
        var R = 45;

        // Draws a path
        ctx.beginPath();
        ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#db7575';
        ctx.stroke();
    }
}

// IFrame = PDF viewer
var myIframe = document.getElementById('iframe');
var y = 0;

// Every time the GazeCloud API gets a result for where the user is looking
GazeCloudAPI.OnResult = function (GazeData, y) {

    /* IMPORTANT VARIABLES ||
    *** used in current implementation
    
    GazeData.state
        0   : valid gaze data
        -1  : face tracking lost
        1   : gaze data uncalibrated
    
    GazeData.docX
        // gaze x in document coordinates
    
    GazeData.docY
        // gaze y in document coordinates

    GazeData.GazeX ***
        // gaze x in screen coordinates
    
    GazeData.GazeY ***
        // gaze y in screen coodinates

    GazeData.time
        // current timestamp
    */

    // Draws a circle around the current location using gaze data
    draw(GazeData.GazeX, GazeData.GazeY);

    // Scrolls up or down depending on if gaze is high or low enough on the screen
    if (GazeData.GazeY > 700) {
        window.scrollBy(0,50); 
    } else if (GazeData.GazeY < 300) {
        window.scrollBy(0,-50);
    }
    
}