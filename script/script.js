const cat = document.querySelector(".cat");
const shadow = document.querySelector(".shadow");
const grass = document.querySelector(".grass");
const weather = document.querySelector(".weather");
const snow = document.querySelector(".snow");
const steps = document.querySelector(".steps");
console.log(cat);
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

  footPrintsLeft: [
    [{ left: "-1488px" }],
    {
      id: "footPrintsLeft",
      // easing: "linear",
      duration: 6200,
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

const catPosition = {
  catX: 0,
  end: false,
  onGround: true,
  startLocation: true,
  outBox: false,
};

function catXMoving(direction, catPosition) {
  const addMove = setInterval(() => {
    if (catPosition.end) clearInterval(addMove);
    if (direction === "right") {
      if (catPosition.catX < 170) {
        catPosition.catX += 6;
        if ((catPosition.catX + 48) % 54 === 0) {
          drowFootPrints();
        }
      } else {
        clearInterval(addMove);
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

        grass.getAnimations()[0].playbackRate = 1;
        weather.getAnimations()[1].playbackRate = 1;
        catPosition.outBox = true;
        intervalFootSteps();
        drowFootPrints();
      }
    } else if (catPosition.catX > -170) catPosition.catX -= 6;
    else {
      clearInterval(addMove);
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

      grass.getAnimations()[0].playbackRate = -1;
      weather.getAnimations()[1].playbackRate = -1;
      catPosition.outBox = true;
      intervalFootSteps();
      console.log(grass.getAnimations());
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

function drowOneStep() {
  const step = document.createElement("div");
  const deleteTimer = setTimeout(() => {
    step.style.opacity = "0";
    const removeTimer = setTimeout(() => {
      step.remove();
      clearTimeout(removeTimer);
    }, 3000);

    clearTimeout(deleteTimer);
  }, 3200);
  step.className = "step";
  let xPosition = cat.getBoundingClientRect().right - 60;
  step.style.left = `${xPosition}px`;
  steps.append(step);
  anims.footPrintsLeft[0] = [
    { left: `${xPosition}px` },
    { left: `${xPosition - 1488}px` },
  ];
  console.log(anims.footPrintsLeft);

  if (catPosition.outBox) step.animate(...anims.footPrintsLeft).play();
  else step.animate(...anims.footPrintsLeft).pause();
}

function intervalFootSteps() {
  let stepsIntervalOutBox = setInterval(() => {
    drowOneStep();
    if (!catPosition.outBox) clearInterval(stepsIntervalOutBox);
  }, 225);
}

function drowFootPrints() {
  if (catPosition.catX > -170 && catPosition.catX < 170) {
    drowOneStep();
  } else {
    if (grass.getAnimations()[0] !== undefined) {
      if (grass.getAnimations()[0].playbackRate === 1 && !catPosition.end) {
        steps.querySelectorAll(".step").forEach((step) => {
          step
            .getAnimations()
            .find((e) => e.id === "footPrintsLeft")
            .play();
          console.log(step.getAnimations());
        });
      }
    }
  }
}

// if (grass.getAnimations()[0] !== undefined) {
//   if (
//     grass.getAnimations()[0].playbackRate === 1 &&
//     catPosition.catX >= 150
//   ) {
//     footPrints.forEach((e) => {
//       console.log(e.left);
//       e.left -= 6;
//     });
//     console.log("get");
//     steps.innerHTML = " ";
//   }
// }
// footPrints.forEach(({ left }) => {
//   const step = document.createElement("div");
//   step.className = "step";
//   step.style.left = `${left}px`;
//   steps.append(step);
// });

// const step = document.createElement("div");
// step.className = "step";
// step.style.left = `${footPrints.left}px`;
// steps.append(step);

// if (grass.getAnimations()[0] === undefined) return;
// if (grass.getAnimations()[0].playbackRate === 1) {
//   const step = document.createElement("div");
//   step.className = "step";
//   step.style.left = `${
//     steps.querySelector(".step").getBoundingClientRect().right - 54
//   }px`;
//   steps.append(step);
// }
// }
window.addEventListener("keydown", (e) => {
  if (cat.getAnimations()[0] !== undefined) return;
  switch (e.code) {
    case "KeyD":
      cat.style.transform = "";
      shadow.style.transform = "";
      cat.animate(...anims.walkAnim);
      catPosition.end = false;
      catXMoving("right", catPosition);

      break;
    case "KeyA":
      cat.style.transform = " scale(-1, 1)";
      shadow.style.transform = " scale(-1, 1)";
      cat.animate(...anims.walkAnim);
      catPosition.end = false;
      catXMoving("left", catPosition);

      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyD":
      cat
        .getAnimations()
        .find((e) => e.id === "walk")
        .cancel();
      catPosition.end = true;
      catPosition.outBox = false;

      grass.getAnimations().forEach((e) => e.pause());
      weather
        .getAnimations()
        .find((e) => e.id === "grassRight")
        .pause();
      steps.querySelectorAll(".step").forEach((e) => {
        e.getAnimations()
          .find((e) => e.id === "footPrintsLeft")
          .pause();
      });
      break;
    case "KeyA":
      cat
        .getAnimations()
        .find((e) => e.id === "walk")
        .cancel();
      catPosition.end = true;
      catPosition.outBox = false;
      grass.getAnimations().forEach((e) => e.pause());
      if (weather.getAnimations()[1] === undefined) return;
      weather
        .getAnimations()
        .find((e) => e.id === "grassRight")
        .pause();
      steps.querySelectorAll(".step").forEach((e) => {
        e.getAnimations()
          .find((e) => e.id === "footPrintsLeft")
          .pause();
      });
      break;
  }
});
