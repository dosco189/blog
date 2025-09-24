// Enhanced footnote tooltips with JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const footnoteLinks = document.querySelectorAll('a[href^="#fn:"]');
    let activeTooltip = null;

    footnoteLinks.forEach(link => {
        // Get the footnote ID and find corresponding content
        const footnoteId = link.getAttribute('href').substring(1);
        const footnoteElement = document.getElementById(footnoteId);
        
        if (!footnoteElement) return;
        
        // Extract footnote text (remove the return link)
        const footnoteText = footnoteElement.innerHTML.replace(/<a[^>]*class="reversefootnote"[^>]*>.*?<\/a>/g, '').trim();
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'footnote-tooltip';
        tooltip.innerHTML = footnoteText;
        document.body.appendChild(tooltip);
        
        // Position and show tooltip on hover/touch
        function showTooltip(event) {
            // Hide any existing tooltip
            hideTooltip();
            
            const rect = link.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            // Position above the link, centered
            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            let top = rect.top - tooltipRect.height - 10;
            
            // Adjust if tooltip goes off screen
            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tooltipRect.width - 10;
            }
            if (top < 10) {
                top = rect.bottom + 10; // Show below if no room above
                tooltip.classList.add('below');
            } else {
                tooltip.classList.remove('below');
            }
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.classList.add('visible');
            activeTooltip = tooltip;
        }
        
        function hideTooltip() {
            if (activeTooltip) {
                activeTooltip.classList.remove('visible');
                activeTooltip = null;
            }
        }
        
        // Desktop: hover events
        link.addEventListener('mouseenter', showTooltip);
        link.addEventListener('mouseleave', hideTooltip);
        
        // Mobile: touch events
        link.addEventListener('touchstart', function(event) {
            event.preventDefault();
            if (activeTooltip === tooltip) {
                hideTooltip();
            } else {
                showTooltip(event);
            }
        });
    });
    
    // Hide tooltip when clicking elsewhere
    document.addEventListener('click', function(event) {
        if (!event.target.closest('a[href^="#fn:"]') && !event.target.closest('.footnote-tooltip')) {
            if (activeTooltip) {
                activeTooltip.classList.remove('visible');
                activeTooltip = null;
            }
        }
    });
    
    // Hide tooltip on scroll
    window.addEventListener('scroll', function() {
        if (activeTooltip) {
            activeTooltip.classList.remove('visible');
            activeTooltip = null;
        }
    });
});
