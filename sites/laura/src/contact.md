---
layout: layouts/page.njk
permalink: /contact/
title: Contact
abstract: "For collaborations, speaking invitations and press enquiries."
---

<form class="form" name="contact-laura" method="POST" action="/contact/thanks/" data-netlify="true" netlify-honeypot="company">
  <input type="hidden" name="form-name" value="contact-laura">
  <p class="hidden"><label>Leave this empty <input name="company"></label></p>
  <label>Name <input name="name" autocomplete="name" required></label>
  <label>Email <input type="email" name="email" autocomplete="email" required></label>
  <label>Message <textarea name="message" required></textarea></label>
  <p><button class="button" type="submit">Send message</button></p>
</form>

You can also reach Laura on [LinkedIn]({{ profile.linkedin }}).
