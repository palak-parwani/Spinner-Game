document.addEventListener("DOMContentLoaded", function () {
    const degree = 360; // Full rotation degree
    const sectionDegrees = 58; // Each section's rotation degree
    const spinDuration = 7000; // Duration of spin in milliseconds
    const fastSpinDuration = 4000; // Duration for faster spin
    const targetSections = {
        "Double Your Bonus": 149, // Degree for "Double Your Bonus"
        "200 AED": 185 // Degree for "200 AED"
    };
    let clicks = 0;

    // Check localStorage for last spin time
    const lastSpin = localStorage.getItem("lastSpin");
    const now = new Date().getTime();

    // Restrict spinning for the defined period
     if (lastSpin && now - lastSpin < 24 * 60 * 60 * 1000) {   
        document.getElementById("spin").removeEventListener("click", spinHandler);
        hideModal("spinandwheelmodal2");
        showModal("tryAgainModal");
        return;
    }

    const spinButton = document.getElementById("spin");
    spinButton.addEventListener("click", spinHandler);

    function spinHandler(e) {
        e.preventDefault();
    
        // Select the spin element
        const spinElement = document.getElementById("spin");
    
        // Prevent multiple clicks during a spin
        if (spinElement.classList.contains("disabled")) {
            hideModal("spinandwheelmodal2");
            showModal("tryAgainModal");
            return;
        }
    
        clicks++;
    
        // Disable the spin element temporarily during the spin
        spinElement.classList.add("disabled");
    
        if (clicks === 1) {
            // First spin: Stops at "Double Your Bonus"
            spinWheel(targetSections["Double Your Bonus"], true, 5, spinDuration); // Spins 5 full rounds
            // Re-enable after spin completes
            setTimeout(() => {
                spinElement.classList.remove("disabled");
            }, spinDuration);
        } else if (clicks === 2) {
            // Second spin: Stops at "200 AED", and rotate 15-20 rounds
            spinWheel(targetSections["200 AED"], false, 20, fastSpinDuration); // Spins 20 full rounds (faster speed)
            // Permanently disable after second spin completes
            setTimeout(() => {
                localStorage.setItem("lastSpin", new Date().getTime());
                spinElement.classList.remove("disabled");
            }, fastSpinDuration);
        } else {
            // Lock spinning after the second spin
            localStorage.setItem("lastSpin", new Date().getTime());
            hideModal("spinandwheelmodal2");
            showModal("tryAgainModal");
        }
    }
    
    

    // Spin the wheel function
    function spinWheel(targetDegree, doubleData, spins, duration) {
        const totalDegree = spins * degree + targetDegree + Math.random() * (sectionDegrees / 2) - (sectionDegrees / 4);

        // Apply rotation to the spinner with the specific duration
        const innerWheel = document.getElementById("inner-wheel");
        innerWheel.style.transform = `rotate(${totalDegree}deg)`;
        innerWheel.style.transition = `all ${duration / 1000}s cubic-bezier(0,.99,.44,.99)`; // Faster spin for second spin

        // Handle results after spin
        setTimeout(() => {
            if (doubleData) {
                // Double the data on the spinner and allow another spin
                doubleSpinnerData();
            } else {
                // Delay showing the congratulations modal by 1 second
                setTimeout(() => {
                    showModal("congratsModal");
                }, 1000);
            }
        }, duration); // Adjusted time to match the duration of the faster spin
    }

    function doubleSpinnerData() {
        const section1 = document.getElementById("spinner-section-1");
        const section2 = document.getElementById("spinner-section-2");
        const section3 = document.getElementById("spinner-section-3");
        const section4 = document.getElementById("spinner-section-4");
    
        // Define the new text content for each section
        const newContent = [
            "100 AED OFF", // for spinner-section-1
            "200 AED OFF", // for spinner-section-2
            "100 AED OFF", // for spinner-section-3
            "200 AED OFF", // for spinner-section-4
        ];
    
        // Apply styles and update content for each section
        [section1, section2, section3, section4].forEach((section, index) => {
            if (section) {
                section.style.transition = "all 0.5s ease-in-out"; 
                // section.style.opacity = "0"; 
    
                setTimeout(() => {
                    // Set content based on the index
                    section.textContent = newContent[index];
    
                    section.style.fontSize = "16px";
                    section.style.opacity = "1"; 
                    section.style.transform = "scale(1.2) rotate(92deg)";
    
                    // Reset transform after animation
                    setTimeout(() => {
                        section.style.transform = "scale(1) rotate(92deg)";
                    }, 500);
                }, 200); 
            }
        });
    }
    
    

    // Utility functions for modals
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    }
    
    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }
    }
});
