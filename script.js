const commonRecipientFields = [
  selectField("addressStyle", "How should you address them?", [
    ["formal", "Mr./Ms./Mrs./Dr. + last name"],
    ["first", "First name"]
  ]),
  selectField("title", "Title", [
    ["Mr.", "Mr."],
    ["Ms.", "Ms."],
    ["Mrs.", "Mrs."],
    ["Dr.", "Dr."]
  ], false, "formal-only"),
  field("lastName", "Last name", "Lee", false, true, "formal-only"),
  field("firstName", "First name", "Jordan", false, true, "first-only")
];

const purposes = {
  info: {
    title: "Request an informational interview",
    desc: "Ask someone to share what they know about a career, role, or organization.",
    helper: "Give them enough context to remember you, then make a small, specific request.",
    fields: [
      field("yourName", "Your name", "Taylor Morgan"),
      selectField("contactSource", "How did you find or connect with this person?", [
        ["met", "I met them before"],
        ["referral", "Someone recommended or referred me to them"],
        ["online", "I found them through LinkedIn, a website, or online research"],
        ["know", "I already know them"],
        ["other", "Another way"]
      ]),
      field("sourceDetail", "Add the detail that would help them understand the connection", "we met at the University of Iowa career fair / Professor Nguyen suggested I contact you / I found your profile on LinkedIn", true),
      field("detail", "Optional: what specifically made you want to contact them?", "your work in community outreach / what you shared about your career path", true, false),
      field("topic", "What would you like to learn more about?", "your role and how you entered the field", true),
      field("time", "How much time are you asking for?", "15–20 minutes"),
      field("format", "How could you meet?", "Zoom or phone")
    ],
    subject: d => `Informational interview request – ${d.yourName || "University of Iowa student"}`,
    body: d => {
      const intro = d.connection
        ? `I’m reaching out after ${lowerFirst(stripEnd(d.connection))}.`
        : "I’m reaching out because I would value the chance to learn from your experience.";
      const memory = d.detail ? ` I especially enjoyed ${lowerFirst(stripEnd(d.detail))}.` : "";
      const purpose = d.topic ? ` I’d appreciate the chance to learn more about ${lowerFirst(stripEnd(d.topic))}.` : "";
      return `${greeting(d)}\n\n${intro}${memory}${purpose}\n\nWould you be open to a ${d.time || "15–20 minute"} conversation by ${d.format || "Zoom or phone"}? I’m happy to work around your schedule.\n\nThank you for considering my request. I appreciate your time.\n\nBest,\n${d.yourName || "Your name"}`;
    },
    tip: "An informational interview is a short learning conversation—not a job interview. Keep the request focused on learning about the person’s experience, role, or field."
  },
  shadow: {
    title: "Request a job shadow",
    desc: "Ask to observe someone at work and learn what the role is really like.",
    helper: "Briefly explain your interest, what you hope to learn, and how much time you are asking for.",
    fields: [
      field("yourName", "Your name", "Taylor Morgan"),
      selectField("contactSource", "How did you find or connect with this person?", [
        ["met", "I met them before"],
        ["referral", "Someone recommended or referred me to them"],
        ["online", "I found them through LinkedIn, a website, or online research"],
        ["know", "I already know them"],
        ["other", "Another way"]
      ]),
      field("sourceDetail", "Add the detail that would help them understand the connection", "we met at the education fair / my advisor suggested I contact you / I found your school counseling page online", true),
      field("intro", "How would you briefly introduce yourself?", "I’m a University of Iowa student exploring school counseling", true),
      field("whyThem", "What specifically makes you interested in their work or organization?", "how your team supports middle school students", true),
      field("learn", "What would you hope to learn or observe?", "what a typical day looks like and how counselors work with students", true),
      field("time", "How much time would be useful?", "1–2 hours"),
      field("window", "When are you generally available?", "Friday mornings in October", true)
    ],
    subject: d => `Job shadow request – ${d.yourName || "University of Iowa student"}`,
    body: d => {
      const intro = d.intro ? sentence(d.intro) : "I’m a University of Iowa student exploring this career field.";
      const interest = d.whyThem ? ` ${sentence(d.whyThem)}` : "";
      const learn = d.learn ? ` I’d especially like to learn more about ${lowerFirst(stripEnd(d.learn))}.` : "";
      const availability = d.window ? ` I’m generally available ${stripEnd(d.window)}, but I’m happy to work around your schedule.` : " I’m happy to work around your schedule.";
      return `${greeting(d)}\n\n${intro}${interest}${learn}\n\nWould you be open to having me observe your work for about ${d.time || "1–2 hours"}?${availability}\n\nThank you for considering my request. I appreciate your time.\n\nBest,\n${d.yourName || "Your name"}`;
    },
    tip: "A job shadow request is easier to answer when the reader knows what you hope to learn, roughly how long you are asking for, and that you can be flexible."
  },
  thankyou: {
    title: "Send a thank-you",
    desc: "Follow up after an interview, conversation, event, job shadow, or helpful meeting.",
    helper: "Name what you are thanking them for, then include one specific detail so the message feels genuine.",
    fields: [
      field("yourName", "Your name", "Taylor Morgan"),
      field("context", "What are you thanking them for?", "meeting with me yesterday to discuss the internship", true),
      field("detail", "What stood out to you?", "your explanation of how interns work with the outreach team", true),
      field("next", "Optional: what would you like to reinforce?", "our conversation made me even more interested in the role", true, false)
    ],
    subject: d => `Thank you – ${d.context ? shortSubject(d.context) : "our conversation"}`,
    body: d => {
      const context = d.context ? `Thank you for ${lowerFirst(stripEnd(d.context))}.` : "Thank you for taking the time to meet with me.";
      const detail = d.detail ? ` I especially appreciated ${lowerFirst(stripEnd(d.detail))}.` : "";
      const next = d.next ? `\n\n${sentence(d.next)}` : "";
      return `${greeting(d)}\n\n${context}${detail}${next}\n\nI appreciate your time and the opportunity to learn more.\n\nBest,\n${d.yourName || "Your name"}`;
    },
    tip: "A short, specific thank-you usually feels more genuine than a long recap of the entire conversation."
  },
  followup: {
    title: "Follow up after no response",
    desc: "Send a polite reminder when you already reached out and still need an answer.",
    helper: "Remind them of the original message without repeating the whole thing.",
    fields: [
      field("yourName", "Your name", "Taylor Morgan"),
      field("request", "What was your original request?", "a 15-minute informational interview", true),
      field("when", "When did you first email?", "last Tuesday"),
      field("flex", "Optional: what flexibility can you offer?", "I’m happy to work around your schedule", true, false)
    ],
    subject: d => `Follow-up: ${d.request || "my previous email"}`,
    body: d => {
      const flex = d.flex ? ` ${sentence(d.flex)}` : " I know you may have a busy schedule.";
      return `${greeting(d)}\n\nI wanted to follow up on my email from ${d.when || "last week"} about ${d.request || "my request"}.${flex}\n\nIf you’re available, I’d still appreciate the opportunity to connect. If now isn’t a good time, I completely understand.\n\nThank you for your time.\n\nBest,\n${d.yourName || "Your name"}`;
    },
    tip: "Keep a follow-up short and easy to scan. The reader should be able to see the original ask without rereading a long message."
  },
  networking: {
    title: "Reconnect with a professional contact",
    desc: "Reach back out to someone you met before and continue the relationship.",
    helper: "Start with a quick reminder of how you know each other, then explain why you are reaching out now.",
    fields: [
      field("yourName", "Your name", "Taylor Morgan"),
      field("connection", "How did you connect before?", "we met during the alumni panel last spring", true),
      field("update", "Optional: what has changed since then?", "I’ve recently started exploring nonprofit communications roles", true, false),
      field("ask", "What would you like to ask now?", "whether you would have 15 minutes to share advice about entering the field", true)
    ],
    subject: d => `Reconnecting – ${d.yourName || "University of Iowa student"}`,
    body: d => {
      const connection = d.connection ? `We connected when ${lowerFirst(stripEnd(d.connection).replace(/^we\s+/i, ""))}.` : "We connected previously, and I wanted to reach back out.";
      const update = d.update ? ` Since then, ${lowerFirst(stripEnd(d.update).replace(/^i['’]?ve\s+/i, "I’ve "))}.` : "";
      const ask = d.ask ? ` I’m reaching out to ask ${lowerFirst(stripEnd(d.ask))}.` : " I’d value the chance to reconnect briefly.";
      return `${greeting(d)}\n\n${connection}${update}${ask}\n\nIf you’re open to it, I’m happy to work around your schedule.\n\nThank you for your time.\n\nBest,\n${d.yourName || "Your name"}`;
    },
    tip: "Assume they may not immediately remember you. One clear reminder is usually enough before you move into your reason for reaching out."
  },
  custom: {
    title: "Write another professional email",
    desc: "Use a simple structure for a request, question, update, or introduction.",
    helper: "Give the reader the context they need, then make one clear request or ask one clear question.",
    fields: [
      field("yourName", "Your name", "Taylor Morgan"),
      field("context", "What does the reader need to know first?", "I’m a student in your Tuesday section", true),
      field("goal", "What do you need from them?", "confirm whether I may attend the Thursday session instead", true),
      field("detail", "Optional: what detail would help them respond?", "I have a required appointment during Tuesday’s class", true, false)
    ],
    subject: d => shortSubject(d.goal || "Quick question"),
    body: d => {
      const context = d.context ? sentence(d.context) : "I’m reaching out with a quick question.";
      const detail = d.detail ? ` ${sentence(d.detail)}` : "";
      return `${greeting(d)}\n\n${context}${detail}\n\nWould you be able to ${lowerFirst(stripEnd(d.goal || "let me know what you recommend"))}?\n\nThank you for your time.\n\nBest,\n${d.yourName || "Your name"}`;
    },
    tip: "If your message starts covering multiple unrelated goals, it may be clearer to send separate emails."
  }
};

function outreachIntro(d){
  const detail = stripEnd(d.sourceDetail || "");
  if(d.contactSource === "referral"){
    return detail ? `I’m reaching out because ${lowerFirst(detail)}.` : "I’m reaching out after someone suggested I contact you.";
  }
  if(d.contactSource === "online"){
    return detail ? `I came across your information through ${lowerFirst(removeFoundPrefix(detail))}.` : "I came across your background while researching people working in this field.";
  }
  if(d.contactSource === "know"){
    return detail ? `I’m reaching out following ${lowerFirst(detail)}.` : "I wanted to reach out to you directly.";
  }
  if(d.contactSource === "met"){
    return detail ? `It was great connecting ${connectionPhrase(detail)}.` : "It was great connecting with you previously.";
  }
  return detail ? `${sentence(capitalizeFirst(detail))}` : "I’m reaching out because I’d value the chance to learn from your experience.";
}

function interestSentence(text){
  const t=stripEnd(text);
  if(!t) return "";
  if(/^i/i.test(t) || /^your/i.test(t) || /^what/i.test(t)) return sentence(capitalizeFirst(t));
  return `I was especially interested in ${lowerFirst(t)}.`;
}
function removeFoundPrefix(text){ return text.replace(/^i\s+(found|saw|came across)\s+(you|your profile|your information)\s+(on|through|via)\s+/i, ""); }
function connectionPhrase(text){
  const t=text.replace(/^we\s+(met|connected)\s*/i, "").replace(/^i\s+met\s+you\s*/i, "").trim();
  if(!t) return "with you previously";
  if(/^(at|during|through|via|when|while|last|this)/i.test(t)) return `with you ${t}`;
  return `with you when ${lowerFirst(t)}`;
}
function capitalizeFirst(text){ return text ? text.charAt(0).toUpperCase()+text.slice(1) : ""; }

function field(name, label, placeholder, full=false, required=true, visibilityClass=""){ return {type:"text",name,label,placeholder,full,required,visibilityClass}; }
function selectField(name, label, options, required=true, visibilityClass=""){ return {type:"select",name,label,options,required,visibilityClass}; }
function greeting(d){
  if(d.addressStyle === "first") return `${d.firstName || "First name"},`;
  return `${d.title || "Mr./Ms./Mrs./Dr."} ${d.lastName || "Last name"},`;
}
function stripEnd(text){ return (text || "").trim().replace(/[.!?]+$/g, ""); }
function sentence(text){ const t=stripEnd(text); return t ? `${t}.` : ""; }
function lowerFirst(text){ return text ? text.charAt(0).toLowerCase()+text.slice(1) : ""; }
function shortSubject(text){
  const clean = stripEnd(text).replace(/^(meeting with me|speaking with me|taking the time to|about|for)\s+/i, "").trim();
  return clean.split(/\s+/).slice(0,7).join(" ");
}

const purposeGrid = document.getElementById("purposeGrid");
const detailsSection = document.getElementById("step-details");
const draftSection = document.getElementById("step-draft");
const dynamicFields = document.getElementById("dynamicFields");
const detailsHelper = document.getElementById("detailsHelper");
const subjectOutput = document.getElementById("subjectOutput");
const emailOutput = document.getElementById("emailOutput");
const purposeTip = document.getElementById("purposeTip");
const copyStatus = document.getElementById("copyStatus");
let selectedPurpose = null;

Object.entries(purposes).forEach(([key,p])=>{
  const btn=document.createElement("button");
  btn.type="button";
  btn.className="purpose-card";
  btn.innerHTML=`<strong>${p.title}</strong><span>${p.desc}</span>`;
  btn.addEventListener("click",()=>selectPurpose(key));
  purposeGrid.appendChild(btn);
});

function renderField(f){
  const wrap=document.createElement("div");
  wrap.className=`field ${f.full ? "full" : ""} ${f.visibilityClass || ""}`.trim();
  wrap.dataset.visibilityClass=f.visibilityClass || "";

  const label=document.createElement("label");
  label.htmlFor=f.name;
  label.textContent=f.label + (f.required ? "" : " (optional)");

  let input;
  if(f.type === "select"){
    input=document.createElement("select");
    f.options.forEach(([value,text])=>{
      const option=document.createElement("option");
      option.value=value;
      option.textContent=text;
      input.appendChild(option);
    });
  }else{
    input=document.createElement(f.full ? "textarea" : "input");
    input.placeholder=f.placeholder || "";
    if(f.full) input.rows=3;
  }
  input.id=f.name;
  input.name=f.name;
  wrap.append(label,input);
  dynamicFields.appendChild(wrap);
}

function updateRecipientFields(){
  const style=document.getElementById("addressStyle")?.value || "formal";
  dynamicFields.querySelectorAll(".formal-only").forEach(el=>el.style.display=style === "formal" ? "" : "none");
  dynamicFields.querySelectorAll(".first-only").forEach(el=>el.style.display=style === "first" ? "" : "none");
}

function selectPurpose(key){
  selectedPurpose=key;
  const p=purposes[key];
  detailsHelper.textContent=p.helper;
  dynamicFields.innerHTML="";

  commonRecipientFields.forEach(renderField);
  p.fields.forEach(renderField);

  document.getElementById("addressStyle")?.addEventListener("change", updateRecipientFields);
  updateRecipientFields();

  detailsSection.classList.remove("hidden");
  draftSection.classList.add("hidden");
  detailsSection.scrollIntoView({behavior:"smooth",block:"start"});
}

document.getElementById("backToPurpose").addEventListener("click",()=>{
  document.getElementById("step-purpose").scrollIntoView({behavior:"smooth"});
});

document.getElementById("buildEmail").addEventListener("click",()=>{
  if(!selectedPurpose) return;
  const p=purposes[selectedPurpose];
  const data={};
  [...commonRecipientFields, ...p.fields].forEach(f=>{ data[f.name]=(document.getElementById(f.name)?.value || "").trim(); });
  subjectOutput.value=p.subject(data);
  emailOutput.value=p.body(data).replace(/\n{3,}/g,"\n\n");
  purposeTip.textContent=p.tip;
  draftSection.classList.remove("hidden");
  draftSection.scrollIntoView({behavior:"smooth",block:"start"});
});

async function copyText(text,msg){
  try{
    await navigator.clipboard.writeText(text);
    copyStatus.textContent=msg;
  }catch(e){
    copyStatus.textContent="Copying is blocked in this browser. Select the text and copy it manually.";
  }
}

document.getElementById("copyEmail").addEventListener("click",()=>copyText(`Subject: ${subjectOutput.value}\n\n${emailOutput.value}`,"Email copied."));
document.getElementById("copySubject").addEventListener("click",()=>copyText(subjectOutput.value,"Subject line copied."));
document.getElementById("startOver").addEventListener("click",()=>{
  selectedPurpose=null;
  detailsSection.classList.add("hidden");
  draftSection.classList.add("hidden");
  dynamicFields.innerHTML="";
  subjectOutput.value="";
  emailOutput.value="";
  copyStatus.textContent="";
  window.scrollTo({top:0,behavior:"smooth"});
});
