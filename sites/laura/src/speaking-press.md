---
layout: layouts/page.njk
permalink: /speaking-press/
title: "Speaking & Press"
eyebrow: "Speaking & Press"
tags: section
order: 5
tile: terracotta
nav_label: "Speaking & Press"
abstract: "Placeholder abstract for Speaking & Press: one or two sentences shown on the home page and as the page intro."
---

Placeholder body copy for **Speaking & Press**. Replace this Markdown with the final text.

## A subheading

Paragraphs, lists and links all work here:

- First point
- Second point
- Third point

## Talks and press

<ul class="entry-list">
{%- for entry in press %}
  <li>
    <span class="meta">{{ entry.date }} · {{ entry.type }}</span>
    <span>{% if entry.url %}<a href="{{ entry.url }}">{{ entry.title }}</a>{% else %}{{ entry.title }}{% endif %}, <em>{{ entry.outlet }}</em></span>
  </li>
{%- endfor %}
</ul>
