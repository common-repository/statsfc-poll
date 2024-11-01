/* global alert, escape, unescape, statsfc_lang */

var $j = jQuery;

function statsfc_setCookie (name, value) {
  var date = new Date();

  date.setTime(date.getTime() + (28 * 24 * 60 * 60 * 1000));

  var expires = '; expires=' + date.toGMTString();

  document.cookie = escape(name) + '=' + escape(value) + expires + '; path=/';
}

function statsfc_getCookie (name) {
  var nameEQ = escape(name) + '=';
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) === 0) {
      return unescape(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
}

function StatsFC_Poll (key) {
  this.referer = '';
  this.key = key;
  this.question_id = '';
  this.questionId = '';
  this.omitErrors = false;
  this.useDefaultCss = false;
  this.lang = 'en';

  this.translate = function (key) {
    if (
      typeof statsfc_lang === 'undefined' ||
      typeof statsfc_lang[key] === 'undefined' ||
      statsfc_lang[key].length === 0
    ) {
      return key;
    }

    return statsfc_lang[key];
  };

  this.display = function (placeholder) {
    this.loadLang('statsfc-lang', this.lang);

    var $placeholder;

    switch (typeof placeholder) {
      case 'string':
        $placeholder = $j('#' + placeholder);
        break;
      case 'object':
        $placeholder = placeholder;
        break;
      default:
        return;
    }

    if ($placeholder.length === 0) {
      return;
    }

    if (this.useDefaultCss === true || this.useDefaultCss === 'true') {
      this.loadCss('statsfc-poll-css');
    }

    if (typeof this.referer !== 'string' || this.referer.length === 0) {
      this.referer = window.location.hostname;
    }

    var $container = $j('<div>').addClass('statsfc_poll').attr('data-api-key', this.key);

    // Store globals variables here so we can use it later.
    var key = this.key;
    var object = this;
    var omitErrors = (this.omitErrors === true || this.omitErrors === 'true');
    var translate = this.translate;

    $j.getJSON(
      'https://widgets.statsfc.com/api/poll.json?callback=?',
      {
        key: this.key,
        domain: this.referer,
        question_id: (this.questionId > 0 ? this.questionId : this.question_id),
      },
      function (data) {
        if (data.error) {
          if (omitErrors) {
            return;
          }

          var $error = $j('<p>').css('text-align', 'center');

          if (data.customer && data.customer.attribution) {
            $error.append(
              $j('<a>').attr({
                href: 'https://statsfc.com',
                title: 'Football widgets and API',
                target: '_blank',
              }).text('Stats FC'),
              ' – ',
            );
          }

          $error.append(translate(data.error));

          $container.append($error);

          return;
        }

        $container.attr('data-question-id', data.question.id);

        var cookie_id = 'statsfc_poll_' + key + '_' + data.question.id;
        var cookie = statsfc_getCookie(cookie_id);

        if (cookie !== null) {
          cookie = JSON.parse(cookie);
        }

        var $table = $j('<table>');
        var $thead = $j('<thead>');
        var $tbody = $j('<tbody>');

        $thead.append(
          $j('<tr>').append(
            $j('<th>').attr('colspan', 3).text(data.question.title),
          ),
        );

        $j.each(data.answers, function (key, answer) {
          var $row = $j('<tr>').attr('data-answer-id', answer.id);

          var $answer = $j('<td>').addClass('statsfc_answer').append(
            $j('<label>').attr('for', 'statsfc_poll_answer_' + answer.id).append(
              $j('<span>').addClass('statsfc_radio'),
              $j('<span>').addClass('statsfc_description').text(answer.description),
            ),
          );

          var $votes = $j('<td>').addClass('statsfc_votes');
          var $bar = $j('<td>').addClass('statsfc_bar');

          if (cookie === null) {
            $answer.find('.statsfc_radio').append(
              $j('<input>').attr({
                type: 'radio',
                name: 'statsfc_poll_' + data.question.id,
                id: 'statsfc_poll_answer_' + answer.id,
              }).val(answer.id),
            );
          } else {
            if (answer.votes === data.question.mostVotes) {
              $answer.find('span.statsfc_description').addClass('statsfc_winner');
            }

            $votes.text(answer.percent + '%');

            var width = 0;

            if (data.question.mostVotes > 0) {
              width = (100 / data.question.mostVotes * answer.votes);
            }

            $bar.append(
              $j('<span>').addClass('statsfc_votesBar').css('width', width + '%'),
            );

            if (cookie === answer.id) {
              $row.addClass('statsfc_highlight');
            }
          }

          $row.append($answer, $votes, $bar);

          $tbody.append($row);
        });

        $table.append($thead, $tbody);

        var $submit = '';

        if (cookie === null) {
          $submit = $j('<p>').addClass('statsfc_submit').append(
            $j('<input>').attr('type', 'submit').val(translate('Vote')).on('click', function (e) {
              e.preventDefault();
              object.vote($j(this));
            }),
          );
        }

        $container.append($table, $submit);

        if (data.customer.attribution) {
          $container.append(
            $j('<div>').attr('class', 'statsfc_footer').append(
              $j('<p>').append(
                $j('<small>').append('Powered by ').append(
                  $j('<a>').attr({
                    href: 'https://statsfc.com',
                    title: 'StatsFC – Football widgets',
                    target: '_blank',
                  }).text('StatsFC.com'),
                ),
              ),
            ),
          );
        }
      },
    );

    $placeholder.append($container);
  };

  this.loadCss = function (id) {
    if (document.getElementById(id)) {
      return;
    }

    var css, fcss = (document.getElementsByTagName('link')[0] || document.getElementsByTagName('script')[0]);

    css = document.createElement('link');
    css.id = id;
    css.rel = 'stylesheet';
    css.href = 'https://cdn.statsfc.com/css/poll.css';

    fcss.parentNode.insertBefore(css, fcss);
  };

  this.loadLang = function (id, l) {
    if (document.getElementById(id)) {
      return;
    }

    var lang, flang = document.getElementsByTagName('script')[0];

    lang = document.createElement('script');
    lang.id = id;
    lang.src = 'https://cdn.statsfc.com/js/lang/' + l + '.js';

    flang.parentNode.insertBefore(lang, flang);
  };

  this.vote = function (e) {
    var $parent = e.parents('.statsfc_poll');
    var answer_id = $parent.find(':radio:checked').val();
    var translate = this.translate;

    if (answer_id === null) {
      alert(translate('ERR_22'));
      return;
    }

    // Check that cookie doesn't exist for the current match.
    var cookie_id = 'statsfc_poll_' + this.key + '_' + $parent.attr('data-question-id');
    var cookie = statsfc_getCookie(cookie_id);

    if (cookie !== null) {
      alert(translate('ERR_23'));
      return;
    }

    // Submit the ratings to StatsFC.
    $j.getJSON(
      'https://widgets.statsfc.com/api/poll.json?callback=?',
      {
        key: this.key,
        domain: window.location.hostname,
        question_id: $parent.attr('data-question-id'),
        answer_id: answer_id,
      },
      function (data) {
        if (data.error) {
          alert(translate(data.error));
          return;
        }

        // Save cookie.
        statsfc_setCookie(cookie_id, answer_id);

        // Update average ratings.
        $j.each(data.answers, function (key, answer) {
          var $row = $parent.find('tr[data-answer-id="' + answer.id + '"]');

          if (answer_id === answer.id) {
            $row.addClass('statsfc_highlight');
          }

          if (answer.votes === data.question.mostVotes) {
            $row.find('span.statsfc_description').addClass('statsfc_winner');
          }

          $row.find('.statsfc_radio').remove();

          $row.find('.statsfc_votes').text(answer.percent + '%');

          var width = (100 / data.question.mostVotes * answer.votes);

          $row.find('.statsfc_bar').append(
            $j('<span>').addClass('statsfc_votesBar').css('width', width + '%'),
          );
        });

        $parent.find('.statsfc_submit').remove();
      },
    );
  };
}

/**
 * Load widgets dynamically using data-* attributes
 */
$j('div.statsfc-poll').each(function () {
  var key = $j(this).attr('data-key'),
    poll = new StatsFC_Poll(key),
    data = $j(this).data();

  for (var i in data) {
    poll[i] = data[i];
  }

  poll.display($j(this));
});
