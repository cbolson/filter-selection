document.addEventListener("DOMContentLoaded", () => {
  // selectors
  const popartEl = document.getElementById("popart");
  const buttons = document.querySelectorAll(
    "button[data-type][data-direction]"
  );
  const controlContrast = document.getElementById("control-contrast");
  const controlBrightness = document.getElementById("control-brightness");
  const controlHue = document.getElementById("control-hue");
  const controlSaturate = document.getElementById("control-saturate");
  const btnImageSwap = document.getElementById("btn-image");

  const IMAGES = [
    "https://images.pexels.com/photos/46505/swiss-shepherd-dog-dog-pet-portrait-46505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/18500444/pexels-photo-18500444/free-photo-of-portrait-of-woman-holding-a-rose.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];
  //https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
  let currentFilterValue = "";
  let currentImgIndex = IMAGES[0];

  // Get initial values of custom variables
  let initialSaturate = parseFloat(
    getComputedStyle(popartEl).getPropertyValue("--saturate")
  );
  let initialBrightness = parseFloat(
    getComputedStyle(popartEl).getPropertyValue("--brightness")
  );
  let initialContrast = parseFloat(
    getComputedStyle(popartEl).getPropertyValue("--contrast")
  );
  let initialHueRotate = parseFloat(
    getComputedStyle(popartEl).getPropertyValue("--hue-rotate")
  );

  // Store the initial values for resetting
  const initialFilterValues = {
    saturate: initialSaturate,
    brightness: initialBrightness,
    contrast: initialContrast,
    hueRotate: initialHueRotate,
  };

  // reset values to inital values
  function resetValues() {
    // Reset filter values to their initial values
    initialSaturate = initialFilterValues.saturate;
    initialBrightness = initialFilterValues.brightness;
    initialContrast = initialFilterValues.contrast;
    initialHueRotate = initialFilterValues.hueRotate;

    popartEl.style.setProperty("--saturate", `${initialSaturate}%`);
    popartEl.style.setProperty("--brightness", `${initialBrightness}%`);
    popartEl.style.setProperty("--contrast", `${initialContrast}%`);
    popartEl.style.setProperty("--hue-rotate", `${initialHueRotate}deg`);

    // Update control elements
    updateControl(controlSaturate, initialSaturate, 200);
    updateControl(controlBrightness, initialBrightness, 200);
    updateControl(controlContrast, initialContrast, 200);
    updateControl(controlHue, initialHueRotate, 360);

    // Update filter code display
    updateFilterCode();
  }

  // update CSS filter property and display it
  function updateFilterCode() {
    const filterValue = `saturate(${initialSaturate}%) brightness(${initialBrightness}%) hue-rotate(${initialHueRotate}deg) contrast(${initialContrast}%)`;
    // document.getElementById("code").textContent = `filter: ${filterValue};`;
    currentFilterValue = `filter: ${filterValue};`;
  }

  // update control element custom property
  function updateControl(controlElement, value, max) {
    // these are defined by the design - they are the max visible degrees due to the clip-path
    const minDegree = 275;
    const maxDegree = 355;
    let currentValue;

    if (value <= max) {
      currentValue = (value / max) * (maxDegree - minDegree) + minDegree;
    } else {
      currentValue =
        ((value - max) / max) * (maxDegree - minDegree) + maxDegree;
    }
    currentValue %= 360;
    if (currentValue < 0) {
      currentValue += 360;
    }
    controlElement.style.setProperty("--deg", `${currentValue}deg`);
  }

  // Update CSS filter property and display it
  updateFilterCode();

  // buttons - filter elements
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const dataType = button.getAttribute("data-type");
      const dataDirection = button.getAttribute("data-direction");

      switch (dataType) {
        case "saturate":
          initialSaturate = adjustVariable(
            initialSaturate,
            dataDirection,
            10,
            0,
            200
          );
          popartEl.style.setProperty("--saturate", `${initialSaturate}%`);
          updateControl(controlSaturate, initialSaturate, 200);
          break;
        case "brightness":
          initialBrightness = adjustVariable(
            initialBrightness,
            dataDirection,
            10,
            0,
            200
          );
          popartEl.style.setProperty("--brightness", `${initialBrightness}%`);
          updateControl(controlBrightness, initialBrightness, 200);
          break;
        case "contrast":
          initialContrast = adjustVariable(
            initialContrast,
            dataDirection,
            10,
            0,
            200
          );
          popartEl.style.setProperty("--contrast", `${initialContrast}%`);
          updateControl(controlContrast, initialContrast, 200);
          break;
        case "hue-rotate":
          initialHueRotate = adjustVariable(
            initialHueRotate,
            dataDirection,
            10,
            0,
            360
          );
          popartEl.style.setProperty("--hue-rotate", `${initialHueRotate}deg`);
          updateControl(controlHue, initialHueRotate, 360);
          break;
        default:
          break;
      }

      // Update CSS filter property for copying
      updateFilterCode();
    });
  });

  // button -  copy
  document.getElementById("btn-copy").addEventListener("click", () => {
    navigator.clipboard.writeText(currentFilterValue);
    // Notify the user that the filter value has been copied
    alert("Filter value copied to clipboard!");
  });

  // button - reset values
  document.getElementById("btn-reset").addEventListener("click", () => {
    resetValues();
  });

  resetValues();

  // adjust custom variable value with maximum limit
  function adjustVariable(initialValue, direction, step, minValue, maxValue) {
    let newValue;
    if (direction === "plus") {
      newValue = initialValue + step;
    } else if (direction === "minus") {
      newValue = initialValue - step;
    }
    return Math.min(Math.max(newValue, minValue), maxValue);
  }

  // Function to get a random image index different from the current one
  function getRandomImageIndex(currentIndex) {
    let newIndex = Math.floor(Math.random() * IMAGES.length);
    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * IMAGES.length);
    }
    return newIndex;
  }

  // Add event listener to the button
  btnImageSwap.addEventListener("click", function () {
    // Get a random image index different from the current one
    const newIndex = getRandomImageIndex(currentImgIndex);

    // Update currentImgIndex
    currentImgIndex = newIndex;

    // Update images within popartEl
    popartEl.querySelectorAll("img").forEach((img) => {
      img.style.opacity = "0";
      setTimeout(() => (img.src = IMAGES[newIndex]), 400);
      setTimeout(() => (img.style.opacity = "1"), 500);
    });
  });
});
