/**
 * Reflex Entwicklung – Versand Eltern-Leitfaden
 * Dieses Script muss im Google-Konto desiree@reflexentwicklung.at angelegt
 * und als Web-App mit "Ausführen als: Ich" veröffentlicht werden.
 *
 * Es versendet ausschließlich einen festen Eltern-Leitfaden-Link.
 * Testantworten werden NICHT übertragen.
 */

const CONFIG = {
  senderName: 'Reflex Entwicklung – Desireè Garbus',
  senderEmail: 'desiree@reflexentwicklung.at',
  subject: 'Dein Eltern-Leitfaden | Reflex Entwicklung',
  guideUrl: 'https://reflexentwicklung.at/elternleitfaden-reflexentwicklung.pdf',
  thanksUrl: 'https://reflexentwicklung.at/selbsttest-danke.html',
  websiteUrl: 'https://reflexentwicklung.at/',
  maxPerDay: 50,
  cooldownSeconds: 1800,
  minFormTimeMs: 2500
};

function doGet() {
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Reflex Entwicklung</title></head>' +
    '<body style="font-family:Arial,sans-serif;padding:40px;color:#3f4239">' +
    '<h2>Reflex Entwicklung</h2><p>Der Versanddienst ist aktiv.</p>' +
    '<p><a href="' + CONFIG.websiteUrl + '">Zur Website</a></p></body></html>'
  );
}

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};

    // Honeypot: echte Besucher sehen dieses Feld nicht.
    if (String(p.website || '').trim() !== '') {
      return redirect_();
    }

    const email = normalizeEmail_(p.email);
    const firstName = cleanText_(p.firstname, 80);
    const consent = String(p.consent || '');
    const contactOk = String(p.contact_ok || '') === 'yes';
    const startedAt = Number(p.started_at || 0);

    if (!email || consent !== 'yes') {
      return errorPage_('Bitte überprüft die E-Mail-Adresse und die Zustimmung.');
    }

    // Sehr schnelle Bot-Submissions abfangen.
    if (startedAt && (Date.now() - startedAt) < CONFIG.minFormTimeMs) {
      return errorPage_('Die Anfrage konnte nicht verarbeitet werden. Bitte versucht es noch einmal.');
    }

    // Pro E-Mail-Adresse maximal ein Versand innerhalb des Cooldowns.
    const cache = CacheService.getScriptCache();
    const cacheKey = 'guide_' + hash_(email.toLowerCase());
    if (cache.get(cacheKey)) {
      return redirect_();
    }

    // Kleine globale Tagesbremse gegen automatisierten Missbrauch.
    if (!consumeDailyQuota_()) {
      return errorPage_('Der automatische Versand ist heute vorübergehend ausgelastet. Bitte schreibt direkt an desiree@reflexentwicklung.at.');
    }

    const greeting = firstName ? 'Hallo ' + htmlEscape_(firstName) + ',' : 'Hallo,';
    const plainBody =
      (firstName ? 'Hallo ' + firstName + ',' : 'Hallo,') + '\n\n' +
      'schön, dass ihr meinen Orientierungscheck genutzt habt.\n\n' +
      'Wie versprochen findet ihr hier meinen kurzen Eltern-Leitfaden mit 5 Beobachtungsimpulsen für euren Alltag:\n' +
      CONFIG.guideUrl + '\n\n' +
      'Eure Antworten aus dem Orientierungscheck wurden ausschließlich in eurem Browser ausgewertet und nicht an mich übertragen.\n\n' +
      'Schaut euch den Leitfaden ganz in Ruhe an. Wenn ihr danach eure Beobachtungen gerne gemeinsam mit mir besprechen möchtet, ist das Erstgespräch kostenlos und unverbindlich.\n\n' +
      'Liebe Grüße\nDesireè Garbus\nReflex Entwicklung\n' +
      CONFIG.senderEmail + '\n' + CONFIG.websiteUrl;

    const htmlBody =
      '<div style="font-family:Arial,sans-serif;line-height:1.65;color:#3f4239;max-width:620px;margin:auto">' +
      '<p>' + greeting + '</p>' +
      '<p>schön, dass ihr meinen Orientierungscheck genutzt habt.</p>' +
      '<p>Wie versprochen findet ihr hier meinen kurzen <strong>Eltern-Leitfaden mit 5 Beobachtungsimpulsen für euren Alltag</strong>.</p>' +
      '<p style="margin:28px 0"><a href="' + CONFIG.guideUrl + '" style="display:inline-block;background:#74805d;color:#fff;text-decoration:none;padding:13px 22px;border-radius:999px;font-weight:bold">Eltern-Leitfaden öffnen</a></p>' +
      '<p style="font-size:14px;color:#6f7169">Eure Antworten aus dem Orientierungscheck wurden ausschließlich in eurem Browser ausgewertet und nicht an mich übertragen.</p>' +
      '<p>Schaut euch den Leitfaden ganz in Ruhe an. Wenn ihr danach das Gefühl habt, eure Beobachtungen gerne gemeinsam mit mir besprechen zu wollen, ist das Erstgespräch kostenlos und unverbindlich.</p>' +
      '<p>Liebe Grüße<br><strong>Desireè Garbus</strong><br>Reflex Entwicklung<br>' +
      '<a href="mailto:' + CONFIG.senderEmail + '">' + CONFIG.senderEmail + '</a><br>' +
      '<a href="' + CONFIG.websiteUrl + '">reflexentwicklung.at</a></p>' +
      '</div>';

    GmailApp.sendEmail(email, CONFIG.subject, plainBody, {
      htmlBody: htmlBody,
      name: CONFIG.senderName,
      replyTo: CONFIG.senderEmail
    });

    // Nur wenn ausdrücklich gewünscht: kurze interne Info an Desireè.
    if (contactOk) {
      const internalSubject = 'Persönliche Kontaktaufnahme gewünscht | Selbsttest';
      const internalBody =
        'Eine Person hat nach dem Selbsttest ausdrücklich eine persönliche Kontaktaufnahme erlaubt.\n\n' +
        'Vorname: ' + (firstName || 'nicht angegeben') + '\n' +
        'E-Mail: ' + email + '\n\n' +
        'Es wurden keine Antworten und kein Testergebnis übertragen.';
      GmailApp.sendEmail(CONFIG.senderEmail, internalSubject, internalBody, {
        name: 'Reflex Entwicklung – Website',
        replyTo: email
      });
    }

    cache.put(cacheKey, '1', CONFIG.cooldownSeconds);
    return redirect_();

  } catch (err) {
    console.error(err);
    return errorPage_('Beim Versand ist leider ein technischer Fehler aufgetreten. Bitte schreibt direkt an desiree@reflexentwicklung.at.');
  }
}

function consumeDailyQuota_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const props = PropertiesService.getScriptProperties();
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const key = 'daily_' + today;
    const current = Number(props.getProperty(key) || '0');
    if (current >= CONFIG.maxPerDay) return false;
    props.setProperty(key, String(current + 1));

    // Alte Zähler gelegentlich aufräumen.
    const all = props.getProperties();
    Object.keys(all).forEach(k => {
      if (k.indexOf('daily_') === 0 && k !== key) props.deleteProperty(k);
    });
    return true;
  } finally {
    lock.releaseLock();
  }
}

function normalizeEmail_(value) {
  const email = String(value || '').trim();
  if (email.length > 254) return '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function cleanText_(value, maxLen) {
  return String(value || '').replace(/[\r\n<>]/g, ' ').trim().slice(0, maxLen || 100);
}

function hash_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
  return bytes.map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join('');
}

function htmlEscape_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function redirect_() {
  const u = CONFIG.thanksUrl;
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="de"><head><meta charset="utf-8">' +
    '<meta http-equiv="refresh" content="0;url=' + u + '">' +
    '<title>Reflex Entwicklung</title></head><body>' +
    '<p>Der Leitfaden wurde versendet. <a href="' + u + '">Weiter</a></p>' +
    '<script>location.replace(' + JSON.stringify(u) + ');</script>' +
    '</body></html>'
  );
}

function errorPage_(message) {
  const safe = htmlEscape_(message);
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Reflex Entwicklung</title></head><body style="margin:0;background:#f8f5ee;color:#3f4239;font-family:Arial,sans-serif;display:grid;place-items:center;min-height:100vh;padding:24px">' +
    '<main style="max-width:620px;background:#fffdf8;border:1px solid #ded8ca;border-radius:28px;padding:36px">' +
    '<h2 style="font-family:Georgia,serif;color:#4d5841;font-weight:400">Das hat leider nicht geklappt.</h2>' +
    '<p>' + safe + '</p>' +
    '<p><a href="https://reflexentwicklung.at/selbsttest.html" style="color:#4d5841">Zurück zum Orientierungscheck</a></p>' +
    '</main></body></html>'
  );
}
