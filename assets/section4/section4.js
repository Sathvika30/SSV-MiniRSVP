/* Version 2_5 — single-ceremony invitation; preserved unfurl and backend transport. */
(() => {
  'use strict';
  const section = document.querySelector('#rsvp.s4-rsvp');
  if (!section) return;
  const scroll = section.querySelector('.s4-scroll');
  const closed = section.querySelector('.s4-scroll-closed');
  const yesImg = section.querySelector('.s4-scroll-open--yes');
  const noImg = section.querySelector('.s4-scroll-open--no');
  const invite = section.querySelector('#s4-invitation');
  const yesForm = section.querySelector('#s4-yes-form');
  const noForm = section.querySelector('#s4-no-form');
  const thanks = section.querySelector('#s4-thank-you');
  const thanksLine = section.querySelector('#s4-thanks-line');
  const thanksLogistics = section.querySelector('#s4-thanks-logistics');
  const thanksIcon = section.querySelector('#s4-thanks-icon');
  const choiceButtons = [...section.querySelectorAll('[data-rsvp-choice]')];
  const backButtons = [...section.querySelectorAll('[data-s4-back]')];
  const another = section.querySelector('[data-s4-another]');
  const phones = [yesForm.querySelector('[name="phone"]'),noForm.querySelector('[name="phone"]')];
  const count = yesForm.querySelector('[name="guestCount"]');
  const arrivalDate = yesForm.querySelector('[name="arrivalDate"]');
  const resetArrivalDate = () => { arrivalDate.value = '2026-11-20'; };
  resetArrivalDate();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animationLength = () => reduced.matches ? 0 : 1000;
  let state = 'closed';
  let selected = null;
  let pending = null;
  let unfoldAnimations = [];

  // The page must never auto-scroll to compensate for a growing scroll graphic.
  section.style.overflowAnchor = 'none';
  scroll.style.overflowAnchor = 'none';

  // Every deliberate RSVP page transition starts at the SAME visual origin:
  // the gold roller, just beneath the site's fixed navigation header.
  // One immediate scroll only on button activation—never during the unfurl.
  function goldRollerStart(){
    const header=document.querySelector('.topbar');
    const headerHeight=header ? header.getBoundingClientRect().height : 0;
    const currentPageTop=scroll.getBoundingClientRect().top+window.scrollY;
    return Math.max(0,Math.round(currentPageTop-headerHeight-8));
  }
  function beginAtGoldRoller(){
    window.scrollTo({left:0,top:goldRollerStart(),behavior:'instant'});
  }
  function clearPending(){if(pending!==null){window.clearTimeout(pending);pending=null;}}
  function clearUnfurl(){
    unfoldAnimations.forEach(animation=>animation.cancel());
    unfoldAnimations=[];
  }
  function imageHeight(img){
    // The responsive artwork can still be decoding on a slow connection.
    // Reserve the CORRECT height for the selected full PNG before it loads,
    // so its eventual load cannot cause a second layout jump mid-unfurl.
    const displayWidth=window.innerWidth;
    let fallbackH=Number(img.getAttribute('height'))||1350;
    if(img===yesImg){
      fallbackH=displayWidth<=350?3058:displayWidth<=499?2682:displayWidth<=600?2103:1778;
    }else if(img===noImg){
      fallbackH=displayWidth<=350?2194:displayWidth<=499?1926:displayWidth<=600?1592:1412;
    }
    const fallbackW=941; // All Attempt 68 single-piece scroll PNGs are 941px wide.
    return scroll.clientWidth*((img.naturalHeight||fallbackH)/(img.naturalWidth||fallbackW));
  }
  function exposeForm(choice){
    invite.hidden=true;
    thanks.hidden=true;
    yesForm.hidden=choice!=='yes';
    noForm.hidden=choice!=='no';
  }
  function finishOpening(){
    if(state!=='opening')return;
    state='open';
    invite.hidden=true;
    scroll.dataset.s4State='open';
    // The final CSS state owns the visible artwork; discard animation overlays.
    clearUnfurl();
    pending=null;
  }
  function start(choice){
    if(state!=='closed'||(choice!=='yes'&&choice!=='no'))return;
    clearPending();clearUnfurl();
    selected=choice;
    state='opening';
    const picture=section.querySelector('.s4-open-picture--'+choice);
    const form=choice==='yes'?yesForm:noForm;
    // Critical: reserve the final page height IMMEDIATELY, rather than
    // animating document layout for one second. Touch scrolling is native.
    scroll.style.height=`${imageHeight(choice==='yes'?yesImg:noImg)}px`;
    scroll.dataset.s4Choice=choice;
    choiceButtons.forEach(button=>{button.disabled=true;});
    exposeForm(choice);
    // Keep the closed invitation painted until its own gentle fade is done.
    // Hiding it immediately made the first frame flash blank.
    invite.hidden=false;
    scroll.dataset.s4State='opening';
    beginAtGoldRoller();
    const duration=animationLength();
    if(!duration){finishOpening();return;}

    // One moving reveal boundary: the open artwork appears ABOVE that edge,
    // while the intact closed artwork remains opaque BELOW it. This avoids
    // the translucent ghosting of a crossfade and never animates page height.
    const easing='cubic-bezier(.42,0,.58,1)';
    const settings={duration,easing,fill:'forwards'};
    const sceneTop=scroll.getBoundingClientRect().top;
    const openHeight=scroll.getBoundingClientRect().height;
    const formTop=form.getBoundingClientRect().top-sceneTop;
    const formHeight=form.getBoundingClientRect().height;
    const inviteTop=invite.getBoundingClientRect().top-sceneTop;

    unfoldAnimations.push(picture.animate([
      {clipPath:'inset(0 0 100% 0)'},
      {clipPath:'inset(0 0 0% 0)'}
    ],settings));
    // Complementary masks guarantee that no band becomes translucent.
    unfoldAnimations.push(closed.animate([
      {clipPath:'inset(0px 0 0 0)'},
      {clipPath:`inset(${openHeight}px 0 0 0)`}
    ],settings));
    unfoldAnimations.push(form.animate([
      {clipPath:`inset(0 0 ${formHeight+formTop}px 0)`},
      {clipPath:`inset(0 0 ${formHeight+formTop-openHeight}px 0)`}
    ],settings));
    unfoldAnimations.push(invite.animate([
      {clipPath:`inset(${-inviteTop}px 0 0 0)`},
      {clipPath:`inset(${openHeight-inviteTop}px 0 0 0)`}
    ],settings));
    pending=window.setTimeout(finishOpening,duration+18);
  }
  function back(){
    if(state!=='open'&&state!=='opening')return;
    clearPending();clearUnfurl();
    // Restoring the small invitation is immediate. No smooth-scroll lock,
    // and no lingering closing animation fights the user's next gesture.
    invite.hidden=false;
    yesForm.hidden=true;
    noForm.hidden=true;
    thanks.hidden=true;
    state='closed';selected=null;
    delete scroll.dataset.s4Choice;
    scroll.dataset.s4State='closed';
    scroll.style.height='';
    choiceButtons.forEach(button=>{button.disabled=false;});
    beginAtGoldRoller();
  }
  function showThanks(choice){
    clearPending();clearUnfurl();
    state='thanks';
    selected=choice;
    scroll.dataset.s4State='thanks';
    delete scroll.dataset.s4Choice;
    scroll.style.height='';
    invite.hidden=true;
    yesForm.hidden=true;
    noForm.hidden=true;
    thanks.hidden=false;
    if(choice==='yes'){
      thanksLine.textContent="We look forward to celebrating with you!";
      thanksLogistics.textContent='We’ll share accommodation details and contact information closer to the wedding day.';
      thanksIcon.src='assets/section4/thanks_diya.webp';
    }else{
      thanksLine.textContent='Thank you for your blessings!';
      thanksLogistics.textContent='The livestream link will be shared on the wedding day via WhatsApp to the number you provided.';
      thanksIcon.src='assets/section4/thanks_livestream.webp';
    }
    // The confirmation is above the former long form's bottom position.
    // Scroll here only AFTER the user explicitly submits, not during unfurling.
    beginAtGoldRoller();
  }
  function resetFresh(){
    clearPending();clearUnfurl();
    yesForm.reset();noForm.reset();resetArrivalDate();
    phones.forEach(p=>showPhoneError(p,''));
    count.setCustomValidity('');
    selected=null;
    state='closed';
    thanks.hidden=true;
    yesForm.hidden=true;noForm.hidden=true;invite.hidden=false;
    scroll.dataset.s4State='closed';
    delete scroll.dataset.s4Choice;
    scroll.style.height='';
    choiceButtons.forEach(b=>{b.disabled=false;});
    // Intentional new RSVP; no prior completed response can be modified.
    beginAtGoldRoller();
  }
  // Format-only international phone validation: country code optional. Country-
  // specific allocation cannot be verified without a phone metadata service.
  function phoneProblem(raw){
    const value=raw.trim();
    if(!value)return 'Please enter your contact number.';
    if(!/^\+?[\d\s()\-]+$/.test(value) || (value.match(/\+/g)||[]).length>1)return 'Use numbers, with an optional +country code, spaces or hyphens.';
    const d=value.replace(/\D/g,'');
    if(d.length<7||d.length>15)return 'Enter a valid phone number containing 7 to 15 digits.';
    if((value.match(/\(/g)||[]).length!==(value.match(/\)/g)||[]).length)return 'Check the parentheses in your phone number.';
    if(/\(\s*\)/.test(value)||/[()]{2}/.test(value))return 'Please check the phone number format.';
    return '';
  }
  function showPhoneError(phone,message){
    const bubble=section.querySelector(`[data-s4-phone-error="${phone.id}"]`);
    const field=phone.closest('.s4-field');
    phone.setCustomValidity(message);
    if(bubble){bubble.textContent=message ? (phone.value.trim() ? `Phone number format doesn't match: ${message}` : message) : '';bubble.hidden=!message;}
    if(field)field.classList.toggle('s4-invalid',!!message);
    phone.setAttribute('aria-invalid',message?'true':'false');
  }
  phones.forEach(phone=>{
    phone.addEventListener('input',()=>showPhoneError(phone,''));
    phone.addEventListener('blur',()=>{
      if(phone.value.trim())showPhoneError(phone,phoneProblem(phone.value));
    });
  });
  count.addEventListener('beforeinput',event=>{if(event.data && /\D/.test(event.data))event.preventDefault();});
  count.addEventListener('input',()=>{count.value=count.value.replace(/\D/g,'');count.setCustomValidity('');});
  async function submit(event, choice) {
    event.preventDefault();
  
    if (
      (state !== 'open' && state !== 'opening') ||
      selected !== choice
    ) return;
  
    const form = choice === 'yes' ? yesForm : noForm;
    const phone = form.querySelector('[name="phone"]');
  
    showPhoneError(phone, phoneProblem(phone.value));
  
    if (choice === 'yes') {
      const value = count.value.trim();
  
      const good =
        /^[0-9]+$/.test(value) &&
        Number.isSafeInteger(Number(value)) &&
        Number(value) > 0;
  
      count.setCustomValidity(
        good
          ? ''
          : 'Enter a positive whole number of guests, including yourself.'
      );
    }
  
    if (!form.reportValidity()) return;
  
  
    // Prevent multiple submissions while sending
    if (form.dataset.submitting === 'true') return;
  
    form.dataset.submitting = 'true';
  
    const submitButton =
      form.querySelector('button[type="submit"]');
  
    if (submitButton) {
      submitButton.disabled = true;
    }
  
    try {
      // Send RSVP information to Google Apps Script
      await saveRSVP(
        form,
        choice === 'yes' ? 'Yes' : 'No'
      );
  
      // NOTE: no-cors cannot confirm database storage.
      showThanks(choice);
  
    } catch (error) {
      console.error('RSVP submission failed:', error);
  
      alert(
        'Unable to send your RSVP. Please check your internet connection and try again.'
      );
  
    } finally {
      form.dataset.submitting = 'false';
  
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  }
  
  
    
  const RSVP_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbweZACp841lJpX5iv_9yKyyUIVu5W5_3TKuXgYwfTBG6RLK0lLLjUr71QZcL1QLwT-H9g/exec";
  
  async function saveRSVP(form, attendance) {
    const data = new FormData(form);
  
    // New Version 2-only Sheet has dedicated Travel Details and Message columns.
    // Keep values separate so the same message is not duplicated in the Sheet.
    const travelDetails = String(data.get("travelDetails") || "").trim();
    const guestNote = String(data.get("note") || "").trim();
    const payload = new URLSearchParams({
      attendance: attendance,
      name: data.get("name") || "",
      phone: data.get("phone") || "",
      arrivalDate: attendance === "Yes" ? (data.get("arrivalDate") || "") : "",
      arrivalTime: attendance === "Yes" ? (data.get("arrivalTime") || "") : "",
      guestCount: attendance === "Yes" ? (data.get("guestCount") || "") : "",
      travelDetails: attendance === "Yes" ? travelDetails : "",
      note: guestNote,
      invitationVersion: "V2_19"
    });

    await fetch(RSVP_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: payload
    });
  }
  function onResize(){
    if(state==='opening'||state==='open'){
      scroll.style.height=`${imageHeight(selected==='yes'?yesImg:noImg)}px`;
    }
  }
  choiceButtons.forEach(b=>b.addEventListener('click',()=>start(b.dataset.rsvpChoice)));
  backButtons.forEach(b=>b.addEventListener('click',back));
  another.addEventListener('click',resetFresh);
  yesForm.addEventListener('submit',event=>submit(event,'yes'));
  noForm.addEventListener('submit',event=>submit(event,'no'));
  window.addEventListener('resize',onResize,{passive:true});
  yesImg.addEventListener('load',onResize);
  noImg.addEventListener('load',onResize);
  // Decode active responsive images in advance. This never delays a click or swipe.
  [closed,yesImg,noImg].forEach(img=>{if(img.decode)img.decode().catch(()=>{});});
  // When returning to the RSVP invitation, restore the requested default date.
  window.addEventListener('pageshow', () => {
    if(state === 'closed') resetArrivalDate();
  });
  // Reload always begins at the invitation. No persistent completion lock.
})();
