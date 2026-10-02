(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  let selectedPurpose = '';

  const purposes = {
    info: {
      title: 'Request an informational interview',
      desc: 'Ask someone for a short conversation to learn about their work or career path.',
      tip: 'An informational interview is a learning conversation—not a request for a job. A 20–30 minute ask is usually enough.'
    },
    shadow: {
      title: 'Request a job shadow',
      desc: 'Ask to observe someone’s work and learn more about a role or setting.',
      tip: 'Make it easy to say yes by showing flexibility and making the learning goal clear.'
    },
    followup: {
      title: 'Follow up after meeting someone',
      desc: 'Reconnect after a fair, event, class, conversation, or introduction.',
      tip: 'Remind them where you met and include one specific detail so the message does not feel generic.'
    },
    thankyou: {
      title: 'Send a thank-you',
      desc: 'Thank someone after an interview, informational conversation, job shadow, or other help.',
      tip: 'A strong thank-you is short, specific, and mentions something you genuinely appreciated or learned.'
    },
    request: {
      title: 'Ask for advice or help',
      desc: 'Make a professional request that does not fit the options above.',
      tip: 'Keep the request narrow. The easier it is to understand what you need, the easier it is to respond.'
    }
  };

  function field(id,label,placeholder='',opts={}) {
    const cls = opts.full ? 'field full' : 'field';
    const hint = opts.hint ? ` <span class="hint">${opts.hint}</span>` : '';
    if (opts.type === 'textarea') return `<div class="${cls}"><label for="${id}">${label}${hint}</label><textarea id="${id}" placeholder="${placeholder}"></textarea></div>`;
    if (opts.type === 'select') return `<div class="${cls}"><label for="${id}">${label}${hint}</label><select id="${id}">${opts.options.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></div>`;
    return `<div class="${cls}"><label for="${id}">${label}${hint}</label><input id="${id}" type="text" placeholder="${placeholder}"></div>`;
  }

  function sharedFields() {
    return [
      field('recipientFirst','Recipient first name','Taylor'),
      field('recipientLast','Recipient last name','Morgan'),
      field('addressStyle','How will you address them?','',{type:'select',options:[
        {value:'first',label:'First name'},
        {value:'mr',label:'Mr. + last name'},
        {value:'ms',label:'Ms. + last name'},
        {value:'mrs',label:'Mrs. + last name'},
        {value:'dr',label:'Dr. + last name'}
      ]}),
      field('studentName','Your name','Jordan Lee')
    ].join('');
  }

  function connectionFields() {
    return `
      <div class="connection-box">
        <h3>How are you connected to this person?</h3>
        <p>This will shape the opening of the email—not just be added as an extra sentence.</p>
        <div class="form-grid" style="margin-top:0">
          ${field('connectionType','Connection','',{type:'select',options:[
            {value:'met',label:'We met before'},
            {value:'referral',label:'Someone referred or introduced me'},
            {value:'linkedin',label:'I found them on LinkedIn'},
            {value:'website',label:'I found them on a school/organization website'},
            {value:'know',label:'I already know them'},
            {value:'other',label:'Something else'}
          ]})}
          ${field('connectionDetail','Connection details','e.g., Fall Job & Internship Fair, Professor Smith suggested I contact you, University of Iowa alumni...',{full:true})}
          ${field('specificMemory','Optional detail that makes the connection feel personal','e.g., I appreciated hearing about your path into school counseling',{full:true,hint:'Especially useful if you met before.'})}
        </div>
      </div>`;
  }

  function renderFields() {
    let html = sharedFields();

    if (selectedPurpose !== 'thankyou' || true) html += connectionFields();

    if (selectedPurpose === 'info') {
      html += field('studentContext','A little about you','second-year elementary education student',{hint:'Optional'});
      html += field('interest','What are you hoping to learn about?','your work as a school counselor, your path into special education...',{full:true});
      html += field('whyThem','Why did you choose this person?','Their role, experience, school, career path, or something else that caught your attention',{full:true,hint:'Optional, but helpful if you did not meet them before.'});
      html += field('format','Preferred format','phone, Zoom, or whichever is easiest',{hint:'Optional'});
    } else if (selectedPurpose === 'shadow') {
      html += field('studentContext','A little about you','junior secondary education student',{hint:'Optional'});
      html += field('interest','What do you hope to learn or observe?','what a typical day looks like, how the team collaborates...',{full:true});
      html += field('whyThem','Why this person or setting?','What specifically made you interested in reaching out',{full:true,hint:'Optional'});
      html += field('timing','Timing or availability','I am flexible and happy to work around your schedule',{hint:'Optional'});
    } else if (selectedPurpose === 'followup') {
      html += field('reason','Why are you following up?','stay connected, continue the conversation, ask about a next step...',{full:true});
      html += field('ask','Is there anything you want them to do?','e.g., I would love to stay in touch / Would you be open to a short conversation?',{full:true,hint:'Optional'});
    } else if (selectedPurpose === 'thankyou') {
      html += field('thanksFor','What are you thanking them for?','the interview, job shadow, informational conversation, introduction...',{full:true});
      html += field('specificMemory','Something specific you appreciated or learned','hearing how your team supports new teachers, learning about your path into the field...',{full:true});
      html += field('next','Anything you want to reinforce?','your continued interest, a next step, or that you hope to stay in touch',{full:true,hint:'Optional'});
    } else if (selectedPurpose === 'request') {
      html += field('studentContext','A little about you','University of Iowa student studying...',{hint:'Optional'});
      html += field('reason','Why are you reaching out to this person?','What makes them a useful person to ask',{full:true});
      html += field('ask','What are you asking for?','Keep the request specific and realistic',{full:true});
    }

    $('dynamicFields').innerHTML = html;
  }

  function v(id) { return ($(id)?.value || '').trim(); }

  function salutation() {
    const first = v('recipientFirst');
    const last = v('recipientLast');
    const style = v('addressStyle');
    if (style === 'first') return first || 'there';
    const titles = {mr:'Mr.',ms:'Ms.',mrs:'Mrs.',dr:'Dr.'};
    return `${titles[style] || ''}${last ? ' ' + last : ''}`.trim() || first || 'there';
  }

  function fullName() {
    return [v('recipientFirst'),v('recipientLast')].filter(Boolean).join(' ');
  }

  function clean(s) {
    return String(s||'').replace(/\s+/g,' ').trim().replace(/[.?!]+$/,'');
  }

  function lowerStart(s) {
    s = clean(s);
    return s ? s.charAt(0).toLowerCase() + s.slice(1) : '';
  }

  function connectionOpening() {
    const type = v('connectionType');
    const detail = clean(v('connectionDetail'));
    const memory = clean(v('specificMemory'));
    const name = fullName();

    if (type === 'met') {
      let line = detail ? `It was great meeting you at ${detail}.` : `It was great meeting you recently.`;
      if (memory) line += ` I especially appreciated ${lowerStart(memory)}.`;
      return line;
    }
    if (type === 'referral') {
      if (detail) return `${detail} suggested I reach out to you.`;
      return `A mutual connection suggested I reach out to you.`;
    }
    if (type === 'linkedin') {
      if (detail) return `I came across your profile on LinkedIn while looking into ${lowerStart(detail)}.`;
      return `I came across your profile on LinkedIn while exploring people working in this area.`;
    }
    if (type === 'website') {
      if (detail) return `I found your information while learning more about ${lowerStart(detail)}.`;
      return `I found your information while learning more about your school or organization.`;
    }
    if (type === 'know') {
      if (detail) return `I wanted to follow up on ${lowerStart(detail)}.`;
      return `I wanted to reach out with a quick question.`;
    }
    if (type === 'other') {
      return detail ? `${detail}.` : '';
    }
    return name ? `I am reaching out because I was interested in learning more about your work.` : '';
  }

  function identityBridge() {
    const context = clean(v('studentContext'));
    return context ? `I’m a ${context}, and ` : `I’m `;
  }

  function infoDraft() {
    const interest = clean(v('interest'));
    const why = clean(v('whyThem'));
    const format = clean(v('format'));
    const opening = connectionOpening();
    const context = clean(v('studentContext'));

    let p1 = opening;
    if (context && interest) {
      p1 += `${p1 ? ' ' : ''}I’m a ${context}, and I’m currently exploring ${lowerStart(interest)}.`;
    } else if (interest) {
      p1 += `${p1 ? ' ' : ''}I’m currently exploring ${lowerStart(interest)}.`;
    } else if (context) {
      p1 += `${p1 ? ' ' : ''}I’m a ${context}.`;
    }
    if (why && !['met','referral'].includes(v('connectionType'))) {
      p1 += ` Your ${lowerStart(why)} is what made me interested in reaching out.`;
    }

    let p2 = `Would you be open to a 20–30 minute conversation so I could learn more about your experience`;
    if (interest) p2 += ` and ${lowerStart(interest)}`;
    p2 += `?`;
    if (format) p2 += ` I’m happy to connect by ${lowerStart(format)}.`;
    p2 += ` I’m glad to work around your schedule.`;

    return `${p1}\n\n${p2}\n\nThank you for considering it. I’d really appreciate the chance to learn from you.`;
  }

  function shadowDraft() {
    const interest = clean(v('interest'));
    const why = clean(v('whyThem'));
    const timing = clean(v('timing'));
    const context = clean(v('studentContext'));
    let p1 = connectionOpening();
    if (context) p1 += `${p1 ? ' ' : ''}I’m a ${context}` + (interest ? ` and I’m interested in learning more about ${lowerStart(interest)}.` : `.`);
    else if (interest) p1 += `${p1 ? ' ' : ''}I’m interested in learning more about ${lowerStart(interest)}.`;
    if (why && !['met','referral'].includes(v('connectionType'))) p1 += ` ${why}.`;

    let p2 = `Would you be open to having me shadow you for part of a day to learn more about the work firsthand?`;
    if (timing) p2 += ` ${timing}.`;
    else p2 += ` I’m flexible and happy to work around what is realistic for you.`;

    return `${p1}\n\n${p2}\n\nThank you for considering it. I’d appreciate any opportunity to learn more.`;
  }

  function followupDraft() {
    const reason = clean(v('reason'));
    const ask = clean(v('ask'));
    let p1 = connectionOpening();
    if (reason) p1 += `${p1 ? ' ' : ''}${reason.charAt(0).toUpperCase()+reason.slice(1)}.`;
    let p2 = ask ? `${ask.charAt(0).toUpperCase()+ask.slice(1)}.` : `I wanted to stay in touch and thank you again for taking the time to connect.`;
    return `${p1}\n\n${p2}\n\nThank you again for your time.`;
  }

  function thankyouDraft() {
    const thanksFor = clean(v('thanksFor'));
    const memory = clean(v('specificMemory'));
    const next = clean(v('next'));
    let p1 = `Thank you for ${thanksFor ? lowerStart(thanksFor) : 'taking the time to meet with me'}.`;
    if (memory) p1 += ` I especially appreciated ${lowerStart(memory)}.`;
    let p2 = next ? `${next.charAt(0).toUpperCase()+next.slice(1)}.` : `I appreciated the opportunity to learn more and am grateful for your time.`;
    return `${p1}\n\n${p2}`;
  }

  function requestDraft() {
    const reason = clean(v('reason'));
    const ask = clean(v('ask'));
    const context = clean(v('studentContext'));
    let p1 = connectionOpening();
    if (context) p1 += `${p1 ? ' ' : ''}I’m a ${context}.`;
    if (reason) p1 += `${p1 ? ' ' : ''}${reason.charAt(0).toUpperCase()+reason.slice(1)}.`;
    let p2 = ask ? `${ask.charAt(0).toUpperCase()+ask.slice(1)}.` : `Would you be willing to share your advice?`;
    return `${p1}\n\n${p2}\n\nThank you for your time and consideration.`;
  }

  function subject() {
    const purposeMap = {
      info:'Informational Conversation Request',
      shadow:'Job Shadow Request',
      followup:'Following Up',
      thankyou:'Thank You',
      request:'Quick Question'
    };
    return purposeMap[selectedPurpose] || 'Professional Email';
  }

  function buildDraft() {
    let body = '';
    if (selectedPurpose === 'info') body = infoDraft();
    if (selectedPurpose === 'shadow') body = shadowDraft();
    if (selectedPurpose === 'followup') body = followupDraft();
    if (selectedPurpose === 'thankyou') body = thankyouDraft();
    if (selectedPurpose === 'request') body = requestDraft();

    const greeting = `Hello ${salutation()},`;
    const signature = v('studentName') ? `Best,\n${v('studentName')}` : `Best,`;
    $('subjectOutput').value = subject();
    $('emailOutput').value = `${greeting}\n\n${body}\n\n${signature}`;
    $('purposeTip').textContent = purposes[selectedPurpose].tip;
    $('step-details').classList.add('hidden');
    $('step-draft').classList.remove('hidden');
    $('step-draft').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderPurposes() {
    $('purposeGrid').innerHTML = Object.entries(purposes).map(([key,p]) => `
      <button class="purpose-button" type="button" data-purpose="${key}">
        <strong>${p.title}</strong><span>${p.desc}</span>
      </button>`).join('');
    document.querySelectorAll('[data-purpose]').forEach(btn => btn.addEventListener('click', () => {
      selectedPurpose = btn.dataset.purpose;
      renderFields();
      $('step-purpose').classList.add('hidden');
      $('step-details').classList.remove('hidden');
      $('step-details').scrollIntoView({behavior:'smooth',block:'start'});
    }));
  }

  async function copyText(text, msg) {
    try { await navigator.clipboard.writeText(text); $('copyStatus').textContent = msg; }
    catch { $('copyStatus').textContent = 'Select the text and copy it manually.'; }
  }

  $('backToPurpose').addEventListener('click', () => {
    $('step-details').classList.add('hidden');
    $('step-purpose').classList.remove('hidden');
  });
  $('buildEmail').addEventListener('click', buildDraft);
  $('copyEmail').addEventListener('click', () => copyText($('emailOutput').value,'Email copied.'));
  $('copySubject').addEventListener('click', () => copyText($('subjectOutput').value,'Subject copied.'));
  $('startOver').addEventListener('click', () => {
    selectedPurpose='';
    $('step-draft').classList.add('hidden');
    $('step-details').classList.add('hidden');
    $('step-purpose').classList.remove('hidden');
    $('copyStatus').textContent='';
    window.scrollTo({top:0,behavior:'smooth'});
  });

  renderPurposes();
})();
