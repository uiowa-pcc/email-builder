(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  let selectedPurpose = '';

  const purposes = {
    info: {
      title: 'Ask for a short career conversation',
      desc: 'Reach out to someone to learn more about their work, field, or career path.',
      tip: 'Keep the ask small and clear. A 20–30 minute conversation is usually enough, and it can happen by Zoom, phone, or in person.',
      helper: 'You do not need perfect wording. Use the examples when they help, then make the draft sound like you.'
    },
    shadow: {
      title: 'Request a job shadow',
      desc: 'Ask to observe someone’s work and learn more about a role or setting.',
      tip: 'Show what you hope to learn, then make the logistics easy by being flexible about timing.',
      helper: 'Use the prompts to explain the connection, what you hope to observe, and what would make the experience useful.'
    },
    followup: {
      title: 'Follow up after meeting someone',
      desc: 'Reconnect after a fair, event, class, conversation, or introduction.',
      tip: 'A useful follow-up reminds them where you connected, references something specific, and gives the relationship a natural next step.',
      helper: 'You only need one memorable detail and one reason for staying connected.'
    },
    thankyou: {
      title: 'Send a thank-you',
      desc: 'Thank someone after an interview, conversation, job shadow, or other professional help.',
      tip: 'A thank-you can still be concise without feeling abrupt. Mention what you appreciated, one specific takeaway, and—when it fits—what you are looking forward to next.',
      helper: 'Use one specific detail so the message feels personal rather than generic.'
    },
    request: {
      title: 'Ask for advice or help',
      desc: 'Make a professional request that does not fit the options above.',
      tip: 'Give enough context to make the request understandable, then make one clear ask.',
      helper: 'If you are unsure how to phrase the request, choose one of the common starting points and edit it.'
    }
  };

  function esc(s = '') {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function suggestions(id, items = [], label = 'Need a wording idea?') {
    if (!items.length) return '';
    return `<div class="suggestion-wrap"><p class="suggestion-label">${esc(label)}</p><div class="suggestions" aria-label="Wording ideas">${items.map(item =>
      `<button type="button" class="suggestion-chip" data-fill="${esc(id)}" data-value="${esc(item)}">${esc(item)}</button>`
    ).join('')}</div></div>`;
  }

  function field(id, label, placeholder = '', opts = {}) {
    const cls = opts.full ? 'field full' : 'field';
    const hint = opts.hint ? ` <span class="hint">${opts.hint}</span>` : '';
    let control = '';
    if (opts.type === 'textarea') {
      control = `<textarea id="${id}" placeholder="${esc(placeholder)}"></textarea>`;
    } else if (opts.type === 'select') {
      control = `<select id="${id}">${opts.options.map(o => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}</select>`;
    } else {
      control = `<input id="${id}" type="text" placeholder="${esc(placeholder)}">`;
    }
    return `<div class="${cls}"><label for="${id}">${label}${hint}</label>${control}${suggestions(id, opts.suggestions, opts.suggestionLabel)}</div>`;
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
        <p>This becomes part of the opening so they immediately understand why you are reaching out.</p>
        <div class="form-grid" style="margin-top:0">
          ${field('connectionType', 'How did you find or meet them?', '', { type: 'select', options: [
            { value: 'met', label: 'We met before' },
            { value: 'referral', label: 'Someone referred or introduced me' },
            { value: 'linkedin', label: 'I found them on LinkedIn' },
            { value: 'website', label: 'I found them on an organization/company website' },
            { value: 'know', label: 'I already know them' },
            { value: 'other', label: 'Something else' }
          ]})}
          ${field('connectionDetail', 'What is the connection?', 'Add the specific event, person, page, or shared context.', { full: true })}
          <div class="field full" id="connectionIdeas"></div>
          ${field('personalDetail', 'What specifically caught your attention?', 'Their role, career path, something you discussed, or a part of their work you would like to understand better', {
            full: true,
            hint: 'Optional. Use this only if it adds something personal to the opening.'
          })}
        </div>
      </div>`;
  }

  const connectionIdeas = {
    met: ['the Fall Job & Internship Fair', 'an alumni panel', 'a networking event'],
    referral: ['Professor Smith suggested I reach out', 'Jordan Lee recommended I contact you', 'a colleague introduced us by email'],
    linkedin: ['the University of Iowa alumni network', 'your LinkedIn profile while researching this field'],
    website: ['your bio on the organization website', 'the staff page for your department'],
    know: ['our conversation last week', 'working together on a recent project'],
    other: []
  };

  function renderConnectionIdeas() {
    const host = $('connectionIdeas');
    const type = v('connectionType');
    if (!host) return;
    const items = connectionIdeas[type] || [];
    host.innerHTML = items.length ? suggestions('connectionDetail', items, 'A few ways to phrase this connection:') : '';
    wireSuggestionChips(host);
  }

  function renderFields() {
    let html = sharedFields();

    if (['info', 'shadow', 'request'].includes(selectedPurpose)) html += connectionFields();

    if (selectedPurpose === 'info') {
      html += field('studentContext', 'How would you briefly describe yourself?', 'University of Iowa student exploring marketing', {
        hint: 'Optional'
      });
      html += field('interestArea', 'What role, field, or area are you interested in learning more about?', 'product marketing, financial analysis, user experience research, healthcare administration...', {
        full: true
      });
      html += field('meetingFormat', 'How would you like to meet?', '', { type: 'select', options: [
        { value: 'flexible', label: 'Zoom, phone, or in person — whatever is easiest' },
        { value: 'zoom', label: 'Zoom' },
        { value: 'phone', label: 'Phone' },
        { value: 'inperson', label: 'In person' },
        { value: 'zoomorinperson', label: 'Zoom or in person' }
      ]});
      html += field('extraLearning', 'Is there one thing you would especially like to learn about?', 'Optional — for example, how they got started or what they wish they knew earlier', {
        full: true,
        hint: 'Optional',
        suggestionLabel: 'Not sure what to focus on? Choose one that fits:',
        suggestions: ['how you got started in the field', 'what a typical day in your role looks like', 'which skills matter most in your work', 'what you wish you had known when you were starting out']
      });
    } else if (selectedPurpose === 'shadow') {
      html += field('studentContext', 'How would you briefly describe yourself?', 'University of Iowa student exploring physical therapy', {
        hint: 'Optional'
      });
      html += field('learningGoal', 'What do you hope to learn or observe?', 'what the day-to-day work looks like and how you interact with clients', {
        full: true,
        suggestionLabel: 'Need a starting point? These fit directly after “I would especially like to observe…”',
        suggestions: ['what a typical day looks like', 'how you interact with clients or customers', 'how your team works together', 'which skills you use most often']
      });
      html += field('timing', 'Anything useful about your availability?', 'I am flexible and happy to work around your schedule', {
        hint: 'Optional'
      });
    } else if (selectedPurpose === 'followup') {
      html += field('meetingContext', 'Where or how did you connect?', 'the Fall Job & Internship Fair, an alumni panel, a networking event...', {
        full: true
      });
      html += field('specificTakeaway', 'What stood out from the conversation?', 'your advice about entering the field, hearing about the team, learning about a career path...', {
        full: true
      });
      html += field('nextStep', 'What would you like to happen next?', 'stay connected, continue the conversation, set up a short conversation...', {
        full: true,
        hint: 'Optional',
        suggestionLabel: 'If you mainly want to keep the connection open:',
        suggestions: ['I would be glad to stay connected', 'I hope we can stay in touch', 'I would enjoy continuing the conversation sometime']
      });
    } else if (selectedPurpose === 'thankyou') {
      html += field('thanksFor', 'What are you thanking them for?', 'meeting with me for an interview, taking time to talk, letting me shadow you...', {
        full: true
      });
      html += field('specificTakeaway', 'What is one specific thing you appreciated or learned?', 'hearing about the team’s priorities, learning how you entered the field, seeing the work firsthand...', {
        full: true,
        suggestionLabel: 'If you are stuck, choose the type of detail you want to mention:',
        suggestions: ['hearing more about the team and its priorities', 'learning about your path into the field', 'your advice about preparing for this type of work', 'seeing what the work looks like day to day']
      });
      html += field('nextStep', 'What would you like to reinforce?', 'my interest in the role, that I hope to stay in touch, that I appreciated the opportunity...', {
        full: true,
        hint: 'Optional'
      });
    } else if (selectedPurpose === 'request') {
      html += field('studentContext', 'How would you briefly describe yourself?', 'University of Iowa student exploring...', {
        hint: 'Optional'
      });
      html += field('ask', 'What are you asking for?', 'Would you be willing to share a few resources or point me in the right direction?', {
        full: true,
        suggestionLabel: 'Need help phrasing the ask? Choose the closest one and edit it:',
        suggestions: ['Would you be willing to share any resources you recommend?', 'Could I ask you a few questions about your experience?', 'Would you be willing to point me toward someone who may know more?']
      });
    }

    $('dynamicFields').innerHTML = html;
    $('detailsHelper').textContent = purposes[selectedPurpose].helper;

    wireSuggestionChips(document);
    if ($('connectionType')) {
      $('connectionType').addEventListener('change', renderConnectionIdeas);
      renderConnectionIdeas();
    }
  }

  function wireSuggestionChips(root = document) {
    root.querySelectorAll('.suggestion-chip').forEach(btn => {
      if (btn.dataset.wired === 'true') return;
      btn.dataset.wired = 'true';
      btn.addEventListener('click', () => {
        const target = $(btn.dataset.fill);
        if (target) {
          target.value = btn.dataset.value;
          target.focus();
        }
      });
    });
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

  function joinSentences(parts) { return parts.filter(Boolean).join(' '); }

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
      first = detail ? `I came across your profile on LinkedIn while learning more about ${lowerStart(detail)}.` : 'I came across your profile on LinkedIn while exploring this career area.';
    } else if (type === 'website') {
      first = detail ? `I found your information while learning more about ${lowerStart(detail)}.` : 'I found your information while learning more about your organization.';
    } else if (type === 'know') {
      first = detail ? `I wanted to follow up after ${lowerStart(detail)}.` : 'I wanted to reach out with a quick question.';
    } else if (type === 'other') {
      first = detail ? sentence(detail) : '';
    }

    const second = personal ? `I was especially interested in ${lowerStart(personal)}.` : '';
    return joinSentences([first, second]);
  }

  function meetingPhrase() {
    const format = v('meetingFormat');
    return {
      flexible: 'over Zoom, by phone, or in person—whatever is easiest for you',
      zoom: 'over Zoom',
      phone: 'by phone',
      inperson: 'in person',
      zoomorinperson: 'over Zoom or in person'
    }[format] || 'over Zoom, by phone, or in person';
  }

  function infoDraft() {
    const opening = connectionOpening();
    const context = clean(v('studentContext'));
    const area = clean(v('interestArea'));
    const extra = clean(v('extraLearning'));

    const who = context ? `I’m a ${context}, and I’m very interested in learning more about ${area ? lowerStart(area) : 'your work and career path'}.` : `I’m very interested in learning more about ${area ? lowerStart(area) : 'your work and career path'}.`;
    const specific = extra ? `I’d especially value hearing about ${lowerStart(extra)}.` : '';
    const ask = `Would you be open to a 20–30 minute conversation ${meetingPhrase()}? I’m happy to work around your schedule.`;

    return `${joinSentences([opening, who, specific])}\n\n${ask}\n\nThank you for considering. I would really appreciate the opportunity to learn from you.`;
  }

  function shadowDraft() {
    const opening = connectionOpening();
    const context = clean(v('studentContext'));
    const goal = clean(v('learningGoal'));
    const timing = clean(v('timing'));

    const intro = context ? `I’m a ${context}, and I’m interested in learning more about your work firsthand.` : `I’m interested in learning more about your work firsthand.`;
    const purpose = goal ? `I would especially like to observe ${lowerStart(goal)}.` : '';
    const ask = `Would you be open to having me shadow you for part of a day? ${timing ? sentence(timing) : 'I’m flexible and happy to work around what is realistic for you.'}`;

    return `${joinSentences([opening, intro, purpose])}\n\n${ask}\n\nThank you for considering. I would really appreciate the opportunity to learn more about the work firsthand.`;
  }

  function followupDraft() {
    const meeting = clean(v('meetingContext'));
    const takeaway = clean(v('specificTakeaway'));
    const next = clean(v('nextStep'));

    const intro = meeting ? `It was great connecting with you ${/^at\b|^during\b|^through\b|^after\b/i.test(meeting) ? '' : 'at '}${meeting}.` : `It was great connecting with you recently.`;
    const detail = takeaway ? `I especially appreciated ${lowerStart(takeaway)}.` : '';
    const bridge = `I wanted to follow up while our conversation was still fresh.`;
    const action = next ? sentence(next) : `I would be glad to stay connected.`;

    return `${joinSentences([intro, detail, bridge])}\n\n${action}\n\nThank you again for your time. I enjoyed the conversation and hope we have a chance to connect again.`;
  }

  function thankyouDraft() {
    const thanksFor = clean(v('thanksFor'));
    const takeaway = clean(v('specificTakeaway'));
    const next = clean(v('nextStep'));

    const first = `Thank you again for ${thanksFor ? lowerStart(thanksFor) : 'taking the time to meet with me'}.`;
    const detail = takeaway ? `I especially appreciated ${lowerStart(takeaway)}.` : `I appreciated the chance to learn more from you.`;
    const reinforce = next ? sentence(next) : `The conversation gave me a much better sense of the work and what to consider moving forward.`;
    const close = `Thank you again for your time and for sharing your perspective.`;

    return `${joinSentences([first, detail])}\n\n${joinSentences([reinforce, close])}`;
  }

  function requestDraft() {
    const opening = connectionOpening();
    const context = clean(v('studentContext'));
    const ask = clean(v('ask'));

    const intro = context ? `I’m a ${context}, and I’m reaching out because I’m trying to learn more about this area.` : `I’m reaching out because I’m trying to learn more about this area.`;
    const request = ask ? sentence(ask) : `Would you be willing to share any advice or resources you recommend?`;

    return `${joinSentences([opening, intro])}\n\n${request}\n\nThank you for considering. I appreciate your time.`;
  }

  function subject() {
    const area = clean(v('interestArea'));
    const purposeMap = {
      info: area ? `Quick Question About ${area.charAt(0).toUpperCase() + area.slice(1)}` : 'Request for a Short Career Conversation',
      shadow: 'Job Shadow Request',
      followup: 'Great Connecting With You',
      thankyou: 'Thank You',
      request: 'Quick Question'
    };
    return purposeMap[selectedPurpose] || 'Professional Email';
  }

  function buildDraft() {
    const builders = { info: infoDraft, shadow: shadowDraft, followup: followupDraft, thankyou: thankyouDraft, request: requestDraft };
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
