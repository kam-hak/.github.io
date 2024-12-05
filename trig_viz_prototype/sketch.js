let angle = 0; // Current angle in radians
let angleSpeed = 0.01; // Speed of angle change
let useSlider = false; // Flag to determine if slider is used
let isPlaying = true; // Animation state

function setup() {
  // Create a canvas
  createCanvas(600, 600);
  angleMode(RADIANS); // Use radians for angles

  // Get the slider element
  let slider = select('#angleSlider');
  slider.input(() => {
    useSlider = true;
    angle = radians(slider.value());
    select('#angleValue').html(slider.value());
  });

  // Get the play/pause button
  let playPauseBtn = select('#playPauseBtn');
  playPauseBtn.mousePressed(togglePlayPause);
}

function togglePlayPause() {
  isPlaying = !isPlaying;
  let btn = select('#playPauseBtn');
  btn.html(isPlaying ? 'Pause' : 'Play');
}

function draw() {
  background(255);

  // Translate to center
  translate(width / 2, height / 2);

  // Invert y-axis to match standard unit circle orientation
  scale(1, -1);

  // Draw axes
  stroke(200);
  strokeWeight(1);
  line(-width / 2, 0, width / 2, 0); // X-axis
  line(0, -height / 2, 0, height / 2); // Y-axis

  // Draw Unit Circle
  stroke(0);
  strokeWeight(2);
  noFill();
  ellipse(0, 0, 200, 200); // Radius 100

  // Calculate point on the unit circle
  let x = 100 * cos(angle);
  let y = 100 * sin(angle);

  // Draw the angle line
  stroke('blue');
  strokeWeight(2);
  line(0, 0, x, y);

  // Draw projections
  stroke('green');
  strokeWeight(1);
  line(x, y, x, 0); // Cosine projection
  line(x, y, 0, y); // Sine projection

  // Display cosine value
  push();
  scale(1, -1); // Revert y-axis for correct text orientation
  fill(0);
  textSize(16);
  text(`cos(θ) = ${cos(angle).toFixed(2)}`, x + 10, y / 2);
  pop();

  // Display sine value
  push();
  scale(1, -1); // Revert y-axis for correct text orientation
  fill(0);
  textSize(16);
  // Position the sin(theta) label near the sine projection line with slight offset
  text(`sin(θ) = ${sin(angle).toFixed(2)}`, x + 10, y + 20);
  pop();

  // Draw Tangent and Secant lines
  if (cos(angle) !== 0) { // Avoid division by zero
    let tanVal = tan(angle);
    let secVal = 1 / cos(angle);

    // Tangent Line
    stroke('red');
    strokeWeight(1);
    // Limit the length of the tangent line for visibility
    let tanY = 100 * tanVal;
    if (abs(tanY) > height / 2 - 50) { // Adjusted to prevent going off-canvas
      tanY = (tanY > 0 ? height / 2 - 50 : -height / 2 + 50);
    }
    line(100, 0, 100, tanY);

    // Label the Tangent line
    push();
    scale(1, -1); // Revert y-axis for correct text orientation
    fill('red');
    textSize(14);
    // Position the label near the end of the tangent line with slight offset
    text(`tan(θ)= ${tanVal.toFixed(2)}`, 105, -tanY + 10);
    pop();

    // Secant Line
    stroke('purple');
    strokeWeight(1);
    // Limit the length of the secant line for visibility
    let secX = 100 * secVal;
    if (abs(secX) > width / 2 - 50) { // Adjusted to prevent going off-canvas
      secX = (secX > 0 ? width / 2 - 50 : -width / 2 + 50);
    }
    line(0, 0, secX, 0);

    // Label the Secant line
    push();
    scale(1, -1); // Revert y-axis for correct text orientation
    fill('purple');
    textSize(14);
    // Position the label near the end of the secant line with slight offset
    text(`sec(θ) = ${secVal.toFixed(2)}`, secX / 2 - 20, -10);
    pop();
  } else {
    // When cos(angle) is 0, tangent and secant are undefined
    push();
    scale(1, -1); // Revert y-axis for correct text orientation
    fill('red');
    text('tan(θ) undefined', 110, -100);
    fill('purple');
    text('sec(θ) undefined', 110, 10);
    pop();
  }

  // Increment angle if not using slider and if animation is playing
  if (!useSlider && isPlaying) {
    angle += angleSpeed;
    if (angle > TWO_PI) {
      angle = 0;
    }
    // Update slider position
    let slider = select('#angleSlider');
    slider.value(degrees(angle));
    select('#angleValue').html(degrees(angle).toFixed(0));
  }
}
