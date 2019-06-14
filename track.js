function setup() {
    createCanvas(400, 400);
    angle = radians(0);
    fps = 30;
}

function draw() {
    background(220);

    // origin
    translate(height / 2, width / 2)

    // rotation settings
    frameRate(fps);
    angle += radians(3);
    rotate(angle);

    //track settings
    stroke(0);
    strokeWeight(2);
    fill(0, 130, 210, 255);

    // 1/4 note track
    arc(0, 0, 250, 250, radians(0), radians(90), PIE)
    arc(0, 0, 250, 250, radians(90), radians(180), PIE)
    arc(0, 0, 250, 250, radians(180), radians(270), PIE)
    arc(0, 0, 250, 250, radians(270), radians(360), PIE)


    fill(40, 130, 80, 255);
    circle(0, 0, 200, 200)
    // 1/3 note track
    arc(0, 0, 200, 200, radians(0), radians(120), PIE)
    arc(0, 0, 200, 200, radians(120), radians(240), PIE)
    arc(0, 0, 200, 200, radians(240), radians(360), PIE)


    fill(220);
    circle(0, 0, 100, 100);


    fill(220);
    circle(0, 0, 100, 100);
}