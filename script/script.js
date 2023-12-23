const cat = document.querySelector(".cat");
const shadow = document.querySelector(".shadow");
const grass = document.querySelector(".grass");
const weather = document.querySelector(".weather");
const snow = document.querySelector(".snow");
const container = document.querySelector(".container");

function addControlHelpModal() {
  const help = document.createElement("div");
  container.append(help);
  help.className = "help__modal pixel";
  help.innerHTML = `
  <div class="help__controls"></div>
  `;
  help.addEventListener("click", () => {
    help.remove();
  });
  window.addEventListener("keydown", closeHandler);
  function closeHandler() {
    help.remove();
    removeEventListener("keydown", closeHandler);
  }
}

addControlHelpModal();

const catPosition = {
  catX: 0,
  catY: 80,
  endW: true,
  endA: true,
  endS: true,
  endD: true,
  onGround: true,
  startLocation: true,
  outBox: false,
  direction: 1,
};
cat.style.bottom = catPosition.catY + "px";
shadow.style.bottom = catPosition.catY - 12 + "px";

const level = {
  snowLength: 10000,
  pxPerMlSec: 0.24,
};

const anims = {
  walkAnim: [
    [
      // key frames
      {
        backgroundPosition: "-2970px",
      },
    ],
    {
      id: "walk",
      easing: "steps(15)",
      duration: 1500,
      iterations: Infinity,
    },
  ],

  snowMovement: [
    [{ left: 0 }, { left: "-1488px" }],
    {
      id: "snowMovement",
      // easing: "linear",
      duration: 4166,
      iterations: Infinity,
    },
  ],

  grassRight: [
    [{ backgroundPositionX: "-744px" }],
    {
      id: "grassRight",
      // easing: "steps(62)",
      duration: 3100,
      iterations: Infinity,
    },
  ],

  weather: [
    [{ backgroundPositionY: "654px" }],
    {
      id: "weather",
      easing: "cubic-bezier(.62,.63,.52,.44)",
      duration: 3100,
      iterations: Infinity,
    },
  ],
};

weather.animate(...anims.weather);

function catYMoving(direction, catPosition) {
  if (cat.getAnimations()[0] === undefined) cat.animate(...anims.walkAnim);
  const addMoveY = setInterval(() => {
    if (direction === "up") {
      if (catPosition.endW) clearInterval(addMoveY);
      if (catPosition.catY < 174) {
        catPosition.catY += 3;
      }
    } else if (direction === "down") {
      if (catPosition.endS) clearInterval(addMoveY);
      if (catPosition.catY > 0) {
        catPosition.catY -= 3;
        // if ((catPosition.catX + 48) % 54 === 0) {
        //   drowFootPrints();
        // }
      }
    }
    if (catPosition.catY % 8 === 0 && catPosition.endD && catPosition.endA) {
      drowFootPrints();
      drowFootPrints(true);
    }
    cat.style.bottom = catPosition.catY + "px";
    shadow.style.bottom = catPosition.catY - 12 + "px";
  }, 25);
}

function catXMoving(direction, catPosition) {
  if (cat.getAnimations()[0] === undefined) cat.animate(...anims.walkAnim);
  const addMoveX = setInterval(() => {
    if (direction === "right") {
      if (catPosition.endD) clearInterval(addMoveX);
      if (catPosition.catX < 170) {
        catPosition.catX += 6;
        if ((catPosition.catX + 48) % 54 === 0) {
          drowFootPrints();
        }
      } else {
        clearInterval(addMoveX);
        if (grass.getAnimations()[0] === undefined)
          grass.animate(...anims.grassRight).pause();
        weather.animate(...anims.grassRight).pause();

        grass
          .getAnimations()
          .find((e) => e.id === "grassRight")
          .play();
        weather
          .getAnimations()
          .find((e) => e.id === "grassRight")
          .play();
        snowMovement(direction);
        grass.getAnimations()[0].playbackRate = 1;
        weather.getAnimations()[1].playbackRate = 1;
        catPosition.outBox = true;
        intervalFootSteps();
        drowFootPrints();
      }
    } else if (direction === "left") {
      if (catPosition.endA) clearInterval(addMoveX);
      if (catPosition.catX > -170) {
        catPosition.catX -= 6;
        if ((catPosition.catX + 48) % 54 === 0) {
          drowFootPrints();
        }
      } else {
        clearInterval(addMoveX);
        console.log(grass.getAnimations()[0]);
        if (grass.getAnimations()[0] === undefined) return;
        grass
          .getAnimations()
          .find((e) => e.id === "grassRight")
          .play();
        weather
          .getAnimations()
          .find((e) => e.id === "grassRight")
          .play();
        snowMovement(direction);
        grass.getAnimations()[0].playbackRate = -1;
        weather.getAnimations()[1].playbackRate = -1;
        catPosition.outBox = true;
        intervalFootSteps();
        drowFootPrints();
      }
    }
    cat.style.left = catPosition.catX + "px";
    shadow.style.left = catPosition.catX + "px";
  }, 25);
}

// function addFootPrints() {
//   footPrints.push({
//     id: Date.now(),
//     left: Math.round(cat.getBoundingClientRect().right) - 60,
//     bottom: 0,
//   });
// }

function drowOneStep(xStatic) {
  const step = document.createElement("div");
  const deleteTimer = setTimeout(() => {
    step.style.opacity = "0";
    const removeTimer = setTimeout(() => {
      step.remove();
      clearTimeout(removeTimer);
    }, 3000);

    clearTimeout(deleteTimer);
  }, 6000);
  step.className = "step";

  let xPosition =
    cat.getBoundingClientRect().right -
    (catPosition.direction === 1 ? 60 : 168) +
    -snow.getBoundingClientRect().left;
  if (xStatic) {
    xPosition =
      cat.getBoundingClientRect().right -
      (catPosition.direction === 1 ? 120 : 60) +
      -snow.getBoundingClientRect().left;
  }

  let yPosition = cat.getBoundingClientRect().bottom - 12;
  step.style.left = `${xPosition}px`;
  step.style.top = `${yPosition}px`;
  snow.append(step);
}

function intervalFootSteps() {
  let stepsIntervalOutBox = setInterval(() => {
    drowOneStep();
    if (!catPosition.outBox) clearInterval(stepsIntervalOutBox);
  }, 225);
}

function drowFootPrints(prop) {
  drowOneStep(prop);
}

function snowMovement(direction) {
  if (snow.getAnimations().find((e) => e.id === "snowMovement") === undefined) {
    anims.snowMovement[0] = [
      { left: `0px` },
      { left: `${-level.snowLength - window.innerWidth}px` },
    ];
    anims.snowMovement[1].duration = Math.round(
      (level.snowLength + window.innerWidth) / level.pxPerMlSec
    );
    snow.animate(...anims.snowMovement).pause();
  }

  if (direction === "right") {
    snow.getAnimations().find((e) => e.id === "snowMovement").playbackRate = 1;
    snow
      .getAnimations()
      .find((e) => e.id === "snowMovement")
      .play();
  } else {
    if (direction === "left") {
      snow.getAnimations().find((e) => e.id === "snowMovement").playbackRate =
        -1;
      snow
        .getAnimations()
        .find((e) => e.id === "snowMovement")
        .play();
    }
  }
  console.log(snow.getAnimations().find((e) => e.id === "snowMovement"));
  console.log(anims.snowMovement);
}

const eventsKeyDown = {
  KeyW() {
    if (!catPosition.endS) return;
    catPosition.endW = false;
    catYMoving("up", catPosition);
  },
  KeyA() {
    if (!catPosition.endD) return;
    cat.style.transform = " scale(-1, 1)";
    shadow.style.transform = " scale(-1, 1)";
    catPosition.direction = -1;
    catPosition.endA = false;
    catXMoving("left", catPosition);
  },

  KeyS() {
    if (!catPosition.endW) return;
    catPosition.endS = false;
    catYMoving("down", catPosition);
  },
  KeyD() {
    if (!catPosition.endA) return;
    cat.style.transform = "";
    shadow.style.transform = "";
    catPosition.direction = 1;
    catPosition.endD = false;
    catXMoving("right", catPosition);
  },
};

window.addEventListener("keydown", (e) => {
  if (
    e.repeat &&
    (!catPosition.endW ||
      !catPosition.endA ||
      !catPosition.endS ||
      !catPosition.endD)
  ) {
    return;
  }
  eventsKeyDown[e.code]();
});

const eventsKeyUp = {
  KeyW() {
    catPosition.endW = true;
    if (catPosition.endS && catPosition.endA && catPosition.endD) {
      cat
        .getAnimations()
        .find((e) => e.id === "walk")
        .cancel();
    }
  },
  KeyA() {
    if (catPosition.endW && catPosition.endS && catPosition.endD) {
      cat
        .getAnimations()
        .find((e) => e.id === "walk")
        .cancel();
    }
    if (catPosition.endD) {
      catPosition.endA = true;
      catPosition.outBox = false;
      grass.getAnimations().forEach((e) => e.pause());
      if (weather.getAnimations()[1] === undefined) return;
      weather
        .getAnimations()
        .find((e) => e.id === "grassRight")
        .pause();

      snow
        .getAnimations()
        .find((e) => e.id === "snowMovement")
        .pause();
    }
  },
  KeyS() {
    catPosition.endS = true;
    if (catPosition.endW && catPosition.endA && catPosition.endD) {
      cat
        .getAnimations()
        .find((e) => e.id === "walk")
        .cancel();
    }
  },
  KeyD() {
    if (catPosition.endS && catPosition.endA && catPosition.endW) {
      cat
        .getAnimations()
        .find((e) => e.id === "walk")
        .cancel();
    }
    if (catPosition.endA) {
      catPosition.endD = true;
      catPosition.outBox = false;

      grass.getAnimations().forEach((e) => e.pause());
      weather
        .getAnimations()
        .find((e) => e.id === "grassRight")
        .pause();

      snow
        .getAnimations()
        .find((e) => e.id === "snowMovement")
        .pause();
    }
  },
};

window.addEventListener("keyup", (e) => {
  eventsKeyUp[e.code]();
});
