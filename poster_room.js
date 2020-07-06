/**
 * Online Poster Room JS.
 * v1.3.0
 * Author: Valentin Guignon
 * Date: 06/07/2020
 * Copyright (C) The Alliance Bioversity - CIAT
 * GitHub: https://github.com/guignonv/online_poster_room
 *
 * Requires jQuery >= 1.7
 *
 * Usage:
 *   Include CSS and JS.
 *
 *   In HTML body:
 *    <div id="online_poster_room_browser">&nbsp;</div>
 *    <script type="text/javascript">// <![CDATA[
 *      var opr = {poster_show: true, lang: 'en'};
 *      $.getJSON("poster_room.json", function(json_data) {
 *        opr = json_data;
 *      });
 *      $(function () {
 *        init_online_poster_room();
 *      });
 *    // ]]></script>
 *
 *   nb.: other values can be customized. See poster_room.json and code for
 *   details.
 */

// Declare global opr variable if not declared.
if (typeof opr == 'undefined') {
  opr = {};
}

/**
 * Tells if a variable is set.
 */
function jisset(obj) {
  if ((typeof obj === 'object') && (obj !== null)) {
    return (0 < Object.keys(obj).length);
  }
  else if (Array.isArray(obj)) {
    return (0 < obj.length);
  }
  else {
    return ((null !== obj) && ('' !== obj));
  }
}

/**
 * Renders hash data.
 *
 * @param hash (hash)
 *   A hash which keys are treated as data values (for unicity).
 * @param container_class (string)
 *   CSS class name of the container element.
 * @param element_class (string)
 *   CSS class name used for each element.
 * @param label (string)
 *   Label for the list of elements.
 */
function opr_render_hash(hash, container_class, element_class = null, label = null) {
  var values_array = [];
  for (var key in hash) {
    if (jisset(key)) {
      values_array.push(
        '<span'
        + (jisset(element_class) ? 'class="' + element_class + '"' : '')
        + '>'
        + key
        + '</span>'
      );
    }
  }
  return '<span class="' + container_class + '">'
    + (jisset(label) ? '<span class="opr-label">' + label + '</span>: ' : '')
    + values_array.join(', ')
    + '</span>';
}

/**
 * Renders poster field.
 *
 * @param: value (string)
 *   Field value to render.
 * @param: element_class (string)
 *   CSS class name used for the element.
 * @param: label (string)
 *   Label field to render. Can be NULL or empty for no label.
 * @param container_class (string)
 *   CSS class name of the container element if a label is set.
 */
function opr_render_field(value, element_class, label = null, container_class = null) {
  if (!jisset(value)) {
    return '';
  }
  var field_html =
    '<span class="' + element_class + '">'
    + value
    + '</span>';
    if (jisset(label)) {
      field_html =
        '<span class="' + container_class + '">\n'
        + '<span class="opr-label">' + label + '</span>\n'
        + field_html
        + '\n</span>';
    }
  return field_html;
}

/**
 * Renders poster number.
 *
 * @param: number (string)
 *   Poster number.
 */
function opr_render_number(number) {
  return opr_render_field('#' + number, 'opr-poster-number');
}

/**
 * Renders poster title.
 *
 * @param: title (string)
 *   Poster title.
 */
function opr_render_title(title) {
  return opr_render_field(title, 'opr-poster-title');
}

/**
 * Renders a list of authors.
 *
 * @param: authors (hash)
 *   keys are author names.
 */
function opr_render_authors(authors) {
  return opr_render_hash(
    authors,
    'opr-poster-authors',
    'opr-poster-author'
  );
}

/**
 * Renders keywords.
 *
 * @param: keywords (hash)
 *   keys are keywords.
 */
function opr_render_keywords(keywords) {
  return opr_render_field(keywords, 'opr-poster-keywords', opr.labels['keywords'][opr.lang]);
}

/**
 * Renders categories.
 *
 * @param: categories (hash)
 *   keys are categories.
 */
function opr_render_categories(categories) {
  return opr_render_hash(
    categories,
    'opr-poster-categories',
    'opr-poster-category',
    opr.labels['categories'][opr.lang]
  );
}

/**
 * Renders poster room.
 *
 * @param: room (string)
 *   a poster room identifier.
 */
function opr_render_room(room) {
  if ((typeof opr.meeting_room_base_url == 'undefined')
      || ('' == opr.meeting_room_base_url)) {
    return '';
  }
  return '<span class="opr-poster-room"><span class="opr-label">'
    + opr.labels['room'][opr.lang]
    + ':</span> <a href="'
    + opr.meeting_room_base_url
    + room
    + '" target="_blank">'
    + room
    + '</a></span>\n'
  ;
}

/**
 * Renders poster PDF link.
 *
 * @param: pdf (string)
 *   a poster pdf file name.
 */
function opr_render_pdf(pdf) {
  if ((typeof opr.poster_base_url == 'undefined')
      || ('' == opr.poster_base_url)) {
    return '';
  }
  return '<span class="opr-poster-pdf">'
    + '<a href="'
    + opr.poster_base_url
    + pdf
    + '" target="_blank">'
    + opr.labels['pdf'][opr.lang]
    + '</a></span>\n'
  ;
}

/**
 * Renders poster thumbnail.
 *
 * @param: thumbnail (string)
 *   a poster thumbnail image file name.
 */
function opr_render_thumbnail(thumbnail) {
  if ((typeof opr.thumbnail_base_url == 'undefined')
      || ('' == opr.thumbnail_base_url)) {
    return '';
  }
  var html_block = '';
  if (jisset(thumbnail)) {
    html_block = '<span class="opr-poster-thumbnail">'
      + '<img alt="Poster preview" src="'
      + opr.thumbnail_base_url
      + thumbnail
      + '"/>'
      + '</span>\n'
    ;
  }
  else {
    html_block = '<span class="opr-no-thumbnail">No poster preview available</span>\n';
  }
  return html_block;
}

/**
 * Renders a poster object as HTML.
 *
 * @param poster (object)
 *   a poster hash from opr.posters array.
 *
 * @param index (int)
 *   The index of the poster in the displayed array. Can be null.
 */
function opr_render_poster(poster, index = null) {
  var poster_html =
    '<div class="opr-poster">\n  '
    + opr_render_number(poster['number']) + '&nbsp;'
    + opr_render_title(poster['title']) + '<br/>\n  '
    + opr_render_authors(poster['authors']) + '<br/>\n  '
    + (jisset(poster['categories'])
      ? opr_render_categories(poster['categories']) + '<br/>\n  '
      : '')
    + (jisset(poster['keywords'])
      ? opr_render_keywords(poster['keywords']) + '<br/><br/>\n  '
      : '')
    + opr_render_thumbnail(poster['thumbnail']) + '<br/>\n  '
    + (jisset(poster['room'])
      ? opr_render_room(poster['room']) + '\n  '
      : '')
    + (jisset(poster['poster'])
      ? opr_render_pdf(poster['poster']) + '\n'
      : '')
    + '</div>';
  return poster_html;
}

/**
 * Update Poster Gallery display.
 */
function opr_update_gallery() {
  // Clear gallery.
  $('#opr_gallery').empty();
  var displayed_poster_count = 0;
  var poster_count = 0;
  // Update poster display status.
  opr.posters.forEach(function (poster) {
    if (poster['init_display']) {
     ++poster_count;
    }
    poster['display'] = false;
    var category_match = (
      ((0 < $('#opr_categories_filter input:checked').length)
        && (0 < $('#opr_categories_filter input:not(:checked)').length))
      ? false
      : true
    );
    // Categories.
    for (key in poster['categories']) {
      if (opr.filters['categories'][key]) {
        category_match = true;
      }
    }
    // Authors.
    var author_match = (('' != $('#opr_authors_select').val()) ? false : true);
    if (!author_match) {
      for (key in poster['authors']) {
        if (opr.filters['authors'][key]) {
          author_match = true;
        }
      }
    }
    // Final display status.
    if (category_match
        && author_match
        && poster['match_title']
        && poster['match_keywords']
        && poster['match_number']
    ) {
      poster['display'] = poster['init_display'];
      // poster['display'] = (
      //   jisset(poster['title']) && jisset(poster['poster'])
      //   ? poster['init_display']
      //   : false
      // );
      if (poster['display']) {
        ++displayed_poster_count;
      }
    }

  });
  // Update HTML.
  $('#opr_poster_count').html(
    opr.labels['posters_count'][opr.lang]
    + ' '
    + displayed_poster_count
    + ' '
    + opr.labels['over'][opr.lang]
    + ' '
    + poster_count
    + ' '
    + opr.labels['posters'][opr.lang]
  );
  opr.posters.forEach(function (poster) {
    if (poster['display']) {
      $('#opr_gallery').append(opr_render_poster(poster));
    }
  });
}

/**
 * Initialize filters possible values.
 */
function opr_init_filters() {
  var key;
  opr.filter_list.forEach(function (filter_name) {
    opr.filters[filter_name] = {};
  });
  opr.posters.forEach(function (poster, index) {
    // Save initial display status.
    opr.posters[index]['init_display'] = poster['display'];
    opr.match_list.forEach(function (match_name) {
      poster['match_' + match_name] = true;
    });
    opr.filter_list.forEach(function (filter_name) {
      for (key in poster[filter_name]) {
        if (jisset(key)) {
          opr.filters[filter_name][key] = true;
        }
      }
    });
  });
}

/**
 * Render filter dropdown.
 */
function opr_render_filter_dropdown(filter_name, filter_label) {
  // Label.
  var $filter = $(
    '<div id="opr_'
    + filter_name
    + '_filter" class="opr-filter"><span class="opr-label">'
    + opr.labels[filter_label][opr.lang]
    + ':</span>&nbsp;</div>'
  );
  // Dropdown and its behavior.
  $('<select name="' + filter_name + '" id="opr_' + filter_name + '_select">\n</select>')
    .appendTo($filter)
    .append('<option value="" selected="selected">-</option>\n')
    .on('change', function () {
      // An element has been selected.
      if ('' != $(this).val()) {
        for (key in opr.filters[filter_name]) {
          if ($(this).val() == key) {
            // Selected element.
            opr.filters[filter_name][key] = true;
          }
          else {
            // Other unselected element.
            opr.filters[filter_name][key] = false;
          }
        }
      }
      else {
        // No element selected, disable filter (all elements "on").
        for (key in opr.filters[filter_name]) {
          opr.filters[filter_name][key] = true;
        }
      }
      opr_update_gallery();
    })
  ;
  // Now add elements to the dropdown list.
  var elements = [];
  for (key in opr.filters[filter_name]) {
    elements.push(key);
  }
  // Sort elements.
  elements = elements.sort(Intl.Collator().compare);
  // Add options.
  elements.forEach(function (element) {
    $filter.find('#opr_' + filter_name + '_select')
      .append('<option value="' + element + '">' + element + '</option>\n')
    ;
  });

  return $filter;
}

/**
 * Render filter checkboxes.
 */
function opr_render_filter_checkboxes(filter_name, filter_label) {
  // Filter container.
  var $filter = $(
    '<div id="opr_'
    + filter_name
    + '_filter" class="opr-filter"><input type="checkbox" id="opr_'
    + filter_name
    + '_filter_master_checkbox" value="" checked="checked" class="opr-master-checkbox"/><label class="opr-label" for="opr_'
    + filter_name
    + '_filter_master_checkbox">'
    + opr.labels[filter_label][opr.lang]
    + ':</label><br/><div class="opr-checkbox-group"></div></div>'
  );
  // Master checkbox behavior.
  $filter.find('> input.opr-master-checkbox')
    .on('click', function () {
      $filter.find('input.opr-' + filter_name).prop('checked', this.checked);
      for (key in opr.filters[filter_name]) {
        opr.filters[filter_name][key] = this.checked;
      }
      opr_update_gallery();
    })
  ;
  var $checkbox_group = $filter.find('div.opr-checkbox-group');
  // Filtering values.
  for (key in opr.filters[filter_name]) {
    var $checkbox_element = $('<div class="opr-checkbox"></div>');
    var checkbox_id = 'opr_' + filter_name + '_' + key.replace(/\W+/g, '_');
    $(
      '<input id="'
      + checkbox_id
      + '" type="checkbox" value="'
      + key
      + '"'
      + (opr.filters[filter_name][key]
          ? ' class="opr-' + filter_name + '" checked="checked"'
          : ''
        )
      + '/>'
    )
      .appendTo($checkbox_element)
      .on('change', function() {
        opr.filters[filter_name][$(this).val()]= $(this).prop('checked');
        opr_update_gallery();
      })
    ;
    var label = key;
    if (key in opr.labels) {
      label = opr.labels[key][opr.lang];
    }
    $checkbox_element
      .append('&nbsp;<label for="' + checkbox_id + '">' + label + '</label>');
    $checkbox_group
      .append($checkbox_element);
  }

  $filter.append('<br style="clear: both;"/>');

  return $filter;
}

/**
 * Render filter text.
 */
function opr_render_filter_text(filter_name, filter_label) {
  // Filter container.
  var $filter = $(
    '<div id="opr_'
    + filter_name
    + '_filter" class="opr-filter"><label class="opr-label" for="opr_'
    + filter_name
    + '_filter_text">'
    + opr.labels[filter_label][opr.lang]
    + ':</label>&nbsp;<input type="text" id="opr_'
    + filter_name
    + '_filter_text" value="" class="opr-filter-'
    + filter_name
    + '-text"/><br/></div>'
  );
  // Text filtering behavior.
  $filter.find('#opr_'
    + filter_name
    + '_filter_text')
    .on('input', function () {
      if (jisset($(this).val())) {
        var search_text = $(this).val().toLocaleLowerCase();
        // Update posters' matching status.
        opr.posters.forEach(function (poster) {
          var poster_display = false;
          if (0 <= (''+poster[filter_name]).toLocaleLowerCase().indexOf(search_text)) {
            poster_display = true;
          }
          poster['match_' + filter_name] = poster_display;
        });
      }
      else {
        // No text, show all.
        opr.posters.forEach(function (poster) {
          poster['match_' + filter_name] = true;
        });
      }
      opr_update_gallery();
    })
  ;

  return $filter;
}

/**
 * Render filter bar.
 */
function opr_render_filters() {
  var key;
  $('#online_poster_room_browser').prepend('<div id="opr_filters"></div>');

  // Categories filter.
  $('#opr_filters').append( opr_render_filter_checkboxes('categories', 'categories') );
  $('#opr_filters').append( '<br/>' );

  // Title filter.
  $('#opr_filters').append( opr_render_filter_text('title', 'title_filter') );
  $('#opr_filters').append( '<br/>' );

  // Keywords filter.
  $('#opr_filters').append( opr_render_filter_text('keywords', 'keywords_filter') );
  $('#opr_filters').append( '<br/>' );

  // Authors filter.
  $('#opr_filters').append( opr_render_filter_dropdown('authors', 'authors') );
  $('#opr_filters').append( '<br/>' );

  // Number filter.
  $('#opr_filters').append( opr_render_filter_text('number', 'number_filter') );
  $('#opr_filters').append( '<br/>' );

}

/******************************************************************************/

// Initialize the whole broswer.
function init_online_poster_room(opr) {

  // Init what's needed.
  if (typeof opr.poster_show == 'undefined') {
    opr.poster_show = 0;
  }

  // Poster data.
  if (typeof opr.posters == 'undefined') {
    opr.posters = [];
  }

  if (typeof opr.lang == 'undefined') {
    if ((typeof lang == 'undefined') || ('fr' == lang)) {
      opr.lang = 'fr';
    }
    else {
      opr.lang = 'en';
    }
  }

  if (typeof opr.labels == 'undefined') {
    opr.labels = {
      closed: {
        en: 'The virtual poster room is currently closed. Please come back later, thanks for your visit.',
        fr: 'La salle virtuelle des posters est actuellement fermée. Veuillez repasser plus tard, merci pour votre visite.'
      },
      authors: {
        en: 'Authors',
        fr: 'Auteurs'
      },
      institutes: {
        en: 'Institutes',
        fr: 'Instituts'
      },
      keywords: {
        en: 'Keywords',
        fr: 'Mots clés'
      },
      categories: {
        en: 'Categories',
        fr: 'Categories'
      },
      room: {
        en: 'Room',
        fr: 'Salle'
      },
      pdf: {
        en: 'Download PDF',
        fr: 'Télécharger le PDF'
      },
      title_filter: {
        en: 'Title contains',
        fr: 'Le titre contient'
      },
      keywords_filter: {
        en: 'Containing keywords',
        fr: 'Contenant les mots clés'
      },
      number_filter: {
        en: 'Poster number',
        fr: 'Numéro du poster'
      },
      posters_count: {
        en: 'Displaying',
        fr: 'Selection de '
      },
      over: {
        en: 'over',
        fr: 'sur'
      },
      posters: {
        en: 'posters',
        fr: 'posters'
      },
      NGS: {
        en: "Algo/NGS",
        fr: "Algo/NGS"
      },
      service: {
        en: "Database &amp; Service",
        fr: "Base de données &amp; service"
      },
      evolution: {
        en: "Evolution, phylogenetics and population genetics",
        fr: "Évolution, phylogénétique et génétique des populations"
      },
      'functional genomics': {
        en: "Functional genomics",
        fr: "Génomique fonctionnelle"
      },
      metabolomics: {
        en: "Metabolomics",
        fr: "Métabolomique"
      },
      metagenomics: {
        en: "Metagenomics",
        fr: "Métagénomique"
      },
      FAIR: {
        en: "Reproductibility, open science, workflows, FAIR",
        fr: "Reproductibilité, open science, workflows, FAIR"
      },
      stat: {
        en: "Statistics, Machine Learning and AI",
        fr: "Statistiques, Machine Learning et I.A."
      },
      structure: {
        en: "Structural bioinformatics &amp; Protein annotations",
        fr: "Bioinformatique Structurelle &amp; Annotation des Protéines"
      },
      system: {
        en: "Systems Biology",
        fr: "Biologie des systèmes"
      },
      medicine: {
        en: "Variant calling &amp; Medicine",
        fr: "Variant calling &amp; Médecine"
      },
      visualization: {
        en: "Visualization",
        fr: "Visualisation"
      }
    };
  }

  if (typeof opr.meeting_room_base_url == 'undefined') {
    opr.meeting_room_base_url = '';
  }

  if (typeof opr.poster_base_url == 'undefined') {
    opr.poster_base_url = '';
  }

  if (typeof opr.thumbnail_base_url == 'undefined') {
    opr.thumbnail_base_url = '';
  }

  // Filters data.
  if (typeof opr.filter_list == 'undefined') {
    opr.filter_list = ['categories', 'authors'];
  }
  if (typeof opr.match_list == 'undefined') {
    opr.match_list = ['title', 'keywords', 'number'];
  }
  if (typeof opr.filters == 'undefined') {
    opr.filters = {};
  }

  var url_params = new URLSearchParams(window.location.search);
  var poster_bypass = url_params.get('poster_bypass');
  // Merci à ceux qui utilisent 'poster_bypass' de le garder pour eux. ;-)
  if (opr.poster_show || poster_bypass) {
    opr_init_filters();
    opr_render_filters();
    $('#online_poster_room_browser')
      .append('<div id="opr_poster_count"></div>')
      .append('<div id="opr_gallery"></div>');
    opr_update_gallery();
  }
  else {
    $('#online_poster_room_browser')
      .append('<div>' + opr.labels['closed'][opr.lang] + '</div>');
  }
}
