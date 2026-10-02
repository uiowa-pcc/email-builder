(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  let selectedPurpose = '';

  const purposes = {
    info: {
      title: 'Learn about a role or career path',
      desc: 'Ask someone about their work or career path.',
      tip: 'Keep the ask small and clear. You do not need to call it an informational interview—just ask for a brief conversation or meeting to learn from their experience.',
      helper: 'Add the details they need to understand who you are and why you are reaching out.'
    },
    shadow: {
      title: 'Request a job shadow',
      desc: 'Ask to observe someone’s work firsthand.',
      tip: 'Show what you hope to learn, then make the logistics easy by being flexible about timing.',
      helper: 'Add enough context to make the request easy to understand.'
    },
    followup: {
      title: 'Follow up after meeting someone',
      desc: 'Reconnect after meeting someone.',
      tip: 'A useful follow-up reminds them where you connected, references something specific, and gives the relationship a natural next step.',
      helper: 'Remind them where you connected and what stood out.'
    },
    thankyou: {
      title: 'Send a thank-you',
      desc: 'Thank someone for their time or help.',
      tip: 'A thank-you can still be concise without feeling abrupt. Mention what you appreciated, one specific takeaway, and—when it fits—what you are looking forward to next.',
      helper: 'One specific detail is usually enough.'
    },
    request: {
      title: 'Ask for advice or help',
      desc: 'Make another professional request.',
      tip: 'Give enough context to make the request understandable, then make one clear ask.',
      helper: 'Give enough context, then make one clear ask.'
    }
  };

  function esc(s = '') {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function suggestions(id, items = [], label = 'Need ideas?') {
    if (!items.length) return '';
    return `<details class="suggestion-wrap"><summary>${esc(label)}</summary><div class="suggestions" aria-label="Wording ideas">${items.map(item =>
      `<button type="button" class="suggestion-chip" data-fill="${esc(id)}" data-value="${esc(item)}">${esc(item)}</button>`
    ).join('')}</div></details>`;
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
        <h3>How are you connected?</h3>
        <div class="form-grid" style="margin-top:0">
          ${field('connectionType', 'How did you find or meet them?', '', { type: 'select', options: [
            { value: 'met', label: 'We met before' },
            { value: 'referral', label: 'Someone referred or introduced me' },
            { value: 'linkedin', label: 'I found them on LinkedIn' },
            { value: 'website', label: 'I found them on an organization/company website' },
            { value: 'know', label: 'I already know them' },
            { value: 'other', label: 'Something else' }
          ]})}
          ${field('connectionDetail', 'What is the connection?', 'Add enough detail that they can quickly place you.', { full: true, hint: 'Be specific enough to jog their memory.' })}
          <div class="field" id="metDateField" hidden>
            <label for="metDate">Date you met <span class="hint">Optional</span></label>
            <input id="metDate" type="text" placeholder="September 24">
          </div>
          <div class="field full" id="connectionIdeas"></div>
          ${field('personalDetail', 'What specifically caught your attention?', 'Their role, career path, something you discussed, or a part of their work you would like to understand better', {
            full: true,
            hint: 'Optional'
          })}
        </div>
      </div>`;
  }

  const connectionIdeas = {
    met: ['the University of Iowa Fall Job & Internship Fair at the Iowa Memorial Union', 'the Tippie alumni panel on September 18', 'the Cedar Rapids Young Professionals networking event'],
    referral: ['Professor Maya Smith from the University of Iowa', 'Jordan Lee, who works with you at Principal Financial Group', 'Alex Chen, who introduced us by email last week'],
    linkedin: ['your LinkedIn profile while researching user experience roles at Principal Financial Group', 'your profile in the University of Iowa alumni network while exploring physical therapy careers'],
    website: ['your bio on the Mercy Medical Center rehabilitation team page', 'the financial planning staff page on your organization’s website'],
    know: ['our conversation after the Marketing Institute meeting last Thursday', 'working together on the Hawkeye Service Project this semester'],
    other: []
  };

  const connectionPromptByType = {
    met: {
      label: 'What event or setting did you meet at?',
      placeholder: 'Example: the University of Iowa Fall Job & Internship Fair at the Iowa Memorial Union'
    },
    referral: {
      label: 'Who referred or introduced you?',
      placeholder: 'Example: Professor Maya Smith from the University of Iowa'
    },
    linkedin: {
      label: 'What were you looking for when you found them?',
      placeholder: 'Example: your LinkedIn profile while researching UX roles at Principal Financial Group'
    },
    website: {
      label: 'Where exactly did you find them?',
      placeholder: 'Example: your bio on the Mercy Medical Center rehabilitation team page'
    },
    know: {
      label: 'What shared context will help them place you?',
      placeholder: 'Example: our conversation after the Marketing Institute meeting last Thursday'
    },
    other: {
      label: 'What specific context will help them place you?',
      placeholder: 'Include a specific person, event, organization, location, date, or shared experience when useful.'
    }
  };

  function renderConnectionIdeas() {
    const host = $('connectionIdeas');
    const type = v('connectionType');
    if (!host) return;

    const prompt = connectionPromptByType[type] || connectionPromptByType.other;
    const detail = $('connectionDetail');
    const label = document.querySelector('label[for="connectionDetail"]');
    if (label) {
      const hint = label.querySelector('.hint');
      label.childNodes[0].nodeValue = prompt.label;
      if (hint) label.appendChild(hint);
    }
    if (detail) detail.placeholder = prompt.placeholder;

    const metDateField = $('metDateField');
    if (metDateField) metDateField.hidden = type !== 'met';

    const items = connectionIdeas[type] || [];
    host.innerHTML = items.length ? suggestions('connectionDetail', items, 'Need an example?') : '';
    wireSuggestionChips(host);
  }

  function renderFields() {
    let html = sharedFields();

    if (['info', 'shadow', 'request'].includes(selectedPurpose)) html += connectionFields();

    if (selectedPurpose === 'info') {
      html += field('studentContext', 'How would you briefly describe yourself?', 'University of Iowa student exploring marketing', {
        hint: 'Optional'
      });
      html += field('interestArea', 'What do you want to learn more about?', 'product marketing, financial analysis, user experience research, healthcare administration...', {
        full: true
      });
      html += field('meetingFormat', 'How would you like to meet?', '', { type: 'select', options: [
        { value: 'flexible', label: 'Zoom, phone, or in person — whatever is easiest' },
        { value: 'zoom', label: 'Zoom' },
        { value: 'phone', label: 'Phone' },
        { value: 'inperson', label: 'In person' },
        { value: 'zoomorinperson', label: 'Zoom or in person' }
      ]});
      html += field('infoTiming', 'Preferred timeframe', '', { type: 'select', options: [
        { value: 'flexible', label: 'No specific timeframe — I am flexible' },
        { value: 'week', label: 'Within the next week' },
        { value: 'twoweeks', label: 'Within the next two weeks' },
        { value: 'month', label: 'Sometime this month' }
      ]});
      html += field('extraLearning', 'Anything you especially want to ask about?', 'How they got started, day-to-day work, skills that matter...', {
        full: true,
        hint: 'Optional',
        suggestionLabel: 'Need ideas?',
        suggestions: ['how you got started in the field', 'what a typical day in your role looks like', 'which skills matter most in your work', 'what you wish you had known when you were starting out']
      });
    } else if (selectedPurpose === 'shadow') {
      html += field('studentContext', 'How would you briefly describe yourself?', 'University of Iowa student exploring physical therapy', {
        hint: 'Optional'
      });
      html += field('learningGoal', 'What do you hope to learn or observe?', 'what the day-to-day work looks like and how you interact with clients', {
        full: true,
        suggestionLabel: 'Need ideas?',
        suggestions: ['what a typical day looks like', 'how you interact with clients or customers', 'how your team works together', 'which skills you use most often']
      });
      html += field('shadowTiming', 'Preferred timeframe', '', { type: 'select', options: [
        { value: 'flexible', label: 'No specific timeframe — I am flexible' },
        { value: 'week', label: 'Within the next week' },
        { value: 'twoweeks', label: 'Within the next two weeks' },
        { value: 'month', label: 'Sometime this month' }
      ]});
    } else if (selectedPurpose === 'followup') {
      html += field('meetingContext', 'Where or how did you connect?', 'the Fall Job & Internship Fair, an alumni panel, a networking event...', {
        full: true
      });
      html += field('specificTakeaway', 'What stood out from the conversation?', 'your advice about entering the field, hearing about the team, learning about a career path...', {
        full: true
      });
      html += field('nextStep', 'What would you like to happen next?', 'Write a full sentence, or choose an idea below.', {
        full: true,
        hint: 'Optional',
        suggestionLabel: 'Need ideas?',
        suggestions: [
          'I’d be glad to stay in touch as I continue exploring this field.',
          'I’d enjoy continuing the conversation if an opportunity comes up.',
          'If you’re open to it, I’d appreciate the chance to talk again sometime.'
        ]
      });
    } else if (selectedPurpose === 'thankyou') {
      html += field('thanksFor', 'What are you thanking them for?', 'meeting with me for an interview, taking time to talk, letting me shadow you...', {
        full: true
      });
      html += field('specificTakeaway', 'What is one specific thing you appreciated or learned?', 'hearing about the team’s priorities, learning how you entered the field, seeing the work firsthand...', {
        full: true,
        suggestionLabel: 'Need ideas?',
        suggestions: ['hearing more about the team and its priorities', 'learning about your path into the field', 'your advice about preparing for this type of work', 'seeing what the work looks like day to day']
      });
      html += field('nextStep', 'What would you like to say about what comes next?', 'Write a full sentence, or choose an idea below.', {
        full: true,
        hint: 'Optional',
        suggestionLabel: 'Need ideas?',
        suggestions: [
          'I hope we can stay in touch as I continue exploring this field.',
          'The conversation strengthened my interest in the opportunity.',
          'I’m looking forward to applying what I learned as I take my next steps.',
          'I’d be glad to stay connected and continue learning from your work.'
        ]
      });
    } else if (selectedPurpose === 'request') {
      html += field('studentContext', 'How would you briefly describe yourself?', 'University of Iowa student exploring...', {
        hint: 'Optional'
      });
      html += field('ask', 'What are you asking for?', 'Would you be willing to share a few resources or point me in the right direction?', {
        full: true,
        suggestionLabel: 'Need help wording it?',
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
      const metDate = clean(v('metDate'));
      if (detail) {
        const where = `${/^at\b|^during\b|^through\b|^after\b/i.test(detail) ? '' : 'at '}${detail}`;
        first = `It was great meeting you ${where}${metDate ? ` on ${metDate}` : ''}.`;
      } else {
        first = metDate ? `It was great meeting you on ${metDate}.` : 'It was great meeting you recently.';
      }
    } else if (type === 'referral') {
      first = detail ? `${detail} suggested I reach out to you.` : 'A mutual connection suggested I reach out to you.';
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

  function timingPhrase(id) {
    const timing = v(id);
    return {
      week: 'within the next week',
      twoweeks: 'within the next two weeks',
      month: 'sometime this month',
      flexible: ''
    }[timing] || '';
  }

  function infoDraft() {
    const opening = connectionOpening();
    const context = clean(v('studentContext'));
    const area = clean(v('interestArea'));
    const extra = clean(v('extraLearning'));

    const who = context ? `I’m a ${context}, and I’m very interested in learning more about ${area ? lowerStart(area) : 'your work and career path'}.` : `I’m very interested in learning more about ${area ? lowerStart(area) : 'your work and career path'}.`;
    const specific = extra ? `I’d especially value hearing about ${lowerStart(extra)}.` : '';
    const timing = timingPhrase('infoTiming');
    const ask = `Would you be open to a 20–30 minute conversation ${meetingPhrase()}${timing ? ` ${timing}` : ''}? I’m happy to work around your schedule.`;

    return `${joinSentences([opening, who, specific])}\n\n${ask}\n\nThank you for considering. I would really appreciate the opportunity to learn from you.`;
  }

  function shadowDraft() {
    const opening = connectionOpening();
    const context = clean(v('studentContext'));
    const goal = clean(v('learningGoal'));
    const timing = timingPhrase('shadowTiming');

    const intro = context ? `I’m a ${context}, and I’m interested in learning more about your work firsthand.` : `I’m interested in learning more about your work firsthand.`;
    const purpose = goal ? `I would especially like to observe ${lowerStart(goal)}.` : '';
    const ask = timing
      ? `Would you be open to having me shadow you for part of a day ${timing}? I’m happy to work around what is realistic for you.`
      : `Would you be open to having me shadow you for part of a day? I’m flexible and happy to work around what is realistic for you.`;

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

  function titleCasePhrase(value) {
    return clean(value).replace(/\b\w/g, c => c.toUpperCase());
  }

  function shortEventSubject(detail) {
    const d = clean(detail).toLowerCase();
    if (!d) return 'Following Up';
    if (/career fair|job fair|internship fair/.test(d)) return 'Following Up from the Career Fair';
    if (/alumni panel/.test(d)) return 'Following Up from the Alumni Panel';
    if (/panel/.test(d)) return 'Following Up from the Panel';
    if (/networking/.test(d)) return 'Following Up from the Networking Event';
    if (/conference/.test(d)) return 'Following Up from the Conference';
    if (/workshop/.test(d)) return 'Following Up from the Workshop';

    const short = clean(detail)
      .replace(/^(the|an|a)\s+/i, '')
      .split(/\s+(?:at|in|on)\s+/i)[0]
      .trim();
    const words = short.split(/\s+/).filter(Boolean);
    if (words.length <= 4 && short.length <= 32) return `Following Up from ${titleCasePhrase(short)}`;
    return 'Following Up';
  }

  function infoSubject() {
    const area = clean(v('interestArea'));
    const type = v('connectionType');
    const detail = clean(v('connectionDetail'));

    if (type === 'referral' && detail) {
      const match = detail.match(/^(.+?)\s+(?:suggested|recommended|encouraged|referred|introduced)\b/i);
      if (match && match[1].length <= 35) return `${match[1]} Suggested I Reach Out`;
    }
    if (type === 'met') return shortEventSubject(detail);
    if (area) return `Question About ${titleCasePhrase(area)}`;
    return 'Question About Your Work';
  }

  function subject() {
    const purposeMap = {
      info: infoSubject(),
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
