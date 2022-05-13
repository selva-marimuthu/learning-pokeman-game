const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsArr = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsArr.push(collisions.slice(i, i + 70));
}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];
const offset = { x: -880, y: -440 };

collisionsArr.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const mapImage = new Image();
mapImage.src = "./img/aldwyn.png";

const playerImg = new Image();
playerImg.src = "./img/playerDown.png";

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.velocity = velocity;
    this.frames = frames;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw() {
    ctx.drawImage(
      this.image,
      0, // Crop Image X - Start
      0, // Crop Image Y - Start
      this.image.width / this.frames.max, // Crope Image X - End
      this.image.height, // Crop Image Y - End
      this.position.x, // Draw Image in Canvas - X Position
      this.position.y, // Draw Image in Canvas - Y Position
      this.image.width / this.frames.max, // Cropped Image Render Width
      this.image.height // Cropped Image Render Height
    );
  }
}

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImg,
  frames: { max: 4 },
});

const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: mapImage,
});

let lastKey = "";
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries];

function rectangularCollision({ rec1, rec2 }) {
  return (
    rec1.position.x + rec1.width >= rec2.position.x &&
    rec1.position.x <= rec2.position.x + rec2.width &&
    rec1.position.y + rec1.height >= rec2.position.y &&
    rec1.position.y <= rec2.position.y + rec2.height
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
    if (rectangularCollision({ rec1: player, rec2: boundary })) {
      console.log("collision");
    }
  });
  player.draw();

  let moving = true;

  if (keys.w.pressed && lastKey === "w") {
    for (i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rec1: player,
          rec2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        console.log("collision");
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    }
  } else if (keys.a.pressed && lastKey === "a") {
    for (i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rec1: player,
          rec2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("collision");
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
    }
  } else if (keys.s.pressed && lastKey === "s") {
    for (i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rec1: player,
          rec2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log("collision");
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
    }
  } else if (keys.d.pressed && lastKey === "d") {
    for (i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rec1: player,
          rec2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("collision");
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
    }
  }
}

animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
