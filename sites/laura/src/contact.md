---
layout: layouts/page.njk
permalink: /contact/
title: Get in touch
kicker: Contact
---
<section class="band indigo"><div class="wrap">
<div class="head"><h2>Talks, interviews and collaborations</h2></div>
<form class="contact" name="contact-laura" method="POST" action="/contact/thanks/" data-netlify="true" netlify-honeypot="company">
  <input type="hidden" name="form-name" value="contact-laura">
  <p class="hp"><label>Leave this empty <input name="company" tabindex="-1" autocomplete="off"></label></p>
  <div class="f"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required></div>
  <div class="f"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
  <div class="f full"><label for="f-msg">Message</label><textarea id="f-msg" name="message" required></textarea></div>
  <div><button class="btn" type="submit">Send</button></div>
</form>
</div></section>
