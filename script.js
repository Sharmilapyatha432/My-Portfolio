        // Update current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // --- Three.js Setup for 3D Background ---
        window.onload = function() {
            const container = document.getElementById('three-container');
            let scene, camera, renderer, shapes = [], light;

            function init() {
                // Scene setup
                scene = new THREE.Scene();

                // Camera setup
                camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.z = 5;

                // Renderer setup
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha true for transparent background
                renderer.setSize(window.innerWidth, window.innerHeight);
                container.appendChild(renderer.domElement);

                // Lighting
                light = new THREE.DirectionalLight(0xffffff, 0.8);
                light.position.set(0, 0, 10);
                scene.add(light);

                const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
                scene.add(ambientLight);

                // Define vibrant colors for 3D shapes
                const colors = [
                    new THREE.Color(0xFF6B6B), // Vibrant Coral
                    new THREE.Color(0x1ABC9C), // Emerald Green
                    new THREE.Color(0xB2EBF2), // Light Teal
                    new THREE.Color(0x7F8C8D)  // Muted grey for contrast if needed
                ];

                // Create and add shapes
                const geometries = [
                    new THREE.SphereGeometry(0.5, 32, 32),
                    new THREE.BoxGeometry(0.8, 0.8, 0.8),
                    new THREE.TorusGeometry(0.4, 0.2, 16, 100),
                    new THREE.DodecahedronGeometry(0.6)
                ];

                for (let i = 0; i < 10; i++) {
                    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
                    const material = new THREE.MeshPhysicalMaterial({
                        color: colors[Math.floor(Math.random() * colors.length)],
                        roughness: 0.5,
                        metalness: 0.1,
                        transparent: true,
                        opacity: 0.6 + Math.random() * 0.2, // Slightly varied opacity
                        clearcoat: 0.5,
                        clearcoatRoughness: 0.2
                    });
                    const shape = new THREE.Mesh(geometry, material);

                    // Random positioning
                    shape.position.x = (Math.random() - 0.5) * 10;
                    shape.position.y = (Math.random() - 0.5) * 10;
                    shape.position.z = (Math.random() - 0.5) * 10 - 5; // Push them slightly back

                    // Random initial rotation
                    shape.rotation.x = Math.random() * Math.PI;
                    shape.rotation.y = Math.random() * Math.PI;

                    scene.add(shape);
                    shapes.push(shape);
                }

                // Handle window resizing
                window.addEventListener('resize', onWindowResize, false);
            }

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (event) => {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            });


            function animate() {
                requestAnimationFrame(animate);

                // Animate shapes
                shapes.forEach(shape => {
                    shape.rotation.x += 0.005 + (mouseY * 0.0001); // Subtle rotation, influenced by mouse
                    shape.rotation.y += 0.005 + (mouseX * 0.0001);
                    // Optionally, make them slowly drift or float
                    shape.position.y += Math.sin(Date.now() * 0.0005 + shape.uuid.charCodeAt(0)) * 0.0005;
                    shape.position.x += Math.cos(Date.now() * 0.0005 + shape.uuid.charCodeAt(1)) * 0.0005;
                });

                // Subtle camera movement based on mouse
                camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
                camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
                camera.lookAt(scene.position);


                renderer.render(scene, camera);
            }

            init();
            animate();

            // --- Photo Parallax Effect ---
            const aboutPhotoWrapper = document.getElementById('about-photo-wrapper');
            const aboutPhotoImg = aboutPhotoWrapper.querySelector('img');

            if (aboutPhotoWrapper && aboutPhotoImg) {
                aboutPhotoWrapper.addEventListener('mousemove', (e) => {
                    const rect = aboutPhotoWrapper.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
                    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

                    // Calculate rotation angles
                    const rotateY = (x - 0.5) * 10; // -5 to 5 degrees
                    const rotateX = (0.5 - y) * 10; // -5 to 5 degrees

                    aboutPhotoImg.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
                    aboutPhotoImg.style.boxShadow = `${(x - 0.5) * 15}px ${(y - 0.5) * 15}px 30px rgba(0, 0, 0, 0.3)`; // Adjust shadow based on mouse
                });

                aboutPhotoWrapper.addEventListener('mouseleave', () => {
                    aboutPhotoImg.style.transform = 'rotateY(0deg) rotateX(0deg)';
                    aboutPhotoImg.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Reset shadow
                });
            }

            // --- Navbar Show/Hide on Scroll ---
            const header = document.getElementById('main-header');
            const mainContent = document.querySelector('main');
            let lastScrollY = window.scrollY;
            let scrollStopTimer;

            // Function to adjust main content padding dynamically
            function adjustMainContentPadding() {
                if (header && mainContent) {
                    mainContent.style.paddingTop = `${header.offsetHeight + 16}px`; // Add header height + some margin
                }
            }

            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;

                // Clear existing timer
                clearTimeout(scrollStopTimer);

                // Hide header when scrolling down past its own height
                if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
                    header.classList.add('-translate-y-full'); // Hide header by moving it up
                } else {
                    // Show header when scrolling up, or if at the very top of the page
                    header.classList.remove('-translate-y-full'); // Show header
                }

                lastScrollY = currentScrollY;

                // Set a timer to show the header when scrolling stops
                // This is crucial to ensure it reappears even if the user stops scrolling downwards
                scrollStopTimer = setTimeout(() => {
                    header.classList.remove('-translate-y-full'); // Ensure header is visible when scrolling stops
                }, 200); // Adjust delay as needed (milliseconds)
            });

            // Initial adjustments on load
            adjustMainContentPadding(); // Ensure padding is correct on first load
            header.classList.remove('-translate-y-full'); // Ensure header is visible on page load

            // Adjust padding on window resize
            window.addEventListener('resize', adjustMainContentPadding);
        };