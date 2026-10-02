(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  let selectedPurpose = '';

  const purposes = {
    info: {
      title: 'Request an informational interview',
      desc: 'Ask someone for a short conversation to learn about their work or career path.',
      tip: 'An informational interview is a learning conversation—not a request for a job. A 20–30 minute ask is usually enough.',
      helper: 'Give just enough information to explain who you are, why you chose this person, and what you hope to learn.'
    },
    shadow: {
      title: 'Request a job shadow',
      desc: 'Ask to observe someone’s work and learn more about a role or setting.',
      tip: 'Make it easy to say yes by showing flexibility and making the learning goal clear.',
      helper: 'Explain the connection, what you hope to observe, and how flexible you can be.'
    },
    followup: {
      title: 'Follow up after meeting someone',
      desc: 'Reconnect after a fair, event, class, conversation, or introduction.',
      tip: 'Remind them where you met and include one specific detail so the message does not feel generic.',
      helper: 'Remind them who you are, reference something specific from the interaction, and make the next step clear.'
    },
    thankyou: {
      title: 'Send a thank-you',
      desc: 'Thank someone after an interview, informational conversation, job shadow, or other help.',
      tip: 'A strong thank-you is short, specific, and mentions something you genuinely appreciated or learned.',
      helper: 'Keep this short: what you are thanking them for, one specific takeaway, and any brief next-step message.'
    },
    request: {
      title: 'Ask for advice or help',
      desc: 'Make a professional request that does not fit the options above.',
      tip: 'Keep the request narrow. The easier it is to understand what you need, the easier it is to respond.',
      helper: 'Explain how you found or know the person, give only the context they need, and make one clear request.'
    }
  };

  function field(id, label, placeholder = '', opts = {}) {
    const cls = opts.full ? 'field full' : 'field';
    const hint = opts.hint ? ` <span class="hint">${opts.hint}</span>` : '';
    if (opts.type === 'textarea') {
      return `<div class="${cls}"><label for="${id}">${label}${hint}</label><textarea id="${id}" placeholder="${placeholder}"></textarea></div>`;
    }
    if (opts.type === 'select') {
      return `<div class="${cls}"><label for="${id}">${label}${hint}</label><select id="${id}">${opts.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}</select></div>`;
    }
    return `<div class="${cls}"><label for="${id}">${label}${hint}</label><input id="${id}" type="text" placeholder="${placeholder}"></div>`;
  }

  function sharedFields() {
    return [
      field('recipientFirst', 'Recipient first name', 'Taylor'),
      field('recipientLast', 'Recipient last name', 'Morgan'),
      field('addressStyle', 'How will you address them?', '', { type: 'select', options: [
        { value: 'first', label: 'First name' },
        { value: 'mr', label: 'Mr. + last name' },
        { value: 'ms', label: 'Ms. + last name' },
        { value: 'mrs', label: 'Mrs. + last name' },
        { value: 'dr', label: 'Dr. + last name' }
      ]}),
      field('studentName', 'Your name', 'Jordan Lee')
    ].join('');
  }

  function connectionFields() {
    return `
      <div class="connection-box">
        <h3>How are you connected to this person?</h3>
        <p>This information will become part of the opening, so the reader immediately understands why you are contacting them.</p>
        <div class="form-grid" style="margin-top:0">
          ${field('connectionType', 'How did you find or meet them?', '', { type: 'select', options: [
            { value: 'met', label: 'We met before' },
            { value: 'referral', label: 'Someone referred or introduced me' },
            { value: 'linkedin', label: 'I found them on LinkedIn' },
            { value: 'website', label: 'I found them on a school/organization website' },
            { value: 'know', label: 'I already know them' },
            { value: 'other', label: 'Something else' }
          ]})}
          ${field('connectionDetail', 'What is the connection?', 'Fall Job & Internship Fair; Professor Smith suggested I contact you; University of Iowa alumni network...', { full: true })}
          ${field('personalDetail', 'What specifically caught your attention or stuck with you?', 'A topic you discussed, something about their role, career path, school, or work that made you want to follow up', { full: true, hint: 'Optional, but this is what makes the message feel personal.' })}
        </div>
      </div>`;
  }

  function renderFields() {
    let html = sharedFields();

    if (['info', 'shadow', 'request'].includes(selectedPurpose)) html += connectionFields();

    if (selectedPurpose === 'info') {
      html += field('studentContext', 'A little about you', 'second-year elementary education student', { hint: 'Optional' });
      html += field('learningGoal', 'What would you like to learn from them?', 'what their day-to-day work is like, how they entered the field, what skills matter most...', { full: true });
      html += field('format', 'How would you be comfortable meeting?', 'phone, Zoom, or whichever is easiest', { hint: 'Optional' });
    } else if (selectedPurpose === 'shadow') {
      html += field('studentContext', 'A little about you', 'junior secondary education student', { hint: 'Optional' });
      html += field('learningGoal', 'What do you hope to learn or observe?', 'how a typical day works, how the team collaborates, how students are supported...', { full: true });
      html += field('timing', 'Anything useful about your availability?', 'I am flexible and happy to work around your schedule', { hint: 'Optional' });
    } else if (selectedPurpose === 'followup') {
      html += field('meetingContext', 'Where or how did you connect?', 'the Fall Job & Internship Fair, after class, during an alumni panel...', { full: true });
      html += field('specificTakeaway', 'What do you remember or appreciate from the interaction?', 'our conversation about your transition into school counseling...', { full: true, hint: 'Optional, but strongly recommended.' });
      html += field('nextStep', 'What do you want to happen next?', 'stay connected, continue the conversation, set up a short informational interview...', { full: true, hint: 'Optional' });
    } else if (selectedPurpose === 'thankyou') {
      html += field('thanksFor', 'What are you thanking them for?', 'meeting with me for an interview, letting me shadow you, taking time for an informational conversation...', { full: true });
      html += field('specificTakeaway', 'What is one specific thing you appreciated or learned?', 'hearing how your team supports new teachers, learning more about the role, seeing the classroom in action...', { full: true });
      html += field('nextStep', 'Anything you want to reinforce?', 'my continued interest in the position, that I hope to stay in touch...', { full: true, hint: 'Optional' });
    } else if (selectedPurpose === 'request') {
      html += field('studentContext', 'A little about you', 'University of Iowa student studying...', { hint: 'Optional' });
      html += field('ask', 'What are you asking for?', 'Would you be willing to share a few resources? Could I ask you two questions about...?', { full: true });
    }

    $('dynamicFields').innerHTML = html;
    $('detailsHelper').textContent = purposes[selectedPurpose].helper;
  }

  function v(id) { return ($(id)?.value || '').trim(); }

  function salutation() {
    const first = v('recipientFirst');
    const last = v('recipientLast');
    const style = v('addressStyle');
    if (style === 'first') return first || 'there';
    const titles = { mr: 'Mr.', ms: 'Ms.', mrs: 'Mrs.', dr: 'Dr.' };
    return `${titles[style] || ''}${last ? ' ' + last : ''}`.trim() || first || 'there';
  }

  function clean(s) {
    return String(s || '').replace(/\s+/g, ' ').trim().replace(/[.?!]+$/, '');
  }

  function lowerStart(s) {
    s = clean(s);
    return s ? s.charAt(0).toLowerCase() + s.slice(1) : '';
  }

  function sentence(s) {
    s = clean(s);
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  }

  function joinSentences(parts) {
    return parts.filter(Boolean).join(' ');
  }

  function connectionOpening() {
    const type = v('connectionType');
    const detail = clean(v('connectionDetail'));
    const personal = clean(v('personalDetail'));
    let first = '';

    if (type === 'met') {
      first = detail ? `It was great meeting you ${/^at\b|^during\b|^through\b|^after\b/i.test(detail) ? '' : 'at '}${detail}.` : 'It was great meeting you recently.';
    } else if (type === 'referral') {
      first = detail ? `${sentence(detail).replace(/\.$/, '')} suggested I reach out to you.` : 'A mutual connection suggested I reach out to you.';
    } else if (type === 'linkedin') {
      first = detail ? `I came across your profile on LinkedIn while exploring ${lowerStart(detail)}.` : 'I came across your profile on LinkedIn while exploring this career area.';
    } else if (type === 'website') {
      first = detail ? `I found your information while learning more about ${lowerStart(detail)}.` : 'I found your information while learning more about your school or organization.';
    } else if (type === 'know') {
      first = detail ? `I wanted to follow up after ${lowerStart(detail)}.` : 'I wanted to reach out with a quick question.';
    } else if (type === 'other') {
      first = detail ? sentence(detail) : '';
    }

    const second = personal ? `I was especially interested in ${lowerStart(personal)}.` : '';
    return joinSentences([first, second]);
  }

  function infoDraft() {
    const opening = connectionOpening();
    const context = clean(v('studentContext'));
    const goal = clean(v('learningGoal'));
    const format = clean(v('format'));

    const intro = context ? `I’m a ${context}, and I’d love to learn more about your experience.` : `I’d love to learn more about your experience.`;
    let ask = `Would you be open to a 20–30 minute informational conversation`;
    if (goal) ask += ` about ${lowerStart(goal)}`;
    ask += `?`;
    if (format) ask += ` I’m happy to connect by ${lowerStart(format)}.`;
    ask += ` I’m glad to work around your schedule.`;

    return `${joinSentences([opening, intro])}\n\n${ask}\n\nThank you for considering it. I’d really appreciate the opportunity to learn from you.`;
  }

  function shadowDraft() {
    const opening = connectionOpening();
    const context = clean(v('studentContext'));
    const goal = clean(v('learningGoal'));
    const timing = clean(v('timing'));

    const intro = context ? `I’m a ${context}, and I’m interested in learning more about your work firsthand.` : `I’m interested in learning more about your work firsthand.`;
    let ask = `Would you be open to having me shadow you for part of a day`;
    if (goal) ask += ` so I could learn more about ${lowerStart(goal)}`;
    ask += `?`;
    ask += timing ? ` ${sentence(timing)}` : ` I’m flexible and happy to work around what is realistic for you.`;

    return `${joinSentences([opening, intro])}\n\n${ask}\n\nThank you for considering it. I’d appreciate any opportunity to learn more.`;
  }

  function followupDraft() {
    const meeting = clean(v('meetingContext'));
    const takeaway = clean(v('specificTakeaway'));
    const next = clean(v('nextStep'));

    const intro = meeting ? `It was great connecting with you ${/^at\b|^during\b|^through\b|^after\b/i.test(meeting) ? '' : 'at '}${meeting}.` : `It was great connecting with you recently.`;
    const detail = takeaway ? `I especially enjoyed ${lowerStart(takeaway)}.` : '';
    const action = next ? sentence(next) : `I wanted to follow up and stay in touch.`;

    return `${joinSentences([intro, detail])}\n\n${action}\n\nThank you again for your time.`;
  }

  function thankyouDraft() {
    const thanksFor = clean(v('thanksFor'));
    const takeaway = clean(v('specificTakeaway'));
    const next = clean(v('nextStep'));

    const first = `Thank you for ${thanksFor ? lowerStart(thanksFor) : 'taking the time to meet with me'}.`;
    const detail = takeaway ? `I especially appreciated ${lowerStart(takeaway)}.` : '';
    const final = next ? sentence(next) : `I’m grateful for your time and the opportunity to learn more.`;

    return `${joinSentences([first, detail])}\n\n${final}`;
  }

  function requestDraft() {
    const opening = connectionOpening();
    const context = clean(v('studentContext'));
    const ask = clean(v('ask'));

    const intro = context ? `I’m a ${context}.` : '';
    const request = ask ? sentence(ask) : `Would you be willing to share your advice?`;

    return `${joinSentences([opening, intro])}\n\n${request}\n\nThank you for your time and consideration.`;
  }

  function subject() {
    const purposeMap = {
      info: 'Informational Conversation Request',
      shadow: 'Job Shadow Request',
      followup: 'Following Up',
      thankyou: 'Thank You',
      request: 'Quick Question'
    };
    return purposeMap[selectedPurpose] || 'Professional Email';
  }

  function buildDraft() {
    const builders = {
      info: infoDraft,
      shadow: shadowDraft,
      followup: followupDraft,
      thankyou: thankyouDraft,
      request: requestDraft
    };
    const body = builders[selectedPurpose] ? builders[selectedPurpose]() : '';
    const greeting = `Hello ${salutation()},`;
    const signature = v('studentName') ? `Best,\n${v('studentName')}` : 'Best,';

    $('subjectOutput').value = subject();
    $('emailOutput').value = `${greeting}\n\n${body}\n\n${signature}`;
    $('purposeTip').textContent = purposes[selectedPurpose].tip;
    $('step-details').classList.add('hidden');
    $('step-draft').classList.remove('hidden');
    $('step-draft').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderPurposes() {
    $('purposeGrid').innerHTML = Object.entries(purposes).map(([key, p]) => `
      <button class="purpose-button" type="button" data-purpose="${key}">
        <strong>${p.title}</strong><span>${p.desc}</span>
      </button>`).join('');

    document.querySelectorAll('[data-purpose]').forEach(btn => btn.addEventListener('click', () => {
      selectedPurpose = btn.dataset.purpose;
      renderFields();
      $('step-purpose').classList.add('hidden');
      $('step-details').classList.remove('hidden');
      $('step-details').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  async function copyText(text, msg) {
    try {
      await navigator.clipboard.writeText(text);
      $('copyStatus').textContent = msg;
    } catch {
      $('copyStatus').textContent = 'Select the text and copy it manually.';
    }
  }

  $('backToPurpose').addEventListener('click', () => {
    $('step-details').classList.add('hidden');
    $('step-purpose').classList.remove('hidden');
  });

  $('buildEmail').addEventListener('click', buildDraft);
  $('copyEmail').addEventListener('click', () => copyText($('emailOutput').value, 'Email copied.'));
  $('copySubject').addEventListener('click', () => copyText($('subjectOutput').value, 'Subject copied.'));
  $('startOver').addEventListener('click', () => {
    selectedPurpose = '';
    $('step-draft').classList.add('hidden');
    $('step-details').classList.add('hidden');
    $('step-purpose').classList.remove('hidden');
    $('copyStatus').textContent = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  renderPurposes();
})();
