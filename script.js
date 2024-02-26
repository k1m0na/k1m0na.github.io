
window.addEventListener('load', () => {    

    const cards = document.querySelectorAll('.card'),
          closeBtns = document.querySelectorAll('.close-btn'),
          refreshCardsBtn = document.querySelector('.refresh-cards-btn'),
          refreshCardsArrow = document.querySelector('.refresh-cards-arrow'),
          refreshCardsText = document.querySelector('.refresh-cards-text'),
          projectTitle = document.querySelector('#projects > .title'),
          projectTitleY = projectTitle.offsetTop + projectTitle.offsetHeight,
          projectImages = document.querySelectorAll('.project-info img'),
          projectInfoContainers = document.querySelectorAll('.project-info'),
          projectToggleBtns = document.querySelectorAll('.project-info-toggle'),
          removeClass = () => refreshCardsArrow.classList.remove('rotating'),

          rootFontSize = window.getComputedStyle(document.body)['font-size'],
          mobileBreakPoint = parseInt(rootFontSize) * 33,
          rotationAnimDuration = Number( getComputedStyle(document.body).getPropertyValue('--animation-duration').match(/\d/g).join('') ),

          accordionServiceTitles = document.querySelectorAll('.services > .title'),
          accordionServiceDescriptions = document.querySelectorAll('.services > .description'),

          tooltipTrigger = document.querySelector('.tooltip'),
          tooltip = document.querySelector('.tooltip-text'),

          isDarkMode = window.matchMedia('(prefers-color-scheme: dark)'),
          isLightMode = window.matchMedia('(prefers-color-scheme: light)'),
          sun = document.querySelector('.sun'),
          moon = document.querySelector('.moon'),
          enableDarkMode = () => {
            document.body.classList.add('dark-mode');
            showSunHideMoon();
          },
          disableDarkMode = () => { 
              document.body.classList.remove('dark-mode');
              showMoonHideSun();
          };

    window.addEventListener( 'resize', () => initDrag() )

    touchScreenTooltipHover()
    initDarkness()
    initAccordions()
    initDrag()
    initProjectDetails()
    initCloseBtns()

    function initDrag() {
        cards.forEach( card => handleCardDrags(card)); 
    }

    function handleCardDrags(card) {
        
        const maxUpMovement = card.getBoundingClientRect().top + window.pageYOffset - projectTitleY;

        if (window.innerWidth > mobileBreakPoint) {
            card.addEventListener('mousedown', activateDrag, false);
        } else {
            card.removeEventListener('mousedown', activateDrag, false) ;
            deActivateRefreshBtn(card);
        }

        function activateDrag(e) {
            e.preventDefault();
    
            window.addEventListener('mousemove', moveCardWithOffset, false);
            window.addEventListener('mouseup', stopDrag);
        
            let cursorOnCardX = e.clientX + parseInt( card.dataset.offsetX ),
                cursorOnCardY = e.clientY + parseInt( card.dataset.offsetY );
        
            function moveCardWithOffset(e){
                e.preventDefault();
                
                let grabbedCard = e.target.closest('.card');

                card.style.transform = `translate3d(${-parseInt( card.dataset.offsetX )}px,${-parseInt( Math.min(card.dataset.offsetY, maxUpMovement) )}px,0`;
                card.dataset.offsetX  = cursorOnCardX - e.clientX;
                card.dataset.offsetY  = cursorOnCardY - e.clientY;
            }
            
            function stopDrag(){
                activateRefreshBtn(card);
                window.removeEventListener('mousemove', moveCardWithOffset);
                window.removeEventListener('mouseup', stopDrag);
                refreshCardsText.style.transform = "scale(1)";
                refreshCardsBtn.style.transform = "scale(1)";
            }
        }
    }

    function activateRefreshBtn(card){
        [refreshCardsBtn, refreshCardsArrow].forEach( refresher => {
            refresher.addEventListener('click', () => {
                resetCards(card);
                refreshBtnAnimation();
                hideProjectTerminals();
                refreshCardsText.style.transform = "scale(0)";
                refreshCardsBtn.style.transform = "scale(0)";
            })
        } );
    }

    function deActivateRefreshBtn(card) {
        [refreshCardsBtn, refreshCardsArrow].forEach( refresher => {
            refresher.remove('click', () => {
                resetCards(card);
                refreshBtnAnimation();
                refreshCardsText.style.transform = "scale(0)";
                refreshCardsBtn.style.transform = "scale(0)";
            })
        } );
    }

    function resetCards(card){
        card.style.display = "block";
        card.style.transform = "none";

        card.dataset.offsetX = 0;
        card.dataset.offsetY = 0;
    }

    function refreshBtnAnimation(){
        refreshCardsArrow.classList.add('rotating');
        setTimeout(removeClass,rotationAnimDuration);
    }
 
    function initCloseBtns(){
        closeBtns.forEach( (btn,index) => btn.addEventListener('click', e =>  {
            cards[index].style.display = 'none';
            refreshCardsText.style.transform = "scale(1)";
        }));
    }
    

    function touchScreenTooltipHover(){
        tooltipTrigger.addEventListener('touchstart', e => {
            e.preventDefault();
            tooltip.style.transform = "scale(1)";
            tooltip.style.opacity = "1";
        });
        tooltipTrigger.addEventListener('touchend', e => {
            e.preventDefault();
            tooltip.style.transform = "scale(0)";
            tooltip.style.opacity = "0";
        })
    }

    function initAccordions(){
            accordionServiceTitles.forEach( (title,i) => title.addEventListener("pointerdown", (ev) => {
                ev.stopPropagation();
                accordionServiceDescriptions[i].classList.toggle('expanded');
                title.classList.toggle('expanded');
            }, {passive: false}) )
    }

    function initDarkness(){
        moon.addEventListener('click', () => enableDarkMode() );
        sun.addEventListener('click', () => disableDarkMode() );
        detectDarkMode();
    }

    function showSunHideMoon(){
        moon.style.transform = "scale(0)";
        moon.style.opacity = "0";
        sun.style.transform = "scale(1) rotate(360deg)";
        sun.style.opacity = "1";
    }
    function showMoonHideSun(){
        moon.style.transform = "scale(1) rotate(-360deg)";
        moon.style.opacity = "1";
        sun.style.transform = "scale(0)";
        sun.style.opacity = "0";
    }
    
    function detectDarkMode(){
        isDarkMode.matches ? enableDarkMode() : disableDarkMode() ;
        isDarkMode.addEventListener('change', e => e.matches && enableDarkMode() );
        isLightMode.addEventListener('change', e => e.matches && disableDarkMode() );
    }

    function initProjectDetails(){
        projectToggleBtns.forEach( (btn,i) => btn.addEventListener('click', () => { 
            projectImages[i].classList.toggle('hidden');
            projectInfoContainers[i].classList.toggle('terminal-mode');        
        }));
    }

    function hideProjectTerminals(){
        projectImages.forEach( img => img.classList.remove('hidden') );
        projectInfoContainers.forEach( container => container.classList.remove('terminal-mode') );
    }

})
