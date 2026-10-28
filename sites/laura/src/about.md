---
layout: layouts/page.njk
permalink: /about/
title: About
abstract: "Placeholder intro sentence about Laura."
---

<img class="portrait" src="{{ profile.headshot }}" alt="{{ profile.headshotAlt }}" width="320" height="320">

Placeholder biography. Replace with the final About text.

## Current roles

<ul class="chips">
{%- for role in roles %}
  <li class="chip">{{ role.label }}{% if role.org %}, {{ role.org }}{% endif %}</li>
{%- endfor %}
</ul>

[Connect on LinkedIn]({{ profile.linkedin }})
