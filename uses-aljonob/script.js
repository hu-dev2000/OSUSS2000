document.addEventListener("DOMContentLoaded", () => {
  // Initialize sliders for Residential Complex projects only
  const sliderContainers = document.querySelectorAll(".slider-container");

  sliderContainers.forEach((container) => {
    const slider = container.querySelector(".slider");
    const itemWidth = slider.children[0].offsetWidth;
    const itemsLength = slider.children.length;

    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;

    // Touch events for mobile
    slider.addEventListener("touchstart", touchStart);
    slider.addEventListener("touchend", touchEnd);
    slider.addEventListener("touchmove", touchMove);

    // Mouse events for desktop
    slider.addEventListener("mousedown", touchStart);
    slider.addEventListener("mouseup", touchEnd);
    slider.addEventListener("mouseleave", touchEnd);
    slider.addEventListener("mousemove", touchMove);

    // Prevent image drag behavior
    const images = slider.querySelectorAll("img");
    images.forEach((img) => {
      img.addEventListener("dragstart", (e) => e.preventDefault());
    });

    function touchStart(event) {
      if (event.type === "mousedown") {
        event.preventDefault();
        isDragging = true;
        startPosition = event.clientX;
      } else {
        isDragging = true;
        startPosition = event.touches[0].clientX;
      }

      animationID = requestAnimationFrame(animation);
      slider.classList.add("active"); // Add active class for visual feedback
    }

    function touchEnd() {
      isDragging = false;
      cancelAnimationFrame(animationID);

      const movedBy = currentTranslate - prevTranslate;

      // If moved significantly (more than 100px) then slide to next image
      if (movedBy < -100 && currentIndex < itemsLength - 1) {
        currentIndex += 1;
      } else if (movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1;
      }

      setPositionByIndex();
      slider.classList.remove("active"); // Remove active class
    }

    function touchMove(event) {
      if (isDragging) {
        const currentPosition =
          event.type === "touchmove" ? event.touches[0].clientX : event.clientX;
        const diff = currentPosition - startPosition;
        currentTranslate = prevTranslate + diff;
      }
    }

    function animation() {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
      slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
      currentTranslate = currentIndex * -itemWidth;
      prevTranslate = currentTranslate;
      setSliderPosition();
    }

    // Initialize slider position
    setPositionByIndex();
  });
});
