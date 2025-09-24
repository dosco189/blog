// Reading Progress Bar, Smooth Scrolling, and Table of Contents
document.addEventListener('DOMContentLoaded', function() {
    
    // === READING PROGRESS BAR ===
    function initProgressBar() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);
        
        // Update progress on scroll
        function updateProgress() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.height = Math.min(scrollPercent, 100) + '%';
        }
        
        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial call
    }
    
    // === SMOOTH ANCHOR SCROLLING ===
    function initSmoothScrolling() {
        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // === AUTO-GENERATED TABLE OF CONTENTS (FLOATING SIDEBAR) ===
    function initTableOfContents() {
        // Only generate TOC for posts (not home page)
        if (!document.querySelector('.post-content')) return;
        
        const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4');
        if (headings.length < 3) return; // Don't show TOC for short posts
        
        // Create floating TOC container
        const tocContainer = document.createElement('div');
        tocContainer.className = 'table-of-contents floating-toc';
        tocContainer.innerHTML = '<div class="toc-title">Contents</div>';
        
        const tocList = document.createElement('ul');
        tocContainer.appendChild(tocList);
        
        // Generate TOC items
        headings.forEach((heading, index) => {
            // Create ID if it doesn't exist
            if (!heading.id) {
                heading.id = 'heading-' + index;
            }
            
            const tocItem = document.createElement('li');
            tocItem.className = 'toc-' + heading.tagName.toLowerCase();
            
            const tocLink = document.createElement('a');
            tocLink.href = '#' + heading.id;
            tocLink.textContent = heading.textContent;
            tocLink.className = 'toc-link';
            
            tocItem.appendChild(tocLink);
            tocList.appendChild(tocItem);
        });
        
        // Append to body (floating)
        document.body.appendChild(tocContainer);
        
        // Show/hide TOC based on scroll position and screen width
        function updateTOCVisibility() {
            const scrollPos = window.pageYOffset;
            const postContent = document.querySelector('.post-content');
            
            if (postContent && window.innerWidth > 1200) {
                const postStart = postContent.offsetTop - 100;
                const postEnd = postContent.offsetTop + postContent.offsetHeight;
                
                if (scrollPos >= postStart && scrollPos <= postEnd) {
                    tocContainer.classList.add('visible');
                } else {
                    tocContainer.classList.remove('visible');
                }
            } else {
                tocContainer.classList.remove('visible');
            }
        }
        
        // Highlight current section
        function updateActiveTOC() {
            const scrollPos = window.pageYOffset + 150;
            let activeHeading = null;
            
            headings.forEach(heading => {
                if (heading.offsetTop <= scrollPos) {
                    activeHeading = heading;
                }
            });
            
            // Remove all active classes
            document.querySelectorAll('.toc-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section
            if (activeHeading) {
                const activeLink = document.querySelector(`a[href="#${activeHeading.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        }
        
        function handleScroll() {
            updateTOCVisibility();
            updateActiveTOC();
        }
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', updateTOCVisibility);
        updateTOCVisibility(); // Initial call
        updateActiveTOC(); // Initial call
    }
    
    // Initialize all features
    initProgressBar();
    initSmoothScrolling();
    initTableOfContents();
});
