// script.js - For Matrix Animations and Interactions

// Log to console to confirm script is loaded
console.log("Initializing connection to the Matrix...");

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrix-rain-canvas');
    // Only proceed with canvas if it exists (it might not on all pages, or if removed)
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Set canvas to full screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // --- Matrix Digital Rain Configuration ---
        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        let columns = Math.floor(canvas.width / fontSize); // Make columns let so it can be reassigned

        // Initialize drops (one for each column)
        const drops = [];
        function initializeDrops() {
            drops.length = 0; // Clear existing drops before re-initializing
            columns = Math.floor(canvas.width / fontSize); // Recalculate columns
            for (let x = 0; x < columns; x++) {
                drops[x] = {
                    y: Math.floor(Math.random() * (canvas.height / fontSize)), // Start at random y
                    charIndex: Math.floor(Math.random() * alphabet.length) 
                };
            }
        }
        initializeDrops();


        // --- Draw the Matrix Rain ---
        function drawMatrixRain() {
            // Semi-transparent black background to create the fading trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = fontSize + 'px VT323, monospace'; // Use the same font as the body

            for (let i = 0; i < drops.length; i++) {
                const drop = drops[i];
                // Get a random character from the alphabet
                const text = alphabet.charAt(drop.charIndex);
                ctx.fillText(text, i * fontSize, drop.y * fontSize);

                // Send the drop back to the top randomly after it has crossed the screen
                // or when a random condition is met, for a more dynamic effect
                if (drop.y * fontSize > canvas.height && Math.random() > 0.975) {
                    drop.y = 0; // Reset to top
                    drop.charIndex = Math.floor(Math.random() * alphabet.length); 
                }

                // Increment Y coordinate
                drop.y++;
                
                // Randomly change the character in the column for flickering effect
                if (Math.random() > 0.95) { // Adjusted probability
                    drop.charIndex = Math.floor(Math.random() * alphabet.length);
                }
            }
        }

        // --- Animation Loop ---
        let animationFrameId;
        function animate() {
            drawMatrixRain();
            animationFrameId = requestAnimationFrame(animate);
        }
        
        animate(); // Start the animation
        
        // --- Responsive Canvas Resizing ---
        window.addEventListener('resize', () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initializeDrops(); // Re-initialize drops for new dimensions
            animate(); // Restart animation
        });
         console.log("Matrix digital rain initialized for this page.");
    } else {
        console.log("Matrix rain canvas not found on this page.");
    }

    // --- Glitch Effect for H1 (applies if .glitch element exists) ---
    const glitchElement = document.querySelector('.glitch');
    if (glitchElement) {
        const originalText = glitchElement.dataset.text || glitchElement.textContent; // Fallback if data-text is missing
        const fullAlphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=[]{}|;:,.<>?/~';


        function triggerGlitch() {
            let newText = '';
            for(let i = 0; i < originalText.length; i++) {
                if (Math.random() > 0.85) { // 15% chance to glitch a character
                    newText += fullAlphabet.charAt(Math.floor(Math.random() * fullAlphabet.length));
                } else {
                    newText += originalText[i];
                }
            }
            glitchElement.textContent = newText;
            
            // Briefly revert to original to create a "snap back" effect
            setTimeout(() => {
                if (glitchElement) glitchElement.textContent = originalText;
            }, 80 + Math.random() * 50); // Slightly randomized snap back time
        }

        // Set a longer initial delay for the first glitch on page load
        setTimeout(() => {
            triggerGlitch(); // Initial glitch
            setInterval(triggerGlitch, 2000 + Math.random() * 1500); // Subsequent glitches
        }, 1000 + Math.random() * 500); // Initial delay

        console.log("Glitch effect initialized for elements with .glitch class.");
    }

    // --- RSVP Form Handling with Formspree ---
    const rsvpForm = document.getElementById('matrixRsvpForm');
    const formStatusMessage = document.getElementById('form-status-message');

    if (rsvpForm && formStatusMessage) {
        rsvpForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            formStatusMessage.textContent = 'Attempting to transmit response...';
            formStatusMessage.className = 'form-status'; // Reset classes
            formStatusMessage.style.display = 'block';

            const formData = new FormData(rsvpForm);
            const formAction = rsvpForm.action; // Get Formspree URL from form's action attribute

            // Basic client-side validation (Formspree also does validation)
            const guestNameInput = document.getElementById('guestName');
            if (guestNameInput && guestNameInput.value.trim() === "") {
                formStatusMessage.textContent = 'ERROR: IDENTIFIER (NAME) IS A REQUIRED FIELD. TRANSMISSION FAILED.';
                formStatusMessage.classList.add('error');
                return; // Stop submission if name is missing
            }
            
            const guestEmailInput = document.getElementById('guestEmail');
            if (guestEmailInput && guestEmailInput.value.trim() === "") { // Basic email presence check
                formStatusMessage.textContent = 'ERROR: SECURE CHANNEL (EMAIL) IS REQUIRED. TRANSMISSION FAILED.';
                formStatusMessage.classList.add('error');
                return; 
            }

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Formspree can reply with JSON
                    }
                });

                if (response.ok) {
                    // Formspree typically returns a 200 OK on success.
                    // You can also check response.json() if Formspree sends back specific success data.
                    formStatusMessage.textContent = 'SUCCESS: RESPONSE TRANSMITTED. STAND BY FOR FURTHER DIRECTIVES.';
                    formStatusMessage.classList.add('success');
                    rsvpForm.reset(); // Optionally reset the form on success
                } else {
                    // Handle server-side errors from Formspree or network issues
                    const errorData = await response.json().catch(() => ({})); // Try to get error details
                    let errorMessage = 'ERROR: TRANSMISSION FAILED. THE ORACLE COULD NOT BE REACHED.';
                    if (errorData && errorData.errors && errorData.errors.length > 0) {
                        // Use Formspree's specific error message if available
                        errorMessage = `ERROR: ${errorData.errors.map(err => err.message).join(', ')}`;
                    } else if (response.status === 422) {
                         errorMessage = 'ERROR: INVALID DATA. PLEASE CHECK YOUR INPUTS.';
                    }
                    formStatusMessage.textContent = errorMessage;
                    formStatusMessage.classList.add('error');
                }
            } catch (error) {
                // Handle network errors (e.g., user is offline)
                console.error("Form submission error:", error);
                formStatusMessage.textContent = 'ERROR: CONNECTION SEVERED. PLEASE CHECK YOUR NETWORK AND TRY AGAIN.';
                formStatusMessage.classList.add('error');
            }
        });
        console.log("RSVP form handler initialized for Formspree.");
    }

});
