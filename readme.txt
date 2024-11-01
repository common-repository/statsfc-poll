=== StatsFC Poll ===
Contributors: willjw
Donate link:
Tags: widget, poll, survey
Requires at least: 3.3
Tested up to: 6.2.2
Stable tag: 2.0.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This widget will place a custom poll on your website.

== Description ==

Add a poll to your WordPress website. To request a key sign up for your free trial at [statsfc.com](https://statsfc.com).

For a demo, check out [wp.statsfc.com/poll](https://wp.statsfc.com/poll/).

= Translations =
* Bahasa Indonesia
* Dansk
* Deutsch
* Eesti
* Español
* Français
* Hrvatski Jezik
* Italiano
* Magyar
* Norsk bokmål
* Slovenčina
* Slovenski Jezik
* Suomi
* Svenska
* Türkçe

If you're interested in translating for us, please get in touch at [hello@statsfc.com](mailto:hello@statsfc.com) or on Twitter [@StatsFC](https://twitter.com/StatsFC).

== Installation ==

1. Upload the `statsfc-poll` folder and all files to the `/wp-content/plugins/` directory
2. Activate the widget through the 'Plugins' menu in WordPress
3. Drag the widget to the relevant sidebar on the 'Widgets' page in WordPress
4. Set the StatsFC key and any other options. If you don't have a key, sign up for free at [statsfc.com](https://statsfc.com)

You can also use the `[statsfc-poll]` shortcode, with the following options:

* `key` (required): Your StatsFC key
* `question_id` (required): Your question ID, once you've setup the poll in you StatsFC account
* `omit_errors` (optional): Omit error messages, `true` or `false`

== Frequently asked questions ==



== Screenshots ==



== Changelog ==

= 2.0.0 =
* Refactor: Update plugin for new API

= 1.7.5 =
* Hotfix: Minor JS bug

= 1.7.4 =
* Hotfix: Possible issue loading language/CSS files

= 1.7.3 =
* Hotfix: Check options exist before using them

= 1.7.2 =
* Hotfix: Check the before/after widget/title bits exist before using them

= 1.7.1 =
* Hotfix: Load relevant language file based on the default language for the site

= 1.7.0 =
* Feature: Updated total vote numbers to (more meaningful) percentages

= 1.6.0 =
* Feature: Added multi-language support. If you're interested in translating for us, please get in touch at [hello@statsfc.com](mailto:hello@statsfc.com)

= 1.5.2 =
* Hotfix: Added a responsive horizontal scroll if the widget is too wide for mobile

= 1.5.1 =
* Hotfix: Fixed possible `Undefined index: omit_errors` error

= 1.5.0 =
* Feature: Put CSS/JS files back into the local repo
* Feature: Enqueue style/script directly instead of registering first

= 1.4.0 =
* Feature: Added `omit_errors` parameter
* Feature: Load CSS/JS remotely

= 1.3.1 =
* Hotfix: Fixed "Invalid domain" bug caused by referal domain

= 1.3.0 =
* Feature: Converted to JS widget

= 1.2.0 =
* Feature: Allow more discrete ads for ad-supported accounts

= 1.1.0 =
* Feature: Indicate the poll leader

== Upgrade notice ==

