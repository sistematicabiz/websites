---
layout: layouts/page.njk
permalink: /speaking-press/
title: Selected press, conversations & speaking
nav_label: Speaking & Press
kicker: Speaking & Press
tags: section
order: 5
tile:
  label: Talks · Interviews · Workshops
  title: Public Work
  text: Talks, interviews, workshops, and collaborations for audiences working across finance, policy, academia, and civil society.
  go: Speaking and contact
---
<section class="band"><div class="wrap spread">
<div class="prose">

A selection of published commentary, interviews, and speaking engagements exploring sustainable investing, climate resilience, faith-consistent finance, and the moral and institutional foundations of economic life.

</div>
<figure class="frame"><canvas data-tessera data-seed="61" data-size="24" aria-hidden="true"></canvas><img src="/img/vatican.jpg" alt="Laura speaking at the Pontifical Academy of Social Sciences" width="1100" height="733"><figcaption class="cap">Pontifical Academy of Social Sciences, May 2026</figcaption></figure>
</div></section>

<section class="band ivory2"><div class="wrap">
<div class="press">
{%- for p in press %}
  <article class="pr">
    <span class="src">{{ p.source }} · {{ p.kind }}</span>
    <h3 class="t">{{ p.title }}</h3>
    <p>{{ p.text }}</p>
    {%- if p.url %}
    <a class="more" href="{{ p.url }}" target="_blank" rel="noopener">{{ p.linkText }} ↗</a>
    {%- else %}
    <span class="more">{{ p.linkText }} <span class="todo">({{ p.todo }})</span></span>
    {%- endif %}
  </article>
{%- endfor %}
</div>
</div></section>
