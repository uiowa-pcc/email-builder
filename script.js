const purposes = {
  info: {
    title: "Request an informational interview",
    desc: "Ask someone to share what they know about a career, role, or organization.",
    helper: "Make it easy for them to remember you and easy to say yes.",
    fields: [
      field("recipient", "Recipient name", "Jordan Lee"),
      field("yourName", "Your name", "Taylor Morgan"),
      field("connection", "How do you know them?", "We met at the University of Iowa career fair", true),
      field("detail", "One detail you remember or appreciated", "I enjoyed hearing about your path into community outreach", true),
      field("topic", "What do you want to learn about?", "your role and your experience in the field", true),
      field("time", "How much time are you asking for?", "15–20 minutes"),
      field("format", "Preferred format", "Zoom or phone")
    ],
    subject: d => `Informational interview request – ${d.yourName || "University of Iowa student"}`,
    body: d => `${greeting(d.recipient)}\n\n${connectionLine(d)} ${optionalSentence(d.detail)}\n\nWould you be willing to talk with me for ${d.time || "15–20 minutes"} by ${d.format || "Zoom or phone"} about ${d.topic || "your experience in the field"}? I am happy to work around your schedule.\n\nThank you for considering it.\n\nBest,\n${d.yourName || "Your name"}`,
    tip: "Informational interviews are for learning and networking—not asking the person to interview you for a job."
  },
  shadow: {
    title: "Request a job shadow",
    desc: "Ask to observe someone at work and learn what the role is really like.",
    helper: "Be clear about what you hope to observe and keep the request flexible.",
    fields: [
      field("recipient", "Recipient name", "Jordan Lee"),
      field("yourName", "Your name", "Taylor Morgan"),
      field("intro", "Who are you?", "I am a University of Iowa student exploring school counseling", true),
      field("whyThem", "Why are you contacting this person or organization?", "I am interested in how your team supports middle school students", true),
      field("time", "How much time would be useful?", "1–2 hours"),
      field("window", "When are you generally available?", "Friday mornings in October", true)
    ],
    subject: d => `Job shadow request – ${d.yourName || "University of Iowa student"}`,
    body: d => `${greeting(d.recipient)}\n\n${d.intro || "I am a University of Iowa student exploring this career field."} ${optionalSentence(d.whyThem)}\n\nWould you be open to having me observe your work for about ${d.time || "1–2 hours"}? I am generally available ${d.window || "and can work around your schedule"}, but I can be flexible.\n\nThank you for considering my request.\n\nBest,\n${d.yourName || "Your name"}`,
    tip: "A job shadow request works best when the reader can quickly tell what you hope to learn, how long you need, and that you can be flexible."
  },
  thankyou: {
    title: "Send a thank-you",
    desc: "Follow up after an interview, conversation, event, job shadow, or helpful meeting.",
    helper: "A strong thank-you is short, specific, and connected to the conversation.",
    fields: [
      field("recipient", "Recipient name", "Jordan Lee"),
      field("yourName", "Your name", "Taylor Morgan"),
      field("context", "What are you thanking them for?", "meeting with me yesterday to discuss the internship", true),
      field("detail", "What stood out to you?", "I especially appreciated your explanation of how interns work with the outreach team", true),
      field("next", "Optional: anything you want to reinforce?", "The conversation made me even more interested in the role", true, false)
    ],
    subject: d => `Thank you – ${d.context ? shortSubject(d.context) : "our conversation"}`,
    body: d => `${greeting(d.recipient)}\n\nThank you for ${d.context || "taking the time to meet with me"}. ${optionalSentence(d.detail)}\n\n${d.next ? `${sentence(d.next)}\n\n` : ""}I appreciate your time and the opportunity to learn more.\n\nBest,\n${d.yourName || "Your name"}`,
    tip: "Send thank-you messages promptly while the conversation is still fresh."
  },
  followup: {
    title: "Follow up after no response",
    desc: "Send a polite reminder when you already reached out and still need an answer.",
    helper: "Keep the reminder short. Do not rewrite the entire first email.",
    fields: [
      field("recipient", "Recipient name", "Jordan Lee"),
      field("yourName", "Your name", "Taylor Morgan"),
      field("request", "What was your original request?", "a 15-minute informational interview", true),
      field("when", "When did you first email?", "last Tuesday"),
      field("flex", "Optional flexibility to mention", "I am happy to work around your schedule", true, false)
    ],
    subject: d => `Follow-up: ${d.request || "my previous email"}`,
    body: d => `${greeting(d.recipient)}\n\nI wanted to follow up on my email from ${d.when || "last week"} about ${d.request || "my request"}. ${d.flex ? sentence(d.flex) : "I know you may have a busy schedule."}\n\nIf you are available, I would still appreciate the opportunity to connect.\n\nThank you for your time.\n\nBest,\n${d.yourName || "Your name"}`,
    tip: "A follow-up should make the original ask visible again without making the reader dig through a long message."
  },
  networking: {
    title: "Reconnect with a professional contact",
    desc: "Reach back out to someone you met before and continue the relationship.",
    helper: "Remind them who you are before asking for anything.",
    fields: [
      field("recipient", "Recipient name", "Jordan Lee"),
      field("yourName", "Your name", "Taylor Morgan"),
      field("connection", "Where or how did you connect?", "We met during the alumni panel last spring", true),
      field("update", "Optional: one brief update since then", "I recently started exploring nonprofit communications roles", true, false),
      field("ask", "What would you like to ask now?", "whether you would have 15 minutes to share advice about entering the field", true)
    ],
    subject: d => `Reconnecting – ${d.yourName || "University of Iowa student"}`,
    body: d => `${greeting(d.recipient)}\n\n${d.connection ? `${sentence(d.connection)} ` : ""}${d.update ? sentence(d.update) : ""}\n\nI am reaching out to ask ${d.ask || "if you would be open to a brief conversation"}.\n\nThank you for your time, and I hope we can reconnect.\n\nBest,\n${d.yourName || "Your name"}`,
    tip: "Assume the person may not immediately remember you. A one-sentence reminder is usually enough."
  },
  custom: {
    title: "Write another professional email",
    desc: "Use a simple structure for a request, question, update, or introduction.",
    helper: "Focus on one main goal for the message.",
    fields: [
      field("recipient", "Recipient name", "Jordan Lee"),
      field("yourName", "Your name", "Taylor Morgan"),
      field("context", "What does the reader need to know first?", "I am a student in your Tuesday section", true),
      field("goal", "What do you need from them?", "confirm whether I may attend the Thursday session instead", true),
      field("detail", "Any detail that helps them answer?", "I have a required appointment during Tuesday's class", true, false)
    ],
    subject: d => shortSubject(d.goal || "Quick question"),
    body: d => `${greeting(d.recipient)}\n\n${d.context ? sentence(d.context) : "I am reaching out with a quick question."}\n\n${d.detail ? `${sentence(d.detail)} ` : ""}Could you please ${lowerFirst(d.goal || "let me know what you recommend")}?\n\nThank you for your time.\n\nBest,\n${d.yourName || "Your name"}`,
    tip: "If the email starts covering two or three unrelated goals, consider splitting it into separate messages."
  }
};

function field(name, label, placeholder, full=false, required=true){ return {name,label,placeholder,full,required}; }
function greeting(name){ return `${name ? name : "Hello"},`; }
function sentence(text){ if(!text) return ""; const t=text.trim(); return /[.!?]$/.test(t) ? t : `${t}.`; }
function optionalSentence(text){ return text ? sentence(text) : ""; }
function lowerFirst(text){ return text ? text.charAt(0).toLowerCase()+text.slice(1) : ""; }
function shortSubject(text){
  const clean = text.replace(/^(meeting with me|speaking with me|taking the time to|about|for)\s+/i, "").trim();
  return clean.split(/\s+/).slice(0,7).join(" ");
}
function connectionLine(d){
  return d.connection ? `${sentence(d.connection)}` : "I am reaching out because I would value the chance to learn from your experience.";
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

function selectPurpose(key){
  selectedPurpose=key;
  const p=purposes[key];
  detailsHelper.textContent=p.helper;
  dynamicFields.innerHTML="";
  p.fields.forEach(f=>{
    const wrap=document.createElement("div");
    wrap.className=`field ${f.full ? "full" : ""}`;
    const label=document.createElement("label");
    label.htmlFor=f.name;
    label.textContent=f.label + (f.required ? "" : " (optional)");
    const input=document.createElement(f.full ? "textarea" : "input");
    input.id=f.name;
    input.name=f.name;
    input.placeholder=f.placeholder;
    if(f.full) input.rows=3;
    wrap.append(label,input);
    dynamicFields.appendChild(wrap);
  });
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
  p.fields.forEach(f=>{ data[f.name]=(document.getElementById(f.name)?.value || "").trim(); });
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
