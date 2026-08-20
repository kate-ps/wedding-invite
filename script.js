/* =========================================================
   ELEMENTS
========================================================= */

const loader = document.getElementById("loader");

const intro = document.getElementById("intro");

const invitation =
  document.getElementById("invitation");

const envelope =
  document.getElementById("envelope");

const waxSeal =
  document.getElementById("waxSeal");

const music =
  document.getElementById("weddingMusic");

const musicButton =
  document.getElementById("musicButton");

const backToTop =
  document.getElementById("backToTop");

const rsvpForm =
  document.getElementById("rsvpForm");

const rsvpSuccess =
  document.getElementById("rsvpSuccess");


/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

  setTimeout(() => {

    loader.classList.add("hide");

    document.body.classList.add("no-scroll");

  }, 900);

});


/* =========================================================
   OPEN INVITATION
========================================================= */

let invitationOpened = false;

waxSeal.addEventListener("click", () => {

  if (invitationOpened) return;

  invitationOpened = true;

  envelope.classList.add("open");

  /*
    Music is started after interaction because
    mobile browsers normally block autoplay.
  */

  music.volume = 0.45;

  music.play()
    .then(() => {
      musicButton.classList.remove("paused");
    })
    .catch(() => {
      musicButton.classList.add("paused");
    });


  /*
    Allow the letter animation to finish.
  */

  setTimeout(() => {

    invitation.classList.remove("hidden");

  }, 700);


  /*
    Slide the intro upward.
  */

  setTimeout(() => {

    intro.classList.add("opened");

    document.body.classList.remove("no-scroll");

    activateRevealAnimations();

  }, 1750);

});


/* =========================================================
   MUSIC CONTROLS
========================================================= */

let musicPlaying = true;

musicButton.addEventListener("click", () => {

  if (music.paused) {

    music.play();

    musicPlaying = true;

    musicButton.classList.remove("paused");

  } else {

    music.pause();

    musicPlaying = false;

    musicButton.classList.add("paused");

  }

});


/* =========================================================
   COUNTDOWN
========================================================= */

/*
  IMPORTANT:
  Change this to the real wedding date.

  Format:

  YYYY-MM-DDTHH:MM:SS
*/

const weddingDate =
  new Date("2026-12-12T18:00:00");


function updateCountdown() {

  const now = new Date();

  const distance =
    weddingDate.getTime() - now.getTime();


  if (distance <= 0) {

    document.getElementById("days").textContent =
      "00";

    document.getElementById("hours").textContent =
      "00";

    document.getElementById("minutes").textContent =
      "00";

    document.getElementById("seconds").textContent =
      "00";

    return;

  }


  const days =
    Math.floor(
      distance /
      (1000 * 60 * 60 * 24)
    );


  const hours =
    Math.floor(
      (distance %
        (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );


  const minutes =
    Math.floor(
      (distance %
        (1000 * 60 * 60)) /
      (1000 * 60)
    );


  const seconds =
    Math.floor(
      (distance %
        (1000 * 60)) /
      1000
    );


  document.getElementById("days").textContent =
    String(days).padStart(2, "0");


  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");


  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");


  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

function activateRevealAnimations() {

  const revealElements =
    document.querySelectorAll(".reveal");


  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target
              .classList
              .add("visible");

            observer.unobserve(
              entry.target
            );

          }

        });

      },

      {
        threshold: 0.15,
        rootMargin:
          "0px 0px -40px 0px"
      }

    );


  revealElements.forEach(element => {

    observer.observe(element);

  });

}


/* =========================================================
   SCRATCH CARD
========================================================= */

const scratchCanvas =
  document.getElementById("scratchCanvas");

const scratchContext =
  scratchCanvas.getContext("2d");

let scratching = false;

let scratchInitialized = false;


function initializeScratchCard() {

  const rect =
    scratchCanvas
      .getBoundingClientRect();


  const pixelRatio =
    window.devicePixelRatio || 1;


  scratchCanvas.width =
    rect.width * pixelRatio;

  scratchCanvas.height =
    rect.height * pixelRatio;


  scratchContext.scale(
    pixelRatio,
    pixelRatio
  );


  /*
    Scratch cover.
  */

  const gradient =
    scratchContext.createLinearGradient(
      0,
      0,
      rect.width,
      rect.height
    );


  gradient.addColorStop(
    0,
    "#caa863"
  );

  gradient.addColorStop(
    0.5,
    "#e1c47c"
  );

  gradient.addColorStop(
    1,
    "#aa813c"
  );


  scratchContext.fillStyle =
    gradient;


  scratchContext.fillRect(
    0,
    0,
    rect.width,
    rect.height
  );


  /*
    Decorative scratch text.
  */

  scratchContext.fillStyle =
    "rgba(87, 53, 15, 0.75)";


  scratchContext.textAlign =
    "center";


  scratchContext.font =
    "500 12px Montserrat";


  scratchContext.fillText(
    "SCRATCH HERE",
    rect.width / 2,
    rect.height / 2
  );


  scratchContext.font =
    "26px Cormorant Garamond";


  scratchContext.fillText(
    "✦",
    rect.width / 2,
    rect.height / 2 - 35
  );


  scratchContext.globalCompositeOperation =
    "destination-out";


  scratchInitialized = true;

}


function getPointerPosition(event) {

  const rect =
    scratchCanvas
      .getBoundingClientRect();


  let clientX;
  let clientY;


  if (event.touches) {

    clientX =
      event.touches[0].clientX;

    clientY =
      event.touches[0].clientY;

  } else {

    clientX =
      event.clientX;

    clientY =
      event.clientY;

  }


  return {

    x: clientX - rect.left,
    y: clientY - rect.top

  };

}


function scratch(event) {

  if (!scratching) return;


  event.preventDefault();


  const position =
    getPointerPosition(event);


  scratchContext.beginPath();


  scratchContext.arc(
    position.x,
    position.y,
    24,
    0,
    Math.PI * 2
  );


  scratchContext.fill();

}


function startScratch(event) {

  scratching = true;

  scratch(event);

}


function stopScratch() {

  scratching = false;

}


scratchCanvas.addEventListener(
  "mousedown",
  startScratch
);

scratchCanvas.addEventListener(
  "mousemove",
  scratch
);

scratchCanvas.addEventListener(
  "mouseup",
  stopScratch
);

scratchCanvas.addEventListener(
  "mouseleave",
  stopScratch
);


scratchCanvas.addEventListener(
  "touchstart",
  startScratch,
  { passive: false }
);

scratchCanvas.addEventListener(
  "touchmove",
  scratch,
  { passive: false }
);

scratchCanvas.addEventListener(
  "touchend",
  stopScratch
);


const scratchObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (
          entry.isIntersecting &&
          !scratchInitialized
        ) {

          initializeScratchCard();

        }

      });

    },

    {
      threshold: 0.3
    }

  );


scratchObserver.observe(
  scratchCanvas
);


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    if (scratchInitialized) {

      /*
        Recreating the layer is safer on rotation.
      */

      scratchInitialized = false;

      initializeScratchCard();

    }

  }
);


/* =========================================================
   RSVP
========================================================= */

/*
  Right now this creates the interaction only.

  We can connect it to:

  - Google Sheets
  - Formspree
  - Google Forms
  - Firebase
  - Supabase

  so you actually receive the RSVP responses.
*/

rsvpForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    rsvpForm.style.display =
      "none";


    rsvpSuccess
      .classList
      .add("show");

  }
);


/* =========================================================
   BACK TO TOP
========================================================= */

backToTop.addEventListener(
  "click",
  () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);
