function setup() {
    createCanvas(400, 400);
    angle = radians(0);
    fps = 60;
}

function draw() {
    background(220);
    frameRate(fps);

    translate(height / 2, width / 2)
    angle += radians(1);
    rotate(angle);
    fill(0, 130, 210, 105);
    circle(0, 0, 200, 200);
    stroke(0);
    strokeWeight(2);
    line(0, 0, 0, -100);
    line(0, 0, 0, 100);
    line(0, 0, -100, 0);
    line(0, 0, 100, 0);
    fill(220);
    circle(0, 0, 100, 100);
}