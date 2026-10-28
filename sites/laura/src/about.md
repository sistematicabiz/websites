---
layout: layouts/page.njk
permalink: /about/
title: About
kicker: New York City Metropolitan Area
---
<section class="band"><div class="wrap spread top">
<div class="prose">

I am a researcher, advisor, educator, and writer whose work explores the moral and institutional foundations of economic life. I work across finance, climate and ecological transition, theology and ethics, and the history of political and economic thought.

I am especially interested in the ways institutions shape what we consider possible: the forms of value we measure, the risks we recognize, the futures we finance, and the responsibilities we owe one another and the living world.

These questions inform my work across research, advisory, teaching, and public conversation. Through [Sistem(at)ica Research & Advisory]({{ profile.sites.sistematica }}), I collaborate with organizations working on sustainable and values-aligned finance, investment strategy and systems-level questions. Through [Moral Revolution](/writing-podcast/), I write and host conversations about economics, ethics, theology, and social transformation. I am also a partner in Universe Partners, a climate-resilience venture fund; a board member of Arketa, a degrowth think tank; and an adjunct professor at Columbia University’s School of International and Public Affairs.

Across these roles, I seek to connect rigorous, data driven analysis with a wider moral imagination, taking complexity seriously while keeping in view the question of what economic life is for.

<div class="actions"><a class="btn line" href="{{ profile.linkedin }}" target="_blank" rel="noopener">LinkedIn ↗</a></div>
</div>
<figure class="frame">
  <canvas data-tessera data-seed="21" data-size="28" aria-hidden="true"></canvas>
  <img src="{{ profile.headshot.src }}" alt="{{ profile.headshot.alt }}" width="{{ profile.headshot.width }}" height="{{ profile.headshot.height }}">
  <figcaption class="cap">{{ profile.location }}</figcaption>
</figure>
</div></section>

<section class="band ivory2"><div class="wrap spread top">
<div class="prose">
<span class="kicker terra">Current roles</span>
<ul class="roles">
{%- for r in roles %}
  <li>{{ r.role }}, <a href="{{ r.url }}"{% if not r.url.startsWith(profile.sites.sistematica) %} target="_blank" rel="noopener"{% endif %}>{{ r.org }}</a>{% for x in r.extra %}<span class="sub">· <a href="{{ x.url }}" target="_blank" rel="noopener">{{ x.label }} ↗</a></span>{% endfor %}</li>
{%- endfor %}
</ul>
</div>
<div class="prose">
<span class="kicker terra">Selected press, lectures and appearances</span>

Financial Times, MSCI, S&P Dow Jones Indices, Environmental Finance, Americas Society/Council of the Americas, National Association of Business Economists, SRI360, Columbia University, Cornell University, Duke University.

<p><a href="/speaking-press/">Speaking &amp; Press →</a></p>
</div>
</div></section>

<section class="band"><div class="wrap">
{% set seed = 41 %}{% set note = "additional picture from the plan" %}{% include "partials/art.njk" %}
</div></section>
