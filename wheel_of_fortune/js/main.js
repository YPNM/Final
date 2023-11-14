// <img id="spin_button" src="spin_off.png" alt="Spin" onClick="startSpin();" />
// Create new wheel object specifying the parameters at creation time.
let theWheel = new Winwheel({
    'outerRadius'     : 212,        // Set outer radius so wheel fits inside the background.
    'innerRadius'     : 75,         // Make wheel hollow so segments don't go all way to center.
    'textFontSize'    : 24,         // Set default font size for the segments.
    'textOrientation' : 'vertical', // Make text vertial so goes down from the outside of wheel.
    'textAlignment'   : 'outer',    // Align text to outside of wheel.
    'numSegments'     : 11,         // Specify number of segments.
    'segments'        :             // Define segments including colour and text.
    [                               // font size and test colour overridden on backrupt segments.
       {'fillStyle' : '#ee1c24', 'text' : 'x0.25'},
       {'fillStyle' : '#3cb878', 'text' : 'x0.5'},
       {'fillStyle' : '#f6989d', 'text' : 'x1'},
       {'fillStyle' : '#00aef0', 'text' : 'x3'},
       {'fillStyle' : '#f26522', 'text' : 'x4'},
       {'fillStyle' : '#000000', 'text' : 'x3'},
       {'fillStyle' : '#e70697', 'text' : 'LOOSE', 'textFontSize' : 16, 'textFillStyle' : '#ffffff'},
       {'fillStyle' : '#fff200', 'text' : 'LOOSE', 'textFontSize' : 16, 'textFillStyle' : '#ffffff'},
       {'fillStyle' : '#f6989d', 'text' : 'x2'},
       {'fillStyle' : '#ee1c24', 'text' : 'LOOSE', 'textFontSize' : 16, 'textFillStyle' : '#ffffff'},
       {'fillStyle' : '#3cb878', 'text' : 'x1'}
    ],
    'animation' :           // Specify the animation to use.
    {
        'type'     : 'spinToStop',
        'duration' : 10,    // Duration in seconds.
        'spins'    : 3,     // Default number of complete spins.
        'callbackFinished' : alertPrize,
        'callbackSound'    : playSound,   // Function to call when the tick sound is to be triggered.
        'soundTrigger'     : 'pin'        // Specify pins are to trigger the sound, the other option is 'segment'.
    },
    'pins' :				// Turn pins on.
    {
        'number'     : 11,
        'fillStyle'  : 'silver',
        'outerRadius': 4,
    }
});

// Loads the tick audio sound in to an audio object.
let audio = new Audio('/wheel_of_fortune/img/tick.mp3');

// This function is called when the sound is to be played.
function playSound()
{
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;
    // Play the sound.
    audio.play();
}

// Vars used by the code in this page to do power controls.
let wheelPower    = 0;
let wheelSpinning = false;

// -------------------------------------------------------
// Function to handle the onClick on the power buttons.
// -------------------------------------------------------
function powerSelected(powerLevel)
{
    // Ensure that power can't be changed while wheel is spinning.
    if (wheelSpinning == false) {
        // Reset all to grey incase this is not the first time the user has selected the power.
        document.getElementById('pw1').className = "";
        document.getElementById('pw2').className = "";
        document.getElementById('pw3').className = "";
        // Now light up all cells below-and-including the one selected by changing the class.
        if (powerLevel >= 1) {
            document.getElementById('pw1').className = "pw1";
        }
        if (powerLevel >= 2) {
            document.getElementById('pw2').className = "pw2";
        }
        if (powerLevel >= 3) {
            document.getElementById('pw3').className = "pw3";
        }
        // Set wheelPower var used when spin button is clicked.
        wheelPower = powerLevel;
        // Light up the spin button by changing it's source image and adding a clickable class to it.
        document.getElementById('spin_button').src = "/wheel_of_fortune/img/spin_on.png";
        document.getElementById('spin_button').className = "clickable";
    }
}

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin()
{
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
        // Based on the power level selected adjust the number of spins for the wheel, the more times is has
        // to rotate with the duration of the animation the quicker the wheel spins.
        if (wheelPower == 1) {
            theWheel.animation.spins = 3;
        } else if (wheelPower == 2) {
            theWheel.animation.spins = 6;
        } else if (wheelPower == 3) {
            theWheel.animation.spins = 10;
        }
        // Disable the spin button so can't click again while wheel is spinning.
        document.getElementById('spin_button').src       = "/wheel_of_fortune/img/spin_off.png";
        document.getElementById('spin_button').className = "";
        // Begin the spin animation by calling startAnimation on the wheel object.
        theWheel.startAnimation();
        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
    }
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel()
{
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.
    document.getElementById('pw1').className = "";  // Remove all colours from the power level indicators.
    document.getElementById('pw2').className = "";
    document.getElementById('pw3').className = "";
    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alertPrize(indicatedSegment)
{
    // Just alert to the user what happened.
    // In a real project probably want to do something more interesting than this with the result.
    if (indicatedSegment.text == 'LOOSE TURN') {
        alert('Sorry but you loose a turn.');
    } else if (indicatedSegment.text == 'BANKRUPT') {
        alert('Oh no, you have gone BANKRUPT!');
    } else {
        alert("You have won " + indicatedSegment.text);
    }
}


async function handleSpinClick() {
    const betAmountInput = document.getElementById('betAmountInput');
    const betAmount = betAmountInput.value;
    console.log(betAmount)
    // Проверяем, что введено корректное значение ставки
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Please enter a valid bet amount.');
        return;
    }
    await placeBetAndSpin(betAmount);
    console.log(betAmount);
    // Вызываем getLastResult() для получения результата
    const result = await getLastResult();
    
    console.log(result);
    // Передаем результат в rotateWheelToSegment()
    rotateWheelToSegment(result);
}


function rotateWheelToSegment(segmentIndex) {
    if (wheelPower == 1) {
            theWheel.animation.spins = 1;
        } else if (wheelPower == 2) {
            theWheel.animation.spins = 2;
        } else if (wheelPower == 3) {
            theWheel.animation.spins = 5;
        }
    if (segmentIndex !== -1) {
        let stopAngle = theWheel.getRandomForSegment(segmentIndex);
        theWheel.animation.stopAngle = stopAngle;
        theWheel.startAnimation();
    } else {
        console.error("Segment with value " + segmentValue + " not found.");
    }
    // Disable the spin button so can't click again while wheel is spinning.
    document.getElementById('spin_button').src       = "spin_off.png";
    document.getElementById('spin_button').className = "";
    wheelSpinning = true;
}